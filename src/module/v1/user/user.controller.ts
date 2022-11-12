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
import { Authorization } from 'src/guard/AuthGuard'
import TokenUtil from 'src/utils/constants/tokenUtils'
import { JWTClaim } from '../auth/auth.interface'
import { AddFriendDTO, GetRoomsParams, GetUserInfoParams, RemoveFriendDTO } from './user.dto'
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
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Authorization()
  async getUserInfo(@Param() params: GetUserInfoParams, @Req() request: Request) {
    const { hostname } = request
    const { id } = params
    try {
      return await this.userService.getUserInfo(id)
    } catch (e) {
      this.logger.error(`${hostname}- removeFriend: ${e}`)
      throw new BadRequestException(e.message)
    }
  }
  @Authorization()
  @Patch('addFriend')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async addFriend(@Body() body: AddFriendDTO, @Req() request: Request) {
    const { hostname } = request
    const { userID } = body
    const authorization = request.headers.authorization
    try {
      const [_, token] = TokenUtil.getTokenString(authorization)
      const claims: JWTClaim = this.jwtService.verify(token)
      return await this.userService.addFriend(userID, claims.userID)
    } catch (e) {
      this.logger.error(`${hostname}- addFriend: ${e}`)
      throw new BadGatewayException(e.message)
    }
  }
  @Authorization()
  @Patch('removeFriend')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async removeFriend(@Body() body: RemoveFriendDTO, @Req() request: Request) {
    const { hostname } = request
    const { userID } = body
    const authorization = request.headers.authorization
    try {
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
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Authorization()
  async getRooms(@Param() params: GetRoomsParams, @Req() request: Request) {
    const { id } = params
    const { hostname } = request
    try {
      return await this.userService.getRoomByUser(id)
    } catch (e) {
      this.logger.error(`${hostname}- getRooms: ${e}`)
      throw new BadRequestException(e.message)
    }
  }
}
