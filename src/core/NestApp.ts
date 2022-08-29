import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './AppModule'

export class NestApp {
  private app: INestApplication = null
  private booted: boolean = false

  public async boot() {
    this.app = await NestFactory.create(AppModule)
    this.app.enableCors()
    this.booted = true
    return this
  }

  public async run(port: number = 3000) {
    if (this.booted) {
      await this.app.listen(port)
    }
  }
}
