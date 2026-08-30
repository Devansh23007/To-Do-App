import { useState } from "react";

type SidebarProps = {
  currentPage: "main" | "other";
  setCurrentPage: (page: "main" | "other") => void;
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
            currentPage === "other"
              ? "sidebar-button active"
              : "sidebar-button"
          }
          onClick={() => setCurrentPage("other")}
        >
          <span className="sidebar-icon">▣</span>
          {!isCollapsed && <span>Other</span>}
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;