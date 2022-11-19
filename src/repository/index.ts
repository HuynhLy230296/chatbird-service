import { Module } from '@nestjs/common'
import { MessageRepository } from './message.repository'
import RoomRepository from './room.repository'
import UserRepository from './user.repository'

@Module({
  providers: [UserRepository, RoomRepository, MessageRepository],
  exports: [UserRepository, RoomRepository, MessageRepository],
})
export class RepositoryModule {}
