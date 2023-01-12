export interface thumbnailDto {
  mediaUrl?: string;
  size?: string;
  productId?: string;
}

export type thumbnailQuery = (object: thumbnailDto) => string;
