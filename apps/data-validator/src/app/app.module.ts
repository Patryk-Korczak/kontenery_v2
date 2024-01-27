import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ClientsModule, Transport} from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'DATA_VALIDATOR_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'data-validator',
          brokers: ['localhost:9011'],
        },
        producer: {
          allowAutoTopicCreation: true,
        },
      },
    },
  ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
