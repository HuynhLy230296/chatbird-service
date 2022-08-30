import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

class OpenAPI {
  public setup(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('chatbird-service')
      .setDescription('The chatbird-service api')
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup(process.env.APP_OPENAPI_PREFIX, app, document)
  }
}
export default new OpenAPI()
