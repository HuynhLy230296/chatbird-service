import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import * as COOKIE from 'src/utils/constants/cookie'
import TokenUtil from 'src/utils/constants/tokenUtils'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isRequired = this.reflector.getAllAndOverride<boolean>(AUTHORIZATION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isRequired) {
      const request: Request = context.switchToHttp().getRequest()
      const refreshToken = request.cookies[COOKIE.KEYS.REFRESH_TOKEN] || ''
      const jwtAccessToken = request.headers.authorization || ''
      const [_, accessToken] = TokenUtil.getTokenString(jwtAccessToken)

      try {
        this.jwtService.verify(refreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        })
        this.jwtService.verify(accessToken)
      } catch (e) {
        const { hostname } = request
        this.logger.error(`${hostname}- authGuard: ${e}`)
        throw new UnauthorizedException(e.message)
      }
    }
    return true
  }
}

export const AUTHORIZATION_KEY = 'Authorization'
export const Authorization = () => SetMetadata(AUTHORIZATION_KEY, true)
