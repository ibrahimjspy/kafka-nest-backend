import { productCDC, productTransformed } from 'src/types/Product';

export const descriptionSmallText =
  '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "test description"}, "type": "paragraph"}], "version": "2.24.3"}';

export const productCdcMock: productCDC = {
  nItemDescription: 'product description',
  nStyleName: 'style name',
  id: 34,
  TBItem_ID: '34',
};

export const productTransformedExpected: productTransformed = {
  id: '34',
  name: 'style name',
  description:
    '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "product description"}, "type": "paragraph"}], "version": "2.24.3"}',
};
