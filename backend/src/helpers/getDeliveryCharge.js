const axios = require("axios");

module.exports = getDeliveryCharge = async ({
  delivery_postcode,
  itemsWeight,
}) => {
  const response = await axios
    .post("https://apiv2.shiprocket.in/v1/external/auth/login", {
      email: process.env.DELIVERY_EMAIL,
      password: process.env.DELIVERY_PASSWORD,
    })
    .catch((e) => console.log(e));

  let weight = itemsWeight;

  weight = weight / 1000;

  const codDetail = await axios
    .get(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability?pickup_postcode=${
        process.env.DELIVERY_PICKUP_POSTCODE
      }&delivery_postcode=${delivery_postcode}&weight=${weight}&cod=${1}`,
      {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      }
    )
    .catch((e) => console.log(e));

  const codCourierDetail =
    codDetail.data.data.available_courier_companies.filter(
      (e) =>
        e.courier_company_id ===
        codDetail.data.data.recommended_courier_company_id
    );

  const prepaidDetail = await axios.get(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability?pickup_postcode=${
      process.env.DELIVERY_PICKUP_POSTCODE
    }&delivery_postcode=${delivery_postcode}&weight=${weight}&cod=${0}`,
    {
      headers: {
        Authorization: `Bearer ${response.data.token}`,
      },
    }
  );

  const prepaidCourierDetail =
    prepaidDetail.data.data.available_courier_companies.filter(
      (e) =>
        e.courier_company_id ===
        prepaidDetail.data.data.recommended_courier_company_id
    );

  const netExtraAmt =
    codCourierDetail[0].freight_charge +
    codCourierDetail[0].cod_charges -
    prepaidCourierDetail[0].freight_charge;

  return Math.ceil(netExtraAmt);
};
