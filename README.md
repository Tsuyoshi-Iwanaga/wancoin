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
-d '{"id": "test01", "domain": "test"}' \
http://localhost:3000/user
```

アセット追加
```
curl -X POST -H "Content-Type: application/json" \
-d '{"account": "admin@test", "amount": "100"}' \
http://localhost:3000/coin/add
```

アセット転送
```
curl -X POST -H "Content-Type: application/json" \
-d '{"account_from": "test01@test", "account_to": "test02@test", "amount": "1", "message": "test"}' \
http://localhost:3000/coin/transfer
```

トランザクション確認
```
curl -X GET 'http://localhost:3000/tx?account=admin@test'
```

ユーザ情報追加
```
curl -X POST -H "Content-Type: application/json" \
-d '{"account": "test01@tci", "key": "key", "value": "value"}' \
http://localhost:3000/user/set_detail
```