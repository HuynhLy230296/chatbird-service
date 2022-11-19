import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class AddMemberDTO {
  @IsString({ message: 'friendID just allow string type' })
  @IsNotEmpty({ message: 'friendID is require' })
  @ApiProperty({
    required: true,
    nullable: false,
  })
  userID: string
}
export class RemoveMemberDTO {
  @IsString({ message: 'friendID just allow string type' })
  @IsNotEmpty({ message: 'friendID is require' })
  @ApiProperty({
    required: true,
    nullable: false,
  })
  userID: string
}
export class CreateRoomDTO {
  @IsNotEmpty({ message: 'title just allow string type' })
  @IsString({ message: 'title just allow string type' })
  @ApiProperty({
    required: false,
    nullable: true,
  })
  title: string

  @IsArray({ message: 'users just allow array type' })
  @MinLength(2, { each: true, message: 'room must more than 1 member' })
  @ApiProperty({
    required: false,
    nullable: true,
  })
  users: string[]
}

export class UpdateRoomDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString({ message: 'title just allow string type' })
  @ApiProperty({
    required: false,
    nullable: true,
  })
  title: string
}
