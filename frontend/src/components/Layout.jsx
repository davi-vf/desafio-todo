import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/authContext.js";
import "../styles/Layout.css";

export default function Layout() {
  const { handleLogout } = useContext(AuthContext);

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-left">
          <h1>
            Task<span>Flix</span>
          </h1>
        </div>
        <nav className="layout-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "layout-link active" : "layout-link"
            }
          >
            Início
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? "layout-link active" : "layout-link"
            }
          >
            Minha lista
          </NavLink>
          <button type="button" className="layout-logout" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
