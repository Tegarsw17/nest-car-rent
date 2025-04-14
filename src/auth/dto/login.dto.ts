import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ type: 'string', example: 'anda@mail.com' })
    email: string;

    @ApiProperty({ example: 'asdw1234' })
    password: string;
}