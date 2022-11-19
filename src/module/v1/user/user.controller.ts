import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Req,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { ParamNotFoundException } from 'src/exceptions/param.exception'
import { Authorization } from 'src/guard/AuthGuard'
import TokenUtil from 'src/utils/constants/tokenUtils'
import { JWTClaim } from '../auth/auth.interface'
import { AddFriendDTO, RemoveFriendDTO } from './user.dto'
import UserService from './user.service'

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  private readonly logger = new Logger(UserController.name)
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @Get(':id')
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserInfo(@Param('id') id: string, @Req() request: Request) {
    const { hostname } = request
    if (!id) {
      throw new ParamNotFoundException('Param id is not enter')
    }
    try {
      this.logger.log(`${hostname}- getUserInfo`)
      return await this.userService.getUserInfo(id)
    } catch (e) {
      this.logger.error(`${hostname}- getUserInfo: ${e}`)
      throw new BadRequestException(e.message)
    }
  }

  @Patch('addFriend')
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addFriend(@Body() body: AddFriendDTO, @Req() request: Request) {
    const { hostname } = request
    const { userID } = body
    const authorization = request.headers.authorization
    try {
      this.logger.log(`${hostname}- addFriend`)
      const [_, token] = TokenUtil.getTokenString(authorization)
      const claims: JWTClaim = this.jwtService.verify(token)
      return await this.userService.addFriend(userID, claims.userID)
    } catch (e) {
      this.logger.error(`${hostname}- addFriend: ${e}`)
      throw new BadGatewayException(e.message)
    }
  }

  @Patch('removeFriend')
  @Authorization()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeFriend(@Body() body: RemoveFriendDTO, @Req() request: Request) {
    const { hostname } = request
    const { userID } = body
    const authorization = request.headers.authorization
    try {
      this.logger.log(`${hostname}- removeFriend`)
      const [_, token] = TokenUtil.getTokenString(authorization)
      const claims: JWTClaim = this.jwtService.verify(token)
      return await this.userService.removeFriend(userID, claims.userID)
    } catch (e) {
      this.logger.error(`${hostname}- removeFriend: ${e}`)
      throw new BadGatewayException(e.message)
    }
  }

  @Get(':id/rooms')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Authorization()
  async getRooms(@Param('id') id: string, @Req() request: Request) {
    const { hostname } = request
    if (!id) {
      throw new ParamNotFoundException('Param id is not enter')
    }
    try {
      this.logger.log(`${hostname}- getRooms`)
      return await this.userService.getRoomByUser(id)
    } catch (e) {
      this.logger.error(`${hostname}- getRooms: ${e}`)
      throw new BadRequestException(e.message)
    }
  }
}
