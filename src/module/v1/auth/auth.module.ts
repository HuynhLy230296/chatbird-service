import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { RepositoryModule } from 'src/repository'
import { FirebaseAuthModule } from '../firebase/firebase.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRED_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    FirebaseAuthModule,
    RepositoryModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
