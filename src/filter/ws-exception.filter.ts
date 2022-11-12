import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@Catch(WsException)
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const [, messageLost] = host.getArgs()
    const client = host.switchToWs().getClient<Socket>()
    const data = host.switchToWs().getData()
    const error = exception.getError()
    const details = error instanceof Object ? { ...error } : { message: error }
    const payload = {
      id: client.id,
      rid: data.rid,
      statusCode: 400,
      messageLost: messageLost,
      ...details,
    }
    client.emit('error', payload)
  }
}
