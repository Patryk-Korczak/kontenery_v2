import {Controller, Get, Inject} from '@nestjs/common';


import {ClientKafka, MessagePattern, Payload} from '@nestjs/microservices';
import { Equal, Repository } from 'typeorm';
import { Entry } from './entry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { InjectModel } from '@nestjs/mongoose';
import { Data } from './data.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

type DataEvent = {
  deviceId: string;
  payload: number;
  timestamp: string;
}
@Controller()
export class AppController {
  constructor(
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
    @InjectModel(Data.name)
    private dataModel: Model<Data>
  ) {}

  private async addDevice(message: DataEvent) {
    const dbEntry = await this.entryRepository.findOneBy({deviceId: Equal(message.deviceId)});

    if (dbEntry === null) {
      await this.entryRepository.insert({
        deviceId: message.deviceId,
        timestamp: message.timestamp,
      });
    }
  }

  @MessagePattern('data.processable')
  async validateData(@Payload() message: DataEvent) {
    await this.addDevice(message);
    await new this.dataModel({
      _id: new ObjectId().toHexString(),
      deviceId: message.deviceId,
      payload: message.payload,
      timestamp: message.timestamp,
    }).save();
  }
}
