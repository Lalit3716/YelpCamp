FROM node:12-alpine

WORKDIR /app

COPY package* ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
