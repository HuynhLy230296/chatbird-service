import { Module } from '@nestjs/common'
import { RepositoryModule } from 'src/repository'
import { MessageModule } from '../message/message.module'
import { RoomModule } from '../room/room.module'
import { UserController } from './user.controller'
import UserService from './user.service'

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [RepositoryModule, RoomModule, MessageModule],
  exports: [UserService],
})
export class UserModule {}
