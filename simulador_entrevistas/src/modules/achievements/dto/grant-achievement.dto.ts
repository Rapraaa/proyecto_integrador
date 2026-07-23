import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GrantAchievementDto {
  @ApiProperty({ description: 'Usuario que recibe el logro' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Logro que se otorga' })
  @IsUUID()
  achievementId: string;
}
