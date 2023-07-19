import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'bundle.bundle_bundleproductvariant' })
export class BundleProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'boolean' })
  is_deleted: boolean;

  @Column({ type: 'varchar', length: 250 })
  product_variant_id: string;

  @Column({ type: 'varchar', length: 250 })
  product_variant_channel: string;

  @Column({ type: 'integer' })
  quantity: number;

  @PrimaryGeneratedColumn('uuid')
  bundle_id: string;

  @Column({ type: 'varchar', length: 250 })
  product_id: string;
}

@Entity({ name: 'bundle.bundle_openbundleproductvariant' })
export class OpenBundleProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'boolean' })
  is_deleted: boolean;

  @Column({ type: 'varchar', length: 250 })
  product_variant_id: string;

  @Column({ type: 'varchar', length: 250 })
  product_variant_channel: string;

  @Column({ type: 'integer' })
  quantity: number;

  @PrimaryGeneratedColumn('uuid')
  bundle_id: string;

  @Column({ type: 'varchar', length: 250 })
  product_id: string;
}
