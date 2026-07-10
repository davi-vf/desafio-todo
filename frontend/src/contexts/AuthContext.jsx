import { useMemo, useState } from "react";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || "",
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "",
  );

  function handleLoginSuccess(newToken, email, name = "") {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userEmail", email);
    if (name) {
      localStorage.setItem("userName", name);
    }

    setToken(newToken);
    setUserEmail(email);
    if (name) {
      setUserName(name);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setToken("");
    setUserEmail("");
    setUserName("");
  }

  const value = useMemo(
    () => ({
      token,
      userEmail,
      userName,
      handleLoginSuccess,
      handleLogout,
    }),
    [token, userEmail, userName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
