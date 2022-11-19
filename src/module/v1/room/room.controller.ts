import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { Authorization } from 'src/guard/AuthGuard'
import { AddMemberDTO, CreateRoomDTO, RemoveMemberDTO, UpdateRoomDTO } from './room.dto'
import { RoomService } from './room.service'

@ApiTags('Room')
@Controller({
  path: 'room',
  version: '1',
})
export class RoomController {
  private readonly logger = new Logger(RoomController.name)
  constructor(private readonly roomService: RoomService) {}

  @Get(':id')
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInfo(@Param('id') id: string, @Req() request: Request) {
    const { hostname } = request
    try {
      return await this.roomService.getRoomInfo(id)
    } catch (e) {
      this.logger.error(`${hostname}- getInfo: ${e}`)
      throw new BadRequestException(e.messages)
    }
  }

  @Post()
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createRoom(@Body() body: CreateRoomDTO, @Req() request: Request) {
    const { hostname } = request
    try {
      return this.roomService.createRoom(body)
    } catch (e) {
      this.logger.error(`${hostname}- getInfo: ${e}`)
      throw new BadRequestException(e.messages)
    }
  }

  @Patch(':id/addMember')
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addMember(@Param('id') id: string, @Body() body: AddMemberDTO, @Req() request: Request) {
    const { hostname } = request
    try {
      const { userID } = body
      return await this.roomService.addMember(id, userID)
    } catch (e) {
      this.logger.error(`${hostname}- getInfo: ${e}`)
      throw new BadRequestException(e.messages)
    }
  }

  @Patch(':id/removeMember')
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeMember(
    @Param('id') id: string,
    @Body() body: RemoveMemberDTO,
    @Req() request: Request
  ) {
    const { hostname } = request
    try {
      const { userID } = body
      return await this.roomService.removeMember(id, userID)
    } catch (e) {
      this.logger.error(`${hostname}- getInfo: ${e}`)
      throw new BadRequestException(e.messages)
    }
  }

  @Patch(':id')
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateInfo(@Param('id') id: string, @Body() body: UpdateRoomDTO, @Req() request: Request) {
    const { hostname } = request
    try {
      return await this.roomService.updateRoomInfo(id, body)
    } catch (e) {
      this.logger.error(`${hostname}- getInfo: ${e}`)
      throw new BadRequestException(e.messages)
    }
  }
}
