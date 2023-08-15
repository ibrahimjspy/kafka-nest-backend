/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from 'src/app.service';
import { prepareFailedResponse } from 'src/app.utils';
import {
  fetchBulkProductsData,
  fetchVendor,
  fetchBulkCustomers,
  fetchBulkSubCategoriesData,
  fetchBulkShippingMethods,
  fetchBulkMasterCategoriesData,
  fetchFirstTenProducts,
} from 'src/database/mssql/bulk-import/methods';
import { connect } from 'mssql';
import { config } from 'mssql-config';
import client from 'pg-config';
import {
  BulkProductImportDto,
  UpdateOpenPackDto,
  collectionNameDto,
  createProductDTO,
  createProductsSyncDto,
  cursorDto,
  masterCollectionIdDto,
  subCollectionIdDto,
  vendorDto,
} from './import.dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { getProductDetailsFromDb } from 'src/database/mssql/product-view/getProductViewById';
import { ProducerService } from 'src/kafka/Kafka.producer.service';
import { KAFKA_CREATE_PRODUCTS_TOPIC } from 'src/kafka/Kafka.constants';
import { getProductDetailsHandler } from 'src/graphql/handlers/product';
import { fetchCollections } from 'src/database/mssql/api_methods/collections';
import { ProductSyncService } from 'src/services/product/sync/Sync.service';

// endpoints to trigger data bulk imports
@Controller()
@ApiTags('bulk-import')
export class BulkImportController {
  private readonly logger: Logger;
  constructor(
    private readonly appService: AppService,
    private readonly kafkaService: ProducerService,
    private readonly productSyncService: ProductSyncService,
  ) {}
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
  async createProducts(@Body() bulkProductsImportInput: BulkProductImportDto) {
    try {
      this.kafkaService.produce({
        topic: KAFKA_CREATE_PRODUCTS_TOPIC,
        messages: [
          {
            value: JSON.stringify(bulkProductsImportInput),
          },
        ],
      });
      return 'Added bulk products to kafka topic';
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
  async createShops(@Body() importVendorsInput: vendorDto) {
    const vendorId = importVendorsInput.vendorId;
    const data: any = await fetchVendor(vendorId);
    await this.appService.shopBulkCreate(data, importVendorsInput.method);
    return `${data.length} shops created`;
  }

  @Post('api/v1/bulk/shipping')
  async createShipping() {
    const data: any = await fetchBulkShippingMethods();
    await this.appService.shippingMethodBulkCreate(data);
    return `${data.length} shops created`;
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

  @Post('api/v1/product/open/pack')
  async updateOpenPack(@Body() updateOpenPackInput: UpdateOpenPackDto) {
    try {
      return await this.appService.saveOpenPack(updateOpenPackInput.curserPage);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('api/v1/products/update')
  async updateProducts(@Body() updateProducts: UpdateOpenPackDto) {
    try {
      return await this.appService.updateProducts(updateProducts.curserPage);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('api/v2/bulk/products')
  @ApiOperation({
    summary: 'imports bulk products against a vendor v2',
  })
  async productsSync(@Body() bulkProductsImportInput: BulkProductImportDto) {
    try {
      this.appService.handleProductSyncCDC(bulkProductsImportInput);
      return 'Added bulk products to kafka topic';
    } catch (error) {
      this.logger.error(error);
      return error.message;
    }
  }

  @Post('api/v1/bulk/products/colors')
  @ApiOperation({
    summary: 'sync product colors of os with b2b',
  })
  async productColorSync(
    @Body() bulkProductsImportInput: BulkProductImportDto,
  ) {
    try {
      this.appService.handleProductColorsSyncCDC(bulkProductsImportInput);
      return 'Added bulk products color sync to kafka topic';
    } catch (error) {
      this.logger.error(error);
      return error.message;
    }
  }

  @Put('api/v1/bulk/products/listing')
  @ApiOperation({
    summary: 'sync product listings',
  })
  async productListingSync(@Body() updateProducts: UpdateOpenPackDto) {
    try {
      this.appService.syncProductListings(updateProducts.curserPage);
      return 'Added bulk products for listing update';
    } catch (error) {
      this.logger.error(error);
      return error.message;
    }
  }

  @Put('api/v1/bulk/products/pricing')
  @ApiOperation({
    summary: 'sync product variants pricing',
  })
  async productVariantPricing(@Body() updateProducts: UpdateOpenPackDto) {
    try {
      this.appService.syncProductVariantPricing(updateProducts.curserPage);
      return 'Added bulk products for product variant update';
    } catch (error) {
      this.logger.error(error);
      return error.message;
    }
  }

  @Delete('api/v1/bulk/products/listing')
  @ApiOperation({
    summary: 'deactivates products against vendor',
  })
  async deActivateVendor(
    @Body() bulkProductsImportInput: BulkProductImportDto,
  ) {
    try {
      this.appService.deactivateVendor(bulkProductsImportInput);
      return 'Added bulk products for channel listing deactivate';
    } catch (error) {
      this.logger.error(error);
      return error.message;
    }
  }

  @Delete('api/v1/bulk/products')
  @ApiOperation({
    summary: 'deletes products against vendor',
  })
  async deleteVendorProducts(
    @Body() bulkProductsImportInput: BulkProductImportDto,
  ) {
    try {
      this.appService.deleteVendorProducts(bulkProductsImportInput);
      return 'Added bulk products for deleting vendor products';
    } catch (error) {
      this.logger.error(error);
      return error.message;
    }
  }

  @Get('api/v1/source/collections')
  @ApiOperation({
    summary: 'returns collections from source database',
  })
  async getCollections(@Query() filter: collectionNameDto) {
    try {
      return await fetchCollections(filter);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('api/v1/source/collection')
  @ApiOperation({
    summary: 'creates a collection in saleor',
  })
  async createCollection(@Query() filter: subCollectionIdDto) {
    try {
      return await this.appService.createCollection(filter.subCollectionId);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('api/v1/source/collection/master')
  @ApiOperation({
    summary: 'creates a collection in saleor',
  })
  async createCollectionMaster(@Query() filter: masterCollectionIdDto) {
    try {
      return await this.appService.createCollectionFromMaster(
        filter.masterCollectionId,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('api/v2/vendors/listing/sync')
  @ApiOperation({
    summary: 'sync vendors listing using db',
  })
  async vendorsListingSync(@Body() body: cursorDto) {
    try {
      return await this.productSyncService.productsListingSync(body);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('api/v1/vendors/pricing/sync')
  @ApiOperation({
    summary: 'sync vendors pricing using db',
  })
  async vendorPricingSync(@Body() body: cursorDto) {
    try {
      return await this.productSyncService.productVariantPricingSync(body);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('api/v1/vendors/products/create/sync')
  @ApiOperation({
    summary: 'sync vendors created products using bulk implementation',
  })
  async vendorCreatedProductsSync(@Body() body: createProductsSyncDto) {
    try {
      return await this.productSyncService.createdProductSync(body);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
