import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class createProductDTO {
  @ApiProperty()
  @IsNotEmpty()
  productId: string;
}

export class BulkProductImportDto {
  @ApiProperty()
  @IsNotEmpty()
  vendorId: string;
}
