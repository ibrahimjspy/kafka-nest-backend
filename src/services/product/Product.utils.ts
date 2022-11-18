// convert array into smaller chunks  [ab, bc, cd] =>  [[ab,bc],[cd]]
export const chunkArray = (arr, size) =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];
