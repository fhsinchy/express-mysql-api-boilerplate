FROM node:lts

EXPOSE 3000

WORKDIR /usr/app

COPY ./package.json .
RUN npm install --production

COPY . .

CMD [ "npm", "run", "start" ]