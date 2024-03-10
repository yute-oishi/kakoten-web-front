### github actions 用 S3 自動デプロイ最小構成ポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Deploy",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": ["arn:aws:s3:::{バケット名}/*", "arn:aws:s3:::{バケット名}"]
    }
  ]
}
```

### .env sample

```
VITE_BACKEND_API_KEY=***
VITE_BACKEND_BASE_URL=https://kako-ten.com/prod
VITE_RRCAPTCHA_SITEKEY=***
VITE_AMEDAS_OBSLIST_URL=https://www.jma.go.jp/bosai/amedas/const/amedastable.json
```
