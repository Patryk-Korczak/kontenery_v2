FROM node:18-alpine as production

ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production && npm cache clean --force

# Bundle app source
COPY ./main.js ./main.js

# start app
USER node
CMD [ "node", "main.js" ]
EXPOSE 1883
