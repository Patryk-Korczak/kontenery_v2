import {Controller, Get, Inject} from '@nestjs/common';


import {ClientKafka, MessagePattern, Payload} from '@nestjs/microservices';


type DataEvent = {
  deviceId: string;
  payload: number;
  timestamp: string;
}
@Controller()
export class AppController {
  constructor(
    @Inject('DATA_VALIDATOR_SERVICE')
    private readonly kafkaClient: ClientKafka
  ) {
  }

  @MessagePattern('data.event')
  validateData(@Payload() message: DataEvent) {
    console.log(message)
    if(message.deviceId == null) {
      this.kafkaClient.emit('data.unprocessable', message);
    } else {
      this.kafkaClient.emit('data.processable', message);
    }
  }
}
