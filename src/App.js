import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import CCADirectoryPage from "./pages/CCADirectoryPage";
import CCADetailPage from "./pages/CCADetailPage";
import ApplyFormPage from "./pages/ApplyFormPage";

function App() {
  const [role, setRole] = useState("student");
  const [page, setPage] = useState("directory");
  const [params, setParams] = useState({});

  function navigate(newPage, newParams = {}) {
    setPage(newPage);
    setParams(newParams);
  }

  function handleRoleChange(newRole) {
    setRole(newRole);
    navigate(newRole === "student" ? "directory" : "applicants");
  }

  function renderPage() {
    switch (page) {
      case "directory":
        return <CCADirectoryPage navigate={navigate} />;
      case "ccaDetail":
        return <CCADetailPage ccaId={params.ccaId} navigate={navigate} />;
      case "apply":
        return <ApplyFormPage ccaId={params.ccaId} navigate={navigate} />;
      default:
        return <p className="page">🚧 This page is coming soon.</p>;
    }
  }

  return (
    <div className="App">
      <Navbar
        role={role}
        onRoleChange={handleRoleChange}
        currentPage={page}
        navigate={navigate}
      />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;