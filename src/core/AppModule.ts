import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AllExceptionsFilter } from 'src/filter/all-exception.filter'
import { AuthGuard } from 'src/guard/AuthGuard'
import { MessageModule } from 'src/module/v1/message/message.module'
import { RoomModule } from 'src/module/v1/room/room.module'
import { UserModule } from 'src/module/v1/user/user.module'
import { AuthModule } from '../module/v1/auth/auth.module'
import { CoreModule } from './CoreModule'

@Module({
  imports: [CoreModule, ConfigModule, AuthModule, UserModule, RoomModule, MessageModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
