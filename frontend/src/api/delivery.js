import client from "./client";

const getDetail = (data) => client.post("/delivery/getDetails", data);

export default {
  getDetail,
};
