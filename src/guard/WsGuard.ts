import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import TokenUtil from 'src/utils/constants/tokenUtils'

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const socket = context.switchToWs().getClient<Socket>()
    const bearerToken = socket.handshake?.headers?.authorization || ''
    const [_, token] = TokenUtil.getTokenString(bearerToken)
    try {
      this.jwtService.verify(token)
    } catch (e) {
      throw new WsException('Unauthorized')
    }
    return true
  }
}
