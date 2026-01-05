import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReturnRequestType } from '@/shared/enums';

export class ReturnItemDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ example: '677b3b6c2b6c2b6c2b6c2b6c' })
  productId: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({ example: '677b3b6c2b6c2b6c2b6c2b6c' })
  variantId?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  quantity: number;
}

export class BankInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Techcombank' })
  bankName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456789' })
  bankAccount: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nguyen Van A' })
  bankAccountName: string;
}

export class CreateReturnRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ example: '677b3b6c2b6c2b6c2b6c2b6c' })
  orderId: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @IsEnum(ReturnRequestType)
  @IsNotEmpty()
  @ApiProperty({ enum: ReturnRequestType, example: ReturnRequestType.RETURN })
  type: ReturnRequestType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Product is not as expected' })
  reason: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Product is not as expected' })
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  @ApiProperty({ type: [ReturnItemDto] })
  items: ReturnItemDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BankInfoDto)
  @ApiProperty({ type: BankInfoDto })
  refundInfo?: BankInfoDto;
}
