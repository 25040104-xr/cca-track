function Navbar({ role, onRoleChange, currentPage, navigate }) {
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

  return (
    <nav className="navbar">
      <span className="logo">HearBack</span>

      <div className="nav-links">
        {links.map((link) => (
          <button
            key={link.page}
            className={currentPage === link.page ? "nav-link active" : "nav-link"}
            onClick={() => navigate(link.page)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <select
        className="role-switch"
        value={role}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        <option value="student">View as Student</option>
        <option value="exco">View as Exco</option>
      </select>
    </nav>
  );
}

export default Navbar;