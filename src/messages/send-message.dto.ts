import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'default' })
  sessionId: string;

  @ApiProperty({ example: '+919876543210' })
  phone: string;

  @ApiProperty({ example: 'Hello from WAHA API!' })
  text: string;
}
