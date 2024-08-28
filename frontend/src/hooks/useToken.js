import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString === "undefined") return null;
    const userToken = JSON.parse(tokenString);
    return userToken;
  };
  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken();
  };

  const getName = () => {
    const fullname = localStorage.getItem("name");
    if (fullname === "undefined") return null;
    return fullname;
  };
  const [name, setName] = useState(getName());

  const saveName = (fullname) => {
    localStorage.setItem("name", fullname);
    setName(fullname);
  };

  const removeName = () => {
    localStorage.removeItem("name");
    setName();
  };

  return {
    setToken: saveToken,
    setName: saveName,
    removeToken,
    removeName,
    token,
    name,
  };
}
