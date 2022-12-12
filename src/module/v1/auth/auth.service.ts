import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import useTransaction from 'src/database/hook/useTransaction'
import User from 'src/entities/User'
import UserRepository from 'src/repository/user.repository'
import { FirebaseAuth } from '../firebase/firebaseAuth.service'
import { JWTClaim } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly firebaseAuth: FirebaseAuth,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) {}

  public async login(idToken: string) {
    const decodedIdToken = await this.firebaseAuth.vetifyIdToken(idToken)
    const user: Partial<User> = {
      email: decodedIdToken.email,
      loginProvider: decodedIdToken.firebase.sign_in_provider,
      name: decodedIdToken.name,
      picture: decodedIdToken.picture,
    }

    let userID: string
    try {
      const user = await this.userRepository.findUserByEmail(decodedIdToken.email)
      userID = user.id
    } catch (e) {
      userID = (await useTransaction(async () => {
        return this.userRepository.insert(user)
      })) as string
    }

    const claims: JWTClaim = {
      userID: userID,
      email: decodedIdToken.email,
      name: decodedIdToken.name,
    }
    const refreshToken = this.jwtService.sign(claims, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRED_IN'),
    })
    const accessToken = this.jwtService.sign(claims)
    return [accessToken, refreshToken]
  }

  public async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException()
    }
    const claims: JWTClaim = await this.jwtService
      .verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      })
      .then((tokenDecode) => {
        return {
          userID: tokenDecode.userID,
          email: tokenDecode.email,
          name: tokenDecode.name,
        }
      })
      .catch((e) => {
        throw new UnauthorizedException(e.message)
      })
    return this.jwtService.sign(claims)
  }
}
