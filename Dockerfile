FROM node:18-alpine

WORKDIR /app/

COPY . .

ENV OPENAI_API_KEY ""
ENV PREFIX_ENABLED ""
ENV GPT_PREFIX ""
ENV DALLE_PREFIX ""
ENV REPLY_SELF_ENABLED "true"


RUN apk update && \
    apk add --no-cache chromium && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk add -U --no-cache --allow-untrusted tzdata chromium ttf-freefont wqy-zenhei ca-certificates && \
    mkdir -p /app /logs && \
    npm install && \
    npm install vite-node

CMD ["npm", "run", "start"]