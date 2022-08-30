import { INestApplication, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './AppModule'
import OpenAPI from './OpenAPI'

export class NestApp {
  private app: INestApplication = null
  private booted: boolean = false

  public async boot() {
    this.app = await NestFactory.create(AppModule)
    this.app.enableCors()
    this.app.setGlobalPrefix(process.env.APP_PREFIX)
    this.app.enableVersioning({ type: VersioningType.URI })
    OpenAPI.setup(this.app)

    this.booted = true
    return this
  }

  public async run(port: number = 3000) {
    if (this.booted) {
      await this.app.listen(port)
    }
  }
  public getApp = () => this.app
}
