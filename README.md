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

## IROHA
ユーザ情報照会
```
curl -X GET 'http://localhost:3000/user?account=admin@test'
```

ユーザ作成
```
curl -X POST -H "Content-Type: application/json" \
-d '{"id": "test01", "domain": "tci"}' \
http://localhost:3000/user
```

アセット追加
```
curl -X POST -H "Content-Type: application/json" \
-d '{"account": "admin@tci", "amount": "100"}' \
http://localhost:3000/coin/add
```

アセット転送
```
curl -X POST -H "Content-Type: application/json" \
-d '{"account_from": "test01@tci", "account_to": "test02@tci", "amount": "1", "message": "test"}' \
http://localhost:3000/coin/transfer
```