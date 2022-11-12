import { Module } from '@nestjs/common'
import { RepositoryModule } from 'src/repository'
import { UserController } from './user.controller'
import UserService from './user.service'

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [RepositoryModule],
  exports: [UserService],
})
export class UserModule {}
