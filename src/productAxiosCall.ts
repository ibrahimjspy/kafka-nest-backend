import axios from 'axios';
/**
 * fetches composite product object from orangeShine api
 * @params product ID
 * @params product web name
 * @params brand web name
 */
export const getProductObject = async (
  productId: string,
  productWebName: string,
  brandWebName: string,
) => {
  await axios
    .get(
      `${process.env.OS_API_LINK}/${brandWebName}/${productWebName}/${productId}/`,
    )
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
      return 'product details';
    });

  // fetch(
  //   `${process.env.OS_API_LINK}/${brandWebName}/${productWebName}/${productId}/`,
  // )
  //   .then((response) => response.json())
  //   .then((data) => console.log(data));
};
