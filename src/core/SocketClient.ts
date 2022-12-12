import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { io, Socket } from 'socket.io-client'
;('use strict')

@Injectable()
export class SocketClient {
  private socketClient: Socket
  constructor(private readonly configService: ConfigService) {}

  public connect = (token: string) => {
    this.socketClient = io(this.configService.get('SOCKET_URL'), {
      extraHeaders: {
        Authorization: token,
      },
    })
  }
  public emit = (ev: string, ...args: any) => {
    this.socketClient.emit(ev, ...args)
  }
}
