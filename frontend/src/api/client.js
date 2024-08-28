import { create } from "apisauce";
import { baseUrl } from "../BaseUrl";

const client = create({
  baseURL: baseUrl,
});

client.addAsyncRequestTransform(async (request) => {
  const tokenString = localStorage.getItem("token");

  if (tokenString === "undefined") return;

  const token = JSON.parse(tokenString);

  if (!token) return;

  request.headers["Authorization"] = `Bearer ${token}`;
});

export default client;
