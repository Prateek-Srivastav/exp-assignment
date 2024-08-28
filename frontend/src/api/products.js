import client from "./client";

export default class ProductHandler {
  static async getAllProducts() {
    try {
      const response = await client.get("/products");
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getProduct(id) {
    try {
      const response = await client.get(`/products/${id}`);
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
