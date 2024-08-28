import client from "./client";

const verifyOtp = (data) => client.post("/auth/verifyOTP", data);

const signup = (data) => client.post("/auth/register", data);

const login = (data) => client.post("/auth/login", data);

const googleLogin = () => client.get("/auth/google/url");

const feedback = (data) => client.post("/feedback", data);

const getUser = (token) => client.get(`/auth/user?token=${token}`);

const updateUser = (data) => client.put(`/auth/update`, data);

export default {
  verifyOtp,
  signup,
  login,
  googleLogin,
  feedback,
  getUser,
  updateUser,
};
