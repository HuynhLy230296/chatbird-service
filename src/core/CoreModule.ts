import { Global, Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import * as Joi from 'joi'
import { SocketClient } from './SocketClient'

const validationEnv = Joi.object({
  APP_PREFIX: Joi.string().required(),
  APP_OPENAPI_PREFIX: Joi.string().required(),

  APP_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  APP_PORT: Joi.number().default(3000),

  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_STORAGE_BUCKET: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRED_IN: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRED_IN: Joi.string().required(),

  SOCKET_URL: Joi.string().required(),
})

const providers: Provider[] = [
  {
    provide: 'SOCKET_CLIENT',
    useClass: SocketClient,
  },
]
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: validationEnv,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
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
  ],
  providers: providers,
  exports: [JwtModule, ...providers],
})
export class CoreModule {}
