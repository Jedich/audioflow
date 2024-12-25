FROM node:18

WORKDIR /app

COPY . .

RUN npm install

# Install Next.js alongside your other dependencies
RUN npm install next

RUN npm install react-h5-audio-player

EXPOSE 3000

CMD ["npm", "run", "dev"]