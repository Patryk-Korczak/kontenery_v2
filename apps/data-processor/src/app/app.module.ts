import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from './entry.entity';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Data, DataSchema } from './data.schema';


export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://localhost/data'),
  },
];
@Module({
  imports:[
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'devices',
      migrationsRun: false,
      synchronize: true,
      dropSchema: false,
      logging: false,
      entities: [Entry],
    }),
    TypeOrmModule.forFeature([Entry]),
    MongooseModule.forRoot('mongodb://localhost/data'),
    MongooseModule.forFeature([{ name: Data.name, schema: DataSchema }]),
  ],
  controllers: [AppController],
  providers: [],
  exports: []
})
export class AppModule {}
