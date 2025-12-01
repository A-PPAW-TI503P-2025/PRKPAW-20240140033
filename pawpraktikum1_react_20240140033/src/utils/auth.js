import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserId = () => {
  const token = getToken();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.id; // Asumsi payload token punya field 'id'
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const getUserData = () => {
  const token = getToken();
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
  return null;
};
