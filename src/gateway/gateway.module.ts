import { Module } from '@nestjs/common'
import { MessageModule } from 'src/module/v1/message/message.module'
import { ChatRoomGateway } from './chatRoom/chatRoom.gateway'

@Module({
  providers: [ChatRoomGateway],
  exports: [ChatRoomGateway],
  imports: [MessageModule],
})
export class GatewayModule {}
