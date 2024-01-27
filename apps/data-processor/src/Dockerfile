FROM node:18-alpine as production

ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node ./main.js ./main.js

RUN npm i --only=production && npm cache clean --force

USER node

CMD [ "node", "/usr/src/app/main.js" ]
