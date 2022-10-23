import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import useTransaction from 'src/database/hook/useTransaction'
import User from 'src/entities/User'
import UserRepository from 'src/repository/UserRepository'
import { FirebaseAuth } from '../firebase/firebaseAuth.service'

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

    const user: User = {
      email: decodedIdToken.email,
      loginProvider: decodedIdToken.firebase.sign_in_provider,
      name: decodedIdToken.name,
      picture: decodedIdToken.picture,
    }

    const existUser = await this.userRepository.findUserByEmail(decodedIdToken.email)

    let userID: string
    if (!existUser) {
      await useTransaction(async () => {
        userID = await this.userRepository.insert(user)
      })
    } else {
      userID = existUser.id
    }

    const refreshToken = this.jwtService.sign(
      { userID: userID },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRED_IN'),
      }
    )
    const claims = { email: decodedIdToken.email, name: decodedIdToken.name }
    const accessToken = this.jwtService.sign(claims)

    return [accessToken, refreshToken]
  }
}
