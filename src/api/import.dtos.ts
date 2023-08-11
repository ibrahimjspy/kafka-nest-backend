import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum ProductOperationEnum {
  SYNC = 'sync',
  CREATE = 'create',
  UPDATE = 'update',
}

export enum BundleImportType {
  API = 'api',
  DATABASE = 'database',
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

  @ApiProperty({
    enum: BundleImportType,
    required: false,
    default: BundleImportType.DATABASE,
  })
  @IsEnum(BundleImportType)
  @IsOptional()
  importType?: BundleImportType;
}

export class UpdateOpenPackDto {
  @ApiProperty()
  @IsNotEmpty()
  curserPage: number;
}

export class vendorDto {
  @ApiProperty()
  @IsOptional()
  vendorId?: string;
}

export class collectionNameDto {
  @ApiProperty({ required: false })
  @IsOptional()
  collectionName: string;
}

export class subCollectionIdDto {
  @ApiProperty({ required: true })
  @IsOptional()
  subCollectionId: string;
}

export class masterCollectionIdDto {
  @ApiProperty({ required: true })
  @IsOptional()
  masterCollectionId: string;
}

export class cursorDto {
  @ApiProperty()
  @IsOptional()
  startCurser?: number;

  @ApiProperty()
  @IsOptional()
  endCurser?: number;
}
