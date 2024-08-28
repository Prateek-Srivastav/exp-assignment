import client from "./client";

const getOrder = (id) => client.get(`/order/${id}`);

const newOrder = (data) => client.post("/order/new", data);

const updateOrder = (data) => client.put("/order/update", data);

export default {
  getOrder,
  newOrder,
  updateOrder,
};
