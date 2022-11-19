import { UseFilters } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WebSocketGateway } from '@nestjs/websockets'
import { WsExceptionsFilter } from 'src/filter/ws-exception.filter'
import { MessageService } from 'src/module/v1/message/message.service'

@WebSocketGateway(80, { cors: true })
@UseFilters(WsExceptionsFilter)
export class ChatBirdGateway {
  constructor(protected jwtService?: JwtService, protected messageService?: MessageService) {
    this.jwtService = jwtService
    this.messageService = messageService
  }
}
