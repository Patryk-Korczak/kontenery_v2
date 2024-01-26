FROM node:18-alpine as production

ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY ./main.js ./main.js

# Install cron and set up the cron job
RUN apt-get update && apt-get -y install cron
RUN echo "*/30 * * * * /usr/src/app/node /usr/src/app/dist/producer.js >> /var/log/cron.log 2>&1" | crontab -

# Run the cron job in the foreground
CMD cron -f
