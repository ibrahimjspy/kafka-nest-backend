import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'product_product', schema: 'saleor' })
export class ProductProduct {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 250 })
  name: string;

  @Column('jsonb', { name: 'description', nullable: true })
  description: Record<string, any>;

  @Column('timestamptz', { name: 'updated_at' })
  updated_at: Date;

  @Column('int', { name: 'product_type_id' })
  product_type_id: number;

  @Column('int', { name: 'category_id', nullable: true })
  category_id: number | null;

  @Column('varchar', { name: 'seo_description', length: 300, nullable: true })
  seo_description: string | null;

  @Column('varchar', { name: 'seo_title', length: 70, nullable: true })
  seo_title: string | null;

  @Column('float', { name: 'weight', nullable: true })
  weight: number | null;

  @Column('jsonb', { name: 'metadata', nullable: true })
  metadata: Record<string, any> | null;

  @Column('jsonb', { name: 'private_metadata', nullable: true })
  private_metadata: Record<string, any> | null;

  @Column('varchar', { name: 'slug', length: 255 })
  slug: string;

  @Column('int', { name: 'default_variant_id', nullable: true })
  default_variant_id: number | null;

  @Column('text', { name: 'description_plaintext' })
  description_plaintext: string;

  @Column('float', { name: 'rating', nullable: true })
  rating: number | null;

  @Column('text', { name: 'search_document' })
  search_document: string;

  @Column('timestamptz', { name: 'created_at' })
  created_at: Date;

  @Column('tsvector', { name: 'search_vector', nullable: true })
  search_vector: string | null;

  @Column('boolean', { name: 'search_index_dirty' })
  search_index_dirty: boolean;

  @Column('int', { name: 'tax_class_id', nullable: true })
  tax_class_id: number | null;

  @Column('varchar', {
    name: 'external_reference',
    length: 250,
    nullable: true,
  })
  external_reference: string | null;
}
