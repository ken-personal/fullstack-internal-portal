import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  { user: "田中 一郎", action: "新規注文を登録",     time: "2分前" },
  { user: "佐藤 花子", action: "経費レポートを提出", time: "15分前" },
  { user: "鈴木 次郎", action: "社員情報を更新",     time: "1時間前" },
  { user: "山田 三郎", action: "問い合わせを受信",   time: "3時間前" },
  { user: "伊藤 四郎", action: "月次レポートを承認", time: "昨日" },
];

export default function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近のアクティビティ</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {activities.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-0.5 h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600 shrink-0">
                {a.user[0]}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{a.user}</span>が{a.action}
                </p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}