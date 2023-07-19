import { InjectRepository } from '@nestjs/typeorm';
import { Bundle, OpenBundle } from '../postgres/tables/Bundle';
import {
  BundleProductVariant,
  OpenBundleProductVariant,
} from '../postgres/tables/BundleVariants';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BundleRepository {
  private readonly logger = new Logger(BundleRepository.name);

  constructor(
    @InjectRepository(Bundle)
    private bundleRepository: Repository<Bundle>,
    @InjectRepository(OpenBundle)
    private openBundleRepository: Repository<OpenBundle>,
    @InjectRepository(BundleProductVariant)
    private bundleProductVariantRepository: Repository<BundleProductVariant>,
    @InjectRepository(OpenBundleProductVariant)
    private openBundleProductVariantRepository: Repository<OpenBundleProductVariant>,
  ) {}

  /**
   * Creates bundles with associated product variants.
   * @param bundleVariants - Array of product variant IDs for the bundle.
   * @param bundleQuantities - Array of quantities corresponding to each variant.
   * @param shopId - ID of the shop.
   * @param productId - ID of the product.
   * @param bundlePrice - Price of the bundle.
   * @param isOpenBundle - Flag indicating if it's an open bundle.
   * @param bundleName - Name of the bundle (optional, default: 'product variant bundle').
   */
  async createBundles(
    bundleVariants: string[],
    bundleQuantities: number[],
    shopId: string,
    productId: string,
    bundlePrice: number,
    isOpenBundle: boolean,
    bundleName = 'product variant bundle',
  ): Promise<void> {
    try {
      this.logger.log('Creating Bundle', {
        productId,
        bundleVariants,
        bundleQuantities,
        bundlePrice,
      });
      if (isOpenBundle) {
        await this.createOpenBundle(
          bundleVariants,
          bundleQuantities,
          shopId,
          productId,
          bundlePrice,
          bundleName,
        );
      } else {
        await this.createClosedBundle(
          bundleVariants,
          bundleQuantities,
          shopId,
          productId,
          bundlePrice,
          bundleName,
        );
      }

      this.logger.log(
        isOpenBundle
          ? 'Open bundle created successfully'
          : 'Bundle created successfully',
        'BundleRepository',
      );
    } catch (error) {
      this.logger.error('Error creating bundles', error, 'BundleRepository');
      throw error;
    }
  }

  /**
   * Creates a closed bundle with associated product variants.
   * @param bundleVariants - Array of product variant IDs for the bundle.
   * @param bundleQuantities - Array of quantities corresponding to each variant.
   * @param shopId - ID of the shop.
   * @param productId - ID of the product.
   * @param bundlePrice - Price of the bundle.
   * @param bundleName - Name of the bundle.
   */
  private async createClosedBundle(
    bundleVariants: string[],
    bundleQuantities: number[],
    shopId: string,
    productId: string,
    bundlePrice: number,
    bundleName: string,
  ): Promise<void> {
    const bundle = new Bundle();
    bundle.id = uuidv4();
    bundle.created_at = new Date();
    bundle.updated_at = new Date();
    bundle.is_deleted = false;
    bundle.metadata = null;
    bundle.private_metadata = null;
    bundle.name = bundleName;
    bundle.description = '';
    bundle.slug = '';
    bundle.shop_id = shopId;
    bundle.price = bundlePrice;
    bundle.currency = '';

    const savedBundle = await this.bundleRepository.save(bundle);
    await this.createBundleProductVariants(
      bundleVariants,
      bundleQuantities,
      savedBundle,
      productId,
    );

    this.logger.log('Closed bundle created successfully', 'BundleRepository');
  }

  /**
   * Creates an open bundle with associated product variants.
   * @param bundleVariants - Array of product variant IDs for the bundle.
   * @param bundleQuantities - Array of quantities corresponding to each variant.
   * @param shopId - ID of the shop.
   * @param productId - ID of the product.
   * @param bundlePrice - Price of the bundle.
   * @param bundleName - Name of the bundle.
   */
  private async createOpenBundle(
    bundleVariants: string[],
    bundleQuantities: number[],
    shopId: string,
    productId: string,
    bundlePrice: number,
    bundleName: string,
  ): Promise<void> {
    const openBundle = new OpenBundle();
    openBundle.id = uuidv4();
    openBundle.created_at = new Date();
    openBundle.updated_at = new Date();
    openBundle.is_deleted = false;
    openBundle.metadata = null;
    openBundle.private_metadata = null;
    openBundle.name = bundleName;
    openBundle.description = '';
    openBundle.slug = '';
    openBundle.shop_id = shopId;
    openBundle.price = bundlePrice;
    openBundle.currency = '';

    const createBundle = await this.openBundleRepository.save(openBundle);
    await this.createOpenBundleProductVariants(
      bundleVariants,
      bundleQuantities,
      createBundle,
      productId,
    );

    this.logger.log('Open bundle created successfully', 'BundleRepository');
  }

  /**
   * Creates bundle product variants for a bundle.
   * @param bundleVariants - Array of product variant IDs for the bundle.
   * @param bundleQuantities - Array of quantities corresponding to each variant.
   * @param bundle - Bundle entity to associate the product variants with.
   * @param productId - ID of the product.
   */
  private async createBundleProductVariants(
    bundleVariants: string[],
    bundleQuantities: number[],
    bundle: Bundle | OpenBundle,
    productId: string,
  ): Promise<void> {
    const bundleProductVariants: BundleProductVariant[] = [];

    for (let i = 0; i < bundleVariants.length; i++) {
      const variantId = bundleVariants[i];
      const quantity = bundleQuantities[i];

      const bundleProductVariant = new BundleProductVariant();
      bundleProductVariant.id = uuidv4();
      bundleProductVariant.created_at = new Date();
      bundleProductVariant.updated_at = new Date();
      bundleProductVariant.is_deleted = false;
      bundleProductVariant.product_variant_id = variantId;
      bundleProductVariant.product_variant_channel = '';
      bundleProductVariant.quantity = quantity;
      bundleProductVariant.bundle_id = bundle.id;
      bundleProductVariant.product_id = productId;

      bundleProductVariants.push(bundleProductVariant);
    }

    await this.bundleProductVariantRepository.save(bundleProductVariants);
  }

  /**
   * Creates open bundle product variants for a bundle.
   * @param bundleVariants - Array of product variant IDs for the bundle.
   * @param bundleQuantities - Array of quantities corresponding to each variant.
   * @param bundle - Bundle entity to associate the product variants with.
   * @param productId - ID of the product.
   */
  private async createOpenBundleProductVariants(
    bundleVariants: string[],
    bundleQuantities: number[],
    bundle: Bundle | OpenBundle,
    productId: string,
  ): Promise<void> {
    console.log(bundle);
    const bundleProductVariants: BundleProductVariant[] = [];

    for (let i = 0; i < bundleVariants.length; i++) {
      const variantId = bundleVariants[i];
      const quantity = bundleQuantities[i];

      const bundleProductVariant = new BundleProductVariant();
      bundleProductVariant.id = uuidv4();
      bundleProductVariant.created_at = new Date();
      bundleProductVariant.updated_at = new Date();
      bundleProductVariant.is_deleted = false;
      bundleProductVariant.product_variant_id = variantId;
      bundleProductVariant.product_variant_channel = '';
      bundleProductVariant.quantity = quantity;
      bundleProductVariant.bundle_id = bundle.id;
      bundleProductVariant.product_id = productId;

      bundleProductVariants.push(bundleProductVariant);
    }

    await this.openBundleProductVariantRepository.save(bundleProductVariants);
  }
}
