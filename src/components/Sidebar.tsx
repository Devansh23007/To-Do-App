import { useState } from "react";

type SidebarProps = {
  currentPage: "main" | "modules";
  setCurrentPage: (page: "main" | "modules") => void;
};

function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && <div className="sidebar-title">To-Do</div>}

        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Open sidebar" : "Close sidebar"}
        >
          {isCollapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={
            currentPage === "main"
              ? "sidebar-button active"
              : "sidebar-button"
          }
          onClick={() => setCurrentPage("main")}
        >
          <span className="sidebar-icon">⌂</span>
          {!isCollapsed && <span>Main</span>}
        </button>

        <button
          className={
            currentPage === "modules"
              ? "sidebar-button active"
              : "sidebar-button"
          }
          onClick={() => setCurrentPage("modules")}
        >
          <span className="sidebar-icon">▣</span>
          {!isCollapsed && <span>Modules</span>}
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;