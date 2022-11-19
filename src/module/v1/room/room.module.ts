import { Module } from '@nestjs/common'
import { RepositoryModule } from 'src/repository'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [RepositoryModule],
  exports: [RoomService],
})
export class RoomModule {}
