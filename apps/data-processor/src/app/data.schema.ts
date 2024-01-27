import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export abstract class ObjectIdSchema {
  @Prop()
  readonly _id: ObjectId;
}

export type DeviceDataDocument = HydratedDocument<Data>;

@Schema({
  collection: 'data',
  versionKey: false,
})
export class Data extends ObjectIdSchema {
  @Prop({
    isRequired: true,
  })
  deviceId: string;

  @Prop({
    type: Number,
    of: Number,
    required: true,
  })
  payload: number;

  @Prop({
    type: String,
    of: String,
  })
  timestamp: string;
}

export const DataSchema = SchemaFactory.createForClass(Data);

DataSchema.index({
  deviceId: 'text',
});

DataSchema.index({
  timestamp: 'ascending',
});
