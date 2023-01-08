# wancoin
private point project on HYPERLEDGER IROHA

## CDK
デプロイ
```
npx -w infra cdk deploy --profile [profile_name]
```

EC2インスタンスへの接続、rootでログインし直す
```
aws ssm start-session --target [instance_id] --profile [profile_name]
sudo su --login root
```