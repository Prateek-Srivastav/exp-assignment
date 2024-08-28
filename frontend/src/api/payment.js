import client from "./client";

export default class PaymentHandler {
  static async createPayment(data) {
    try {
      const response = await client.post("/payment/create-checkout-session", data);
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
