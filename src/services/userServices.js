import apiClient from "../utils/api-client";
import { jwtDecode } from "jwt-decode";

const tokenName = "token";
export async function signup(user, profile) {
  const body = new FormData();
  body.append("name", user.name);
  body.append("email", user.email);
  body.append("password", user.password);
  body.append("deliveryAddress", user.address);
  body.append("profilePic", profile);

  const { data } = await apiClient.post("/user/signup", body);
  localStorage.setItem(tokenName, data.token);
  return data;
}

export async function login(loginData) {
  const { data } = await apiClient.post("/user/login", loginData);
  localStorage.setItem(tokenName, data.token);
  return data;
}

export function logout() {
  localStorage.removeItem(tokenName);
}

export function getUser() {
  try {
    const jwt = localStorage.getItem("token");
    const jwtUser = jwtDecode(jwt);
    return jwtUser;
  } catch (error) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenName);
}
