import { useState } from "react";

function Navbar({ role, onRoleChange, currentPage, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const studentLinks = [
    { page: "directory", label: "Explore CCAs" },
    { page: "myApplications", label: "My Applications" },
    { page: "notifications", label: "Notifications" },
  ];
  const excoLinks = [
    { page: "applicants", label: "Applicants" },
    { page: "manageCca", label: "Manage CCA" },
  ];
  const links = role === "student" ? studentLinks : excoLinks;

  function handleNavigate(page) {
    navigate(page);
    setMenuOpen(false);
  }

  function handleRoleChange(e) {
    onRoleChange(e.target.value);
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <button className="logo" onClick={() => handleNavigate(links[0].page)}>
        ccaTrack.
      </button>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={menuOpen ? "nav-menu open" : "nav-menu"}>
        <div className="nav-links">
          {links.map((link) => (
            <button
              key={link.page}
              className={currentPage === link.page ? "nav-link active" : "nav-link"}
              onClick={() => handleNavigate(link.page)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <label className="role-switch-wrap">
          View as
          <select className="role-switch" value={role} onChange={handleRoleChange}>
            <option value="student">Student</option>
            <option value="exco">Exco</option>
          </select>
        </label>
      </div>
    </nav>
  );
}

export default Navbar;