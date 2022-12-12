import { UseFilters } from '@nestjs/common'
import { WebSocketGateway } from '@nestjs/websockets'
import { WsExceptionsFilter } from 'src/filter/ws-exception.filter'

@WebSocketGateway(80, { cors: true })
@UseFilters(WsExceptionsFilter)
export class ChatBirdGateway {
  constructor() {}
}
