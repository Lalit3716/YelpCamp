FROM node:16-alpine

WORKDIR /app

COPY package* ./

RUN npm install
RUN npm install -g nodemon

EXPOSE 3000

CMD ["npm", "run", "dev"]
