import { createContext } from "react";

export const AuthContext = createContext({
  token: "",
  userEmail: "",
  userName: "",
  handleLoginSuccess: () => {},
  handleLogout: () => {},
});
