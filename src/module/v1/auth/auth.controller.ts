import { Body, Controller, Post, Res } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import * as COOKIE from '../../../utils/constants/cookie'
import { LoginDTO } from './auth.dto'
import { AuthService } from './auth.service'
@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async login(@Body() body: LoginDTO, @Res() response: Response) {
    try {
      const { idToken } = body

      const [accessToken, refreshToken] = await this.authService.login(idToken)

      response.cookie(COOKIE.KEYS.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
      })
      const result = { accessToken }
      return response.send(result)
    } catch (e) {
      return response.status(403).send()
    }
  }
}
