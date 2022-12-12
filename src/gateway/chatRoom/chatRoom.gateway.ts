import { Inject, Logger, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SubscribeMessage, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketClient } from 'src/core/SocketClient'
import { WsGuard } from 'src/guard/WsGuard'
import { JWTClaim } from 'src/module/v1/auth/auth.interface'
import { MessageService } from 'src/module/v1/message/message.service'
import TokenUtil from 'src/utils/constants/tokenUtils'
import { ChatBirdGateway } from '../core/app.gateway'
import { Message } from './chatRoom.interface'

export class ChatRoomGateway extends ChatBirdGateway {
  @WebSocketServer()
  private server: Server
  private logger: Logger = new Logger(ChatRoomGateway.name)
  @Inject('SOCKET_CLIENT')
  private readonly socketClient: SocketClient
  @Inject()
  private readonly jwtService: JwtService
  @Inject()
  private readonly messageService: MessageService

  constructor() {
    super()
  }

  @SubscribeMessage('messages')
  @UseGuards(WsGuard)
  async receiveMessage(client: Socket, payload: Message) {
    const bearerToken = client.handshake.headers.authorization
    const [_, token] = TokenUtil.getTokenString(bearerToken)
    const claims: JWTClaim = this.jwtService.verify(token)
    const messageObj = await this.messageService.addMessage(
      payload.roomID,
      payload.value,
      claims.userID
    )
    this.server.emit(payload.roomID, messageObj)
    this.socketClient.connect(bearerToken)
    this.socketClient.emit('notification', {})
  }
}
