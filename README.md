### Build an environment

```bash
$ npm install

$ npm run dev
```

### Test

```bash
# eslint
$ npm run lint

# vitest
$ npm run test
$ npm run coverage

# cypress (window open)
$ npm run cypress:open

# cypress (component)
$ npm run cypress:run

# cypress (e2e)
$ npm run cypress:run-e2e
```

### Build and Deploy

```bash
# build
$ npm run build

# deploy to S3
$ aws s3 sync ./dist s3://BUCKET_NAME/ --delete
```

### Minimum policy for deploying to s3 by github actions

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
      "Resource": ["arn:aws:s3:::{BUCKET_NAME}/*", "arn:aws:s3:::{BUCKET_NAME}"]
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
