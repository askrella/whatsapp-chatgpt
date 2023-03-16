FROM node:bullseye-slim

WORKDIR /app/

ENV OPENAI_API_KEY ""
ENV PREFIX_ENABLED ""
ENV PREFIX_ENABLED ""

RUN apt-get update
RUN apt-get install chromium ffmpeg -y

COPY package.json package-lock.json ./

RUN npm install
RUN npm install vite-node
COPY . .

CMD ["npm", "run", "start"]
