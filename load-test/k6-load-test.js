import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// ========== カスタムメトリクス ==========
const loginDuration   = new Trend('login_duration',   true);
const searchDuration  = new Trend('search_duration',  true);
const salesDuration   = new Trend('sales_duration',   true);
const errorRate       = new Rate('error_rate');
const requestCount    = new Counter('request_count');

// ========== 負荷シナリオ ==========
// smoke  : 動作確認（1VU / 30s）
// load   : 通常負荷（最大20VU / 2m）
// stress : 耐久テスト（最大50VU / 5m）
export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      tags: { scenario: 'smoke' },
    },
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },  // ランプアップ
        { duration: '1m',  target: 20 },  // 通常負荷
        { duration: '30s', target: 0  },  // ランプダウン
      ],
      startTime: '35s',
      tags: { scenario: 'load' },
    },
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 30 },
        { duration: '2m',  target: 50 },
        { duration: '30s', target: 0  },
      ],
      startTime: '175s',
      tags: { scenario: 'stress' },
    },
  },
  thresholds: {
    http_req_duration:  ['p(95)<500'],   // 95%ile が 500ms 以内
    http_req_failed:    ['rate<0.01'],   // エラー率 1% 未満
    login_duration:     ['p(95)<800'],
    search_duration:    ['p(95)<600'],
    sales_duration:     ['p(95)<400'],
    error_rate:         ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

// ========== ログインしてトークン取得 ==========
function login() {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: __ENV.TEST_EMAIL || 'test@example.com', password: __ENV.TEST_PASSWORD || 'password123' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  loginDuration.add(res.timings.duration);
  requestCount.add(1);

  const ok = check(res, {
    'login: status 200 or 201': (r) => r.status === 200 || r.status === 201,
    'login: token exists':      (r) => {
      try { return !!JSON.parse(r.body).token; } catch { return false; }
    },
  });
  errorRate.add(!ok);
  if (!ok) return null;

  return JSON.parse(res.body).token;
}

// ========== メインシナリオ ==========
export default function () {
  const token = login();
  if (!token) { sleep(1); return; }

  const headers = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // --- ダッシュボード ---
  const dashRes = http.get(`${BASE_URL}/dashboard`, { headers });
  requestCount.add(1);
  check(dashRes, { 'dashboard: status 200': (r) => r.status === 200 });
  errorRate.add(dashRes.status !== 200);

  sleep(0.5);

  // --- 全文検索 ---
  const keywords = ['田中', 'AWS', '経費', 'お知らせ', '問い合わせ'];
  const q = keywords[Math.floor(Math.random() * keywords.length)];
  const searchRes = http.get(`${BASE_URL}/search?q=${encodeURIComponent(q)}`, { headers });
  searchDuration.add(searchRes.timings.duration);
  requestCount.add(1);
  check(searchRes, { 'search: status 200': (r) => r.status === 200 });
  errorRate.add(searchRes.status !== 200);

  sleep(0.5);

  // --- 売上一覧 ---
  const salesRes = http.get(`${BASE_URL}/sales`, { headers });
  salesDuration.add(salesRes.timings.duration);
  requestCount.add(1);
  check(salesRes, { 'sales: status 200': (r) => r.status === 200 });
  errorRate.add(salesRes.status !== 200);

  sleep(0.5);

  // --- お知らせ一覧 ---
  const annoRes = http.get(`${BASE_URL}/announcements`, { headers });
  requestCount.add(1);
  check(annoRes, { 'announcements: status 200': (r) => r.status === 200 });
  errorRate.add(annoRes.status !== 200);

  sleep(1);
}
