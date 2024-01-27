import { Controller, Get } from '@nestjs/common';


import { InjectModel } from '@nestjs/mongoose';
import { Data } from './data.schema';
import { Model } from 'mongoose';

@Controller("v1")
export class AppController {
  constructor(
    @InjectModel(Data.name)
    private dataModel: Model<Data>
  ) {}

  @Get(`series`)
  async getSeries() {
    /**
     * @author ChatGPT
     */
    function transformForHighcharts(data) {
      const seriesData = {};

      data.forEach(entry => {
        // Convert timestamp to Unix timestamp in milliseconds
        const timestamp = new Date(entry.timestamp).getTime();

        const deviceId = entry.deviceId;
        const payload = entry.payload;

        // Initialize the device data list if it doesn't exist
        seriesData[deviceId] = seriesData[deviceId] || [];

        // Append the data point [timestamp, payload] to the relevant device
        seriesData[deviceId].push([timestamp, payload]);
      });

      // Prepare the final series format for Highcharts
      return Object.keys(seriesData).map(deviceId => {
        return {
          name: deviceId,
          data: seriesData[deviceId]
        };
      });
    }

    const data = await this.dataModel.find().exec();
    return transformForHighcharts(data);
  }

  @Get(`data`)
  async getData() {
    const data = await this.dataModel.find().exec();
    return (data);
  }

  // @Get('/v1/device')
  // async getDevices(@Payload() message: DataEvent) {
  //   return await this.dataModel.
  // }
}
