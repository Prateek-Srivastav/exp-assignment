import client from "./client";

const add = (data) => client.put("/cart/add", data);

const getCart = () => client.get("/cart/get");

export default {
  add,
  getCart,
};
