/**
 * validates string length
 */
export const stringValidation = (string: string) => {
  if (string.length > 5) {
    return true;
  }
  return false;
};
