// media url mapping util

export const mockSourceUrls = [
  { large: 'url1' },
  { large: 'url2' },
  { large: 'url3' },
  { large: 'url4' },
  { large: 'url5' },
];
export const mockDestinationUrls = [
  { url: 'media/url1' },
  { url: 'media/url2' },
  ,
  { url: 'media/url3' },
  ,
  { url: 'media/url4' },
  ,
];

//  get shoe bundles by sizes

export const mockShoeBundleMappingData = {
  shoeVariants: {
    S5h: [
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDA=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDE=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDI=',
    ],
    S6: [
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDM=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDQ=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDU=',
    ],
    S6h: [
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDY=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDc=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDg=',
    ],
    S7: [
      'UHJvZHVjdFZhcmlhbnQ6NzU0NDk=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTA=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTE=',
    ],
    S7h: [
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTI=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTM=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTQ=',
    ],
    S8: [
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTU=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTY=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTc=',
    ],
    S8h: [
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTg=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NTk=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NjA=',
    ],
    S9: [
      'UHJvZHVjdFZhcmlhbnQ6NzU0NjE=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NjI=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NjM=',
    ],
    S10: [
      'UHJvZHVjdFZhcmlhbnQ6NzU0NjQ=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NjU=',
      'UHJvZHVjdFZhcmlhbnQ6NzU0NjY=',
    ],
  },
  bundleSizes: {
    S6: '1',
    S6h: '1',
    S7: '1',
    S7h: '1',
    S8: '2',
    S8h: '2',
    S9: '2',
    S10: '2',
  },
  length: 3,
};
export const expectedVariantIdsMappedAgainstColors = [
  [
    'UHJvZHVjdFZhcmlhbnQ6NzU0NDM=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NDY=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NDk=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTI=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTU=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTg=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NjE=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NjQ=',
  ],
  [
    'UHJvZHVjdFZhcmlhbnQ6NzU0NDQ=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NDc=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTA=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTM=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTY=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTk=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NjI=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NjU=',
  ],
  [
    'UHJvZHVjdFZhcmlhbnQ6NzU0NDU=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NDg=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTE=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTQ=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NTc=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NjA=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NjM=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NjY=',
  ],
];

// get shoe sizes util

export const mockShoeSizes = {
  S5h: '1',
  S6: '1',
  S6h: '1',
  S7: '1',
  S7h: '1',
  S8: '2',
  S8h: '2',
  S9: '2',
  S10: '2',
};
export const expectedSizes = [
  '5.5',
  '6',
  '6.5',
  '7',
  '7.5',
  '8',
  '8.5',
  '9',
  '10',
];

// getShoeVariantsMapping util

export const mockShoeVariantMapping = {
  shoe_sizes: {
    S5h: '1',
    S6: '1',
    S6h: '1',
    S7: '1',
    S7h: '1',
    S8: '2',
    S8h: '2',
    S9: '2',
    S10: '2',
  },
  variantIds: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0Njc=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0Njg=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0Njk=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzA=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzE=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzI=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzM=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzQ=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzU=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzY=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0Nzc=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0Nzg=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0Nzk=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODA=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODE=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODI=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODM=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODQ=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODU=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODY=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODc=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODg=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODk=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0OTA=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0OTE=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0OTI=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0OTM=',
  ],
  color_list: ['BEIGE', 'BLACK', 'NUDE'],
};
export const expectedShoeVariantsMappedAgainstShoeColumns = {
  S5h: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0Njc=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0Njg=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0Njk=',
  ],
  S6: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzA=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzE=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzI=',
  ],
  S6h: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzM=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzQ=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzU=',
  ],
  S7: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0NzY=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0Nzc=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0Nzg=',
  ],
  S7h: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0Nzk=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODA=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODE=',
  ],
  S8: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODI=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODM=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODQ=',
  ],
  S8h: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODU=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODY=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODc=',
  ],
  S9: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODg=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0ODk=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0OTA=',
  ],
  S10: [
    'UHJvZHVjdFZhcmlhbnQ6NzU0OTE=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0OTI=',
    'UHJvZHVjdFZhcmlhbnQ6NzU0OTM=',
  ],
};
