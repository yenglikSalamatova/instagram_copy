FROM node:18


WORKDIR /app


COPY package*.json ./


RUN npm install



COPY . /app


ENV NODE_ENV production

EXPOSE 3000

CMD ["node", "server.js"]
