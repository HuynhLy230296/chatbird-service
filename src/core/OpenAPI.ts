import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

class OpenAPI {
  public setup(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('chatbird-service')
      .setDescription('The chatbird-service api')
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    const configService = app.get(ConfigService)
    SwaggerModule.setup(configService.get('APP_OPENAPI_PREFIX'), app, document)
  }
}
export default new OpenAPI()
