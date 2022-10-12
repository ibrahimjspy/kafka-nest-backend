export const brandGeneralTransformer = async (object) => {
  brandNameValidator(object);
  return object;
};
// validator to check if product name exists in object
const brandNameValidator = async (object) => {
  if (object.name) {
    return;
  }
  if (object.web_name) {
    object.name = object.web_name;
  }
  if (object.contact.name) {
    object.name = object.contact.name;
  } else {
    object.name = 'test_shop';
  }
};
