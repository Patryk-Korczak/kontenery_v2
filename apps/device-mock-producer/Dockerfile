FROM node:18-alpine as production

ENV SLEEP_TIME 5
ENV NODE_ENV production
ENV MAIN_JS "/usr/src/app/main.js"

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node ./main.js ./main.js
COPY --chown=node:node ./run.sh ./run.sh

RUN npm ci --only=production && npm cache clean --force

USER node

CMD ["./run.sh"]
