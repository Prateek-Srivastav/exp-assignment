import client from "./client";

const add = (data) => client.put("/address/add", data);

const get = () => client.get("/address/");

export default {
  add,
  get,
};
