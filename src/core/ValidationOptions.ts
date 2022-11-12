import { BadRequestException, ValidationError } from '@nestjs/common'

const validationOptions = {
  exceptionFactory: (errors: ValidationError[]) => {
    const payload = {
      message: 'validate is error',
      cause: errors.map((o: ValidationError) => {
        const key = o.property
        const value = Object.values(o.constraints || {})[0] || ''
        return { [key]: value }
      }),
    }
    return new BadRequestException(payload)
  },
}
export default validationOptions
