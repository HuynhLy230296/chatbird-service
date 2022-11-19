import { Module } from '@nestjs/common'
import { RepositoryModule } from 'src/repository'
import { MessageController } from './message.controller'
import { MessageService } from './message.service'

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [RepositoryModule],
  exports: [MessageService],
})
export class MessageModule {}
