import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReturnRequestStatus } from '@/shared/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReturnRequestStatusDto {
  @IsEnum(ReturnRequestStatus)
  @ApiProperty({ enum: ReturnRequestStatus, example: ReturnRequestStatus.APPROVED })
  status: ReturnRequestStatus;

  @IsString()
  @IsOptional()
  adminNote?: string;
}
