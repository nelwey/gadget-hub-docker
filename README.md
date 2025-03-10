# gadget-hub-docker
Приложение Angular с архитектурой микросервисов (node.js), использующее API gateway nginx и Docker 

## Instructions
- login for mongo database => admin/pass
- use postman to add user and products (products.json)
## api
- http://localhost:8080/api/product
{"email": "andres@mail.ru","password": "123"}
- http://localhost:8080/api/auth/register

## build docker
- docker-compose up --build

## port
- 8080 for frontend
- 8081,8082,8083,8084 for db






