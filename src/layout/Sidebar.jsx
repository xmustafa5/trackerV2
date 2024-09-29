import { NavLink, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div  className="layout">
      <div className="sidebar-continuer">
        <div className="logo-title-sidebar">
          + tracker
        </div>
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          TRACKER
        </NavLink>
        <NavLink 
          to="/contributions" // Make sure this path matches your routes
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Contributions
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Sidebar;
