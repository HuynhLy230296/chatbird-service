import { Body, Controller, Logger, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common'
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
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UsePipes(ValidationPipe)
  async login(@Body() body: LoginDTO, @Req() request: Request, @Res() response: Response) {
    try {
      this.logger.log(`${request.hostname}- Login`)
      const { idToken } = body
      const [accessToken, refreshToken] = await this.authService.login(idToken)
      response.cookie(COOKIE.KEYS.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
      })
      const result = { accessToken }
      return response.send(result)
    } catch (e) {
      this.logger.error(`${request.hostname}- Login: ${e}`)
      return response.status(403).end()
    }
  }
  @Post('refreshToken')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  refreshToken(@Req() request: Request, @Res() response: Response) {
    try {
      this.logger.log(`${request.hostname}- RefreshToken`)
      const refreshToken = request.cookies[COOKIE.KEYS.REFRESH_TOKEN]
      const accessToken = this.authService.refreshToken(refreshToken)
      const result = { accessToken }
      return response.status(200).send(result)
    } catch (e) {
      this.logger.error(`${request.hostname}- RefreshToken: ${e}`)
      return response.status(403).end()
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
      return response.status(200).end()
    } catch (e) {
      this.logger.error(`${request.hostname}- Logout: ${e}`)
      return response.status(400).end()
    }
  }
}
