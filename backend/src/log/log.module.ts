import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import LogSchema from './log.schema';  // Ensure correct import of LogSchema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }]),  // Register schema here
  ],
  providers: [LogService],
  controllers: [LogController],
  exports:[LogService],
})
export class LogModule {}
