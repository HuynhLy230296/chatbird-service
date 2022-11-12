import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { Authorization } from 'src/guard/AuthGuard'
import * as COOKIE from 'src/utils/constants/cookie'
import { LoginDTO } from './auth.dto'
import { AuthService } from './auth.service'

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  private readonly logger = new Logger(AuthService.name)
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @UsePipes(ValidationPipe)
  async login(@Body() body: LoginDTO, @Req() request: Request, @Res() response: Response) {
    const { hostname } = request
    try {
      this.logger.log(`${hostname}- Login`)
      const { idToken } = body
      const [accessToken, refreshToken] = await this.authService.login(idToken)
      response.cookie(COOKIE.KEYS.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
      })
      const result = { accessToken }
      return response.send(result)
    } catch (e) {
      this.logger.error(`${hostname}- Login: ${e}`)

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: e.message,
        error: 'Bad request',
      })
    }
  }
  @Post('refreshToken')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@Req() request: Request) {
    const { hostname } = request
    try {
      this.logger.log(`${hostname}- RefreshToken`)
      const refreshToken = request.cookies[COOKIE.KEYS.REFRESH_TOKEN]
      const accessToken = await this.authService.refreshToken(refreshToken)
      const result = { accessToken }
      return result
    } catch (e) {
      this.logger.error(`${hostname}- RefreshToken: ${e}`)
      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException()
      }
      throw new BadRequestException(e.message)
    }
  }
  @Post('logout')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiBearerAuth()
  @Authorization()
  logout(@Req() request: Request, @Res() response: Response) {
    try {
      this.logger.log(`${request.hostname}- Logout`)
      response.clearCookie(COOKIE.KEYS.REFRESH_TOKEN)
      return
    } catch (e) {
      this.logger.error(`${request.hostname}- Logout: ${e}`)
      throw new BadRequestException(e.message)
    }
  }
}
