# Используйте стабильный образ Node.js Alpine
FROM node:alpine3.20

# Установите рабочий каталог
WORKDIR /usr/src/app

# Скопируйте только необходимые файлы для установки NPM
COPY package*.json ./

# Установите NPM и Angular CLI глобально
RUN npm install -g npm@latest
RUN npm install -g @angular/cli@latest

# Установите зависимости проекта
COPY . .
RUN npm install

# Откройте порт сервера разработки Angular по умолчанию
EXPOSE 4200

# Запустите приложение Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000"]
