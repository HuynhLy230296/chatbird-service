import { ApiProperty } from '@nestjs/swagger'

export class LoginDTO {
  @ApiProperty({
    required: false,
    nullable: true,
  })
  idToken: string
}
