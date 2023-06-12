import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum ProductOperationEnum {
  SYNC = 'sync',
  CREATE = 'create',
  UPDATE = 'update',
}

export class createProductDTO {
  @ApiProperty()
  @IsNotEmpty()
  productId: string;
}

export class BulkProductImportDto {
  @ApiProperty()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty()
  @IsNotEmpty()
  startCurser: number;

  @ApiProperty()
  @IsNotEmpty()
  endCurser: number;

  @ApiProperty({
    enum: ProductOperationEnum,
    required: false,
    default: ProductOperationEnum.SYNC,
  })
  @IsEnum(ProductOperationEnum)
  @IsOptional()
  operation?: ProductOperationEnum;
}

export class UpdateOpenPackDto {
  @ApiProperty()
  @IsNotEmpty()
  curserPage: number;
}

export class vendorDto {
  @ApiProperty()
  @IsNotEmpty()
  vendorId: string;
}
