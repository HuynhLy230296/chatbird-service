import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './AppModule'
import Firebase from './Firebase'
import OpenAPI from './OpenAPI'
import validationOptions from './ValidationOptions'

export class NestApp {
  private app: INestApplication = null
  private booted: boolean = false
  private configService: ConfigService = null

  public async boot() {
    Firebase.boot()
    this.app = await NestFactory.create(AppModule)
    this.configService = this.app.get(ConfigService)
    this.app.enableCors()
    this.app.setGlobalPrefix(this.configService.get('APP_PREFIX'))
    this.app.enableVersioning({ type: VersioningType.URI })
    this.app.use(cookieParser())
    this.app.useGlobalPipes(new ValidationPipe(validationOptions))
    OpenAPI.setup(this.app)

    this.booted = true
    return this
  }

  public async run() {
    if (this.booted) {
      await this.app.listen(this.configService.get('APP_PORT'))
    }
  }
  public close = () => this.app.close()
}
