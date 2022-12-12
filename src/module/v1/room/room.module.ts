import { Module } from '@nestjs/common'
import { RepositoryModule } from 'src/repository'
import { MessageModule } from '../message/message.module'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [RepositoryModule, MessageModule],
  exports: [RoomService],
})
export class RoomModule {}
