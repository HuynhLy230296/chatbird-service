import { Module } from '@nestjs/common'
import RoomRepository from './room.repository'
import UserRepository from './user.repository'

@Module({
  providers: [UserRepository, RoomRepository],
  exports: [UserRepository, RoomRepository],
})
export class RepositoryModule {}
