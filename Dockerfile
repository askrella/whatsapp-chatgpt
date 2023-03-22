FROM node:bullseye-slim

RUN apt update
# components for whatsapp-web.js (support no-gui systems)
RUN apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
RUN apt install -y chromium

# For transcription
RUN apt install -y ffmpeg
## It will install latest model of OpenAI Whisper (around 6~7 GB)
## Uncomment below command if you want to use the local version of transcription module
# RUN pip install -y python pip
# RUN pip install -U openai-whisper

WORKDIR /app/

ENV OPENAI_API_KEY ""
ENV PREFIX_ENABLED ""

COPY package.json package-lock.json ./

RUN npm install
RUN npm install vite-node

COPY . .

CMD ["npm", "run", "start"]
