import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Data, DataSchema } from './data.schema';

@Module({
  imports:[
    MongooseModule.forRoot('mongodb://device-db/data'),
    MongooseModule.forFeature([{ name: Data.name, schema: DataSchema }]),
  ],
  controllers: [AppController],
  providers: [],
  exports: []
})
export class AppModule {}
