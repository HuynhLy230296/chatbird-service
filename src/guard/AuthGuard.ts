import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import * as COOKIE from 'src/utils/constants/cookie'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const isRequired = this.reflector.getAllAndOverride<boolean>(AUTHORIZATION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isRequired) {
      const request: Request = context.switchToHttp().getRequest()
      const refreshToken = request.cookies[COOKIE.KEYS.REFRESH_TOKEN]
      const jwtAccessToken = request.headers.authorization
      const [, accessToken] = jwtAccessToken.split(' ')

      try {
        this.jwtService.verify(refreshToken)
        this.jwtService.verify(accessToken)
      } catch (e) {
        throw new ForbiddenException()
      }
    }
    return true
  }
}

export const AUTHORIZATION_KEY = 'Authorization'
export const Authorization = () => SetMetadata(AUTHORIZATION_KEY, true)
