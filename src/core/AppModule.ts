import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from 'src/guard/AuthGuard'
import { AuthModule } from '../module/v1/auth/auth.module'
import { CoreModule } from './CoreModule'

@Module({
  imports: [CoreModule, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
