import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDTO {
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsString()
  @IsNotEmpty()
  idToken: string
}
