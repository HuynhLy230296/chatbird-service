import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RepositoryModule } from 'src/repository'
import { FirebaseAuthModule } from '../firebase/firebase.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ConfigModule, FirebaseAuthModule, RepositoryModule],
  exports: [AuthService],
})
export class AuthModule {}
