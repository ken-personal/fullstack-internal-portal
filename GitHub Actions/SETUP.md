# GitHub Actions セットアップガイド

## 📁 配置場所
このフォルダ内の `.github/workflows/` を、リポジトリのルートに配置してください。

```
fullstack-internal-portal/
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml   # フロントエンド CIワークフロー（PR時）
│       ├── frontend-cd.yml   # フロントエンド CDワークフロー（mainへのpush時）
│       ├── backend-ci.yml    # バックエンド CIワークフロー（PR時）
│       └── backend-cd.yml    # バックエンド CDワークフロー（mainへのpush時）
├── frontend/
├── backend-nestjs/
└── ...
```

---

## 🔑 GitHub Secrets の設定

GitHubリポジトリの `Settings → Secrets and variables → Actions` で以下を設定してください。

| Secret名 | 説明 | 取得方法 |
|----------|------|---------|
| `AWS_OIDC_ROLE_ARN` | OIDC用IAMロールのARN | AWSコンソール → IAM → ロール |
| `SNS_TOPIC_ARN` | 通知先SNSトピックのARN | AWSコンソール → SNS |
| `DATABASE_URL` | PrismaのDB接続URL | `postgresql://postgres:password@RDSエンドポイント:5432/portaldb` |

---

## 🔐 OIDC用IAMロールの作成手順（AWSコンソール）

### Step 1. GitHubのOIDCプロバイダーを追加
1. AWSコンソール → IAM → IDプロバイダー
2. 「プロバイダーを追加」をクリック
3. 以下を入力：
   - プロバイダーのタイプ: `OpenID Connect`
   - プロバイダーのURL: `https://token.actions.githubusercontent.com`
   - 対象者: `sts.amazonaws.com`

### Step 2. IAMロールを作成
1. IAM → ロール → 「ロールを作成」
2. 「カスタム信頼ポリシー」を選択し、以下を入力：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWSアカウントID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:ken-personal/fullstack-internal-portal:*"
        }
      }
    }
  ]
}
```

### Step 3. ポリシーをアタッチ
以下のポリシーをロールにアタッチ：
- `AmazonECS_FullAccess`
- `AmazonEC2ContainerRegistryFullAccess`
- `AmazonSNSFullAccess`

### Step 4. ARNをコピー
作成したロールのARNを `AWS_OIDC_ROLE_ARN` にセット

---

## 🚀 ワークフローの動作確認

### CIの確認（PR作成時）
```
1. featureブランチを作成
2. frontend/ か backend-nestjs/ を変更してpush
3. mainへのPRを作成
4. GitHub Actions タブでCIが実行されることを確認
```

### CDの確認（mainへのpush時）
```
1. PRをmainにマージ
2. GitHub Actions タブでCDが実行されることを確認
3. ECSコンソールでサービスが更新されることを確認
4. 登録メールにSNS通知が届くことを確認
```
