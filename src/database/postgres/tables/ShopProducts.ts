import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('multi_vendor.product_variant_decorator_productmapping')
export class ProductVariantDecoratorProductMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  product_id: string;

  @Column({ length: 255 })
  channel_slug: string;

  @Column({ type: 'bigint' })
  shop_id: number;

  @Column({ nullable: true })
  is_open_bundle: boolean;
}
