FROM node

WORKDIR /tmp/app/

COPY . .

RUN npm install
RUN npm install vite-node
RUN apt-get update
RUN apt-get install chromium -y
CMD ["npm","run","start"]