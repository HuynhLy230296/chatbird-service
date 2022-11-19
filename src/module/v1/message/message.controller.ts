import { BadRequestException, Controller, Get, Logger, Param, Req } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { Authorization } from 'src/guard/AuthGuard'
import { MessageService } from './message.service'

@ApiTags('Message')
@Controller({
  path: 'message',
  version: '1',
})
export class MessageController {
  private readonly logger = new Logger(MessageController.name)
  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService
  ) {}

  @Get(':room')
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLastMessage(@Param('room') roomID: string, @Req() request: Request) {
    const { hostname } = request
    try {
      return await this.messageService.getLastMessages(roomID)
    } catch (e) {
      this.logger.error(`${hostname}- getLastMessage: ${e}`)
      throw new BadRequestException(e.messages)
    }
  }

  @Get(':room/:group')
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMessagesByGroup(
    @Param('room') roomID: string,
    @Param('group') group: string,
    @Req() request: Request
  ) {
    const { hostname } = request
    try {
      return await this.messageService.getMessagesByGroup(roomID, group)
    } catch (e) {
      this.logger.error(`${hostname}- getMessagesByGroup: ${e}`)
      throw new BadRequestException(e.messages)
    }
  }
}
