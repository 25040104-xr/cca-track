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
        return (
          <div className="page">
            <div className="coming-soon">
              <p className="no-results-icon">🚧</p>
              <h3>This page is coming soon</h3>
              <p>Our team is still building this part. Check back later!</p>
            </div>
          </div>
        );
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