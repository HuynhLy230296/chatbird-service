import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AddFriendDTO {
  @IsString({ message: 'friendID just allow string type' })
  @IsNotEmpty({ message: 'friendID is require' })
  @ApiProperty({
    required: false,
    nullable: true,
  })
  userID: string
}
export class RemoveFriendDTO {
  @IsString({ message: 'friendID just allow string type' })
  @IsNotEmpty({ message: 'friendID is require' })
  @ApiProperty({
    required: false,
    nullable: true,
  })
  userID: string
}
