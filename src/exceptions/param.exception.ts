import { HttpException, HttpStatus } from '@nestjs/common'

export class ParamNotFoundException extends HttpException {
  constructor(message = 'Param not found') {
    super(message, HttpStatus.NOT_FOUND)
  }
}
