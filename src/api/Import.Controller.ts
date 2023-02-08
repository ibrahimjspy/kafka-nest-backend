/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';
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
import { createProductDTO } from './import.dtos';
import { ApiTags } from '@nestjs/swagger';

// endpoints to trigger data bulk imports
@Controller()
@ApiTags('bulk-import')
export class BulkImportController {
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

  @Get('api/v1/bulk/products')
  async createProducts() {
    const data: any = await fetchBulkProductsData();
    await this.appService.productBulkCreate(data.slice(6000, 6010));
    return `${data.length} products created`;
  }

  @Post('api/v1/product')
  async createProductById(
    @Res() res,
    @Body() createProductDTO: createProductDTO,
  ) {
    return await this.appService.createProductById(createProductDTO.productId);
  }

  @Get('api/v1/bulk/shops')
  async createShops() {
    const data: any = await fetchBulkVendors();
    await this.appService.shopBulkCreate(data);
    return `${data.length} shops created`;
  }

  @Get('api/v1/bulk/shipping')
  async createShipping() {
    const data: any = await fetchBulkShippingMethods();
    await this.appService.shippingMethodBulkCreate(data);
    return `${data.length} shops created`;
  }

  @Get('api/v1/bulk/customers')
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
}
