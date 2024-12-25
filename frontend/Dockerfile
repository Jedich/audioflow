FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install react-h5-audio-player

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]