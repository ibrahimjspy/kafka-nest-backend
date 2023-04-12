/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AppService } from 'src/app.service';
import { prepareFailedResponse } from 'src/app.utils';
import {
  fetchBulkProductsData,
  fetchBulkVendors,
  fetchBulkCustomers,
  fetchBulkSubCategoriesData,
  fetchBulkShippingMethods,
  fetchBulkMasterCategoriesData,
  fetchFirstTenProducts,
} from 'src/database/mssql/bulk-import/methods';
import { connect } from 'mssql';
import { config } from 'mssql-config';
import client from 'pg-config';
import { BulkProductImportDto, createProductDTO } from './import.dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { getProductDetailsFromDb } from 'src/database/mssql/product-view/getProductViewById';

// endpoints to trigger data bulk imports
@Controller()
@ApiTags('bulk-import')
export class BulkImportController {
  private readonly logger: Logger;
  constructor(private readonly appService: AppService) {}
  @Get()
  async app() {
    try {
      const sourceConnection = await connect(config);
      const destinationConnection = await client;
      if (sourceConnection && destinationConnection) {
        return 'kafka client service running';
      }
    } catch (error) {
      return prepareFailedResponse(
        'connection not established with source database',
      );
    }
  }

  @Post('api/v1/bulk/products')
  @ApiOperation({
    summary: 'imports bulk products against a vendor',
  })
  async createProducts(@Body() bulkProductsImportDto: BulkProductImportDto) {
    try {
      const vendorProducts: any = await fetchBulkProductsData(
        bulkProductsImportDto.vendorId,
      );
      const { startCurser, endCurser } = bulkProductsImportDto;
      await this.appService.productBulkCreate(
        vendorProducts.slice(startCurser, endCurser),
      );
      return `${vendorProducts.length} products created`;
    } catch (error) {
      this.logger.error(error);
      return error.message;
    }
  }

  @Post('api/v1/bulk/products/variant/media')
  @ApiOperation({
    summary: 'imports product variant media against all products of vendor',
  })
  async importVariantMedia(
    @Body() bulkProductsImportDto: BulkProductImportDto,
  ) {
    const vendorProducts: any = await fetchBulkProductsData(
      bulkProductsImportDto.vendorId,
    );
    await this.appService.productVariantMediaImport(vendorProducts);
    return `${vendorProducts.length} products variant media created`;
  }

  @Post('api/v1/product')
  async createProductById(
    @Res() res,
    @Body() createProductDTO: createProductDTO,
  ) {
    return await this.appService.createProductById(createProductDTO.productId);
  }

  @Post('api/v1/bulk/shops')
  async createShops() {
    const data: any = await fetchBulkVendors();
    await this.appService.shopBulkCreate(data);
    return `${data.length} shops created`;
  }

  @Post('api/v1/bulk/shipping')
  async createShipping() {
    const data: any = await fetchBulkShippingMethods();
    await this.appService.shippingMethodBulkCreate(data);
    return `${data.length} shops created`;
  }

  @Post('api/v1/bulk/customers')
  async createCustomers() {
    const data: any = await fetchBulkCustomers();
    await this.appService.handleCustomerCDC(data[0]);
    return `${data.length} customers created`;
  }

  @Get('api/v1/source/products')
  async getSourceProducts() {
    const data: any = await fetchFirstTenProducts();
    return data;
  }

  @Get('api/v1/source/product/:productId')
  async getSourceProductDetails(@Param() param: createProductDTO) {
    try {
      return await getProductDetailsFromDb(param.productId);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
