import { JsonController, Get } from 'routing-controllers';
import { HelloService } from '../service/HelloSerivce';
import { ILogger, Logger } from '../core/decorator/Logger';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { IsString } from 'class-validator';

export class HelloResponse {
  @IsString()
  public hello!: string;
}

@JsonController('/hello')
export class Helloword {
  constructor(private service: HelloService, @Logger(__filename) private log: ILogger) {}

  @Get('/')
  @OpenAPI({
    summary: 'Method get hello',
  })
  @ResponseSchema(HelloResponse, {
    description: 'is success',
    statusCode: '200',
  })
  @ResponseSchema(HelloResponse, {
    description: 'is faild',
    statusCode: '400',
  })
  public hello() {
    return { hello: this.service.hello() };
  }
}
