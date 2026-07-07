import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import bookService from "../services/bookService";
import "../styles/resources.css";

function DigitalLibrary() {
  const [resources, setResources] = useState([]);
  const [counts, setCounts] = useState({ ebooks: 0, journals: 0, papers: 0, thesis: 0 });
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDigitalLibrary = async () => {
      try {
        const [resourceData, countsData] = await Promise.all([
          bookService.getDigitalResources(),
          bookService.getDigitalResourcesCounts()
        ]);
        setResources(resourceData);
        setCounts(countsData);
      } catch (err) {
        console.error("Error loading digital library:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDigitalLibrary();
  }, []);

  const handleReadOnline = (resource) => {
    alert(`📖 Opening digital viewer for:\n"${resource.title}" by ${resource.author}`);
    // Open a real academic transformer paper in a new window
    window.open("https://arxiv.org/pdf/1706.03762.pdf", "_blank");
  };

  const handleDownload = (resource) => {
    alert(`📥 Starting download for: "${resource.title}"...`);
    // Create an anchor to download a sample test PDF
    const link = document.createElement("a");
    link.href = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    link.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title?.toLowerCase().includes(search.toLowerCase()) ||
      resource.author?.toLowerCase().includes(search.toLowerCase()) ||
      resource.department?.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All" ||
      resource.department === department;

    return matchesSearch && matchesDepartment;
  });

  return (
    <MainLayout>
      <div className="resources-container">
      

        <h2>📚 Digital Library Catalog</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading Digital Catalog...</p>
          </div>
        ) : (
          <>
            <div className="dashboard-grid">

              <div className="dashboard-card">
                <h4>📘 E-Books</h4>
                <h2>{counts.ebooks}</h2>
              </div>

              <div className="dashboard-card">
                <h4>📄 Journals</h4>
                <h2>{counts.journals}</h2>
              </div>

              <div className="dashboard-card">
                <h4>📝 Research Papers</h4>
                <h2>{counts.papers}</h2>
              </div>

              <div className="dashboard-card">
                <h4>🎓 Thesis</h4>
                <h2>{counts.thesis}</h2>
              </div>

            </div>

            <div className="library-filters">

              <input
                type="text"
                placeholder="Search by Title, Author or Department..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="Civil">Civil</option>
              </select>

            </div>

            <div className="book-grid">

              {filteredResources.map((resource) => (

                <div
                  className="book-card"
                  key={resource.id}
                >

                  <div className="book-cover">
                    {resource.type === "E-Book" ? "📘" : "📄"}
                  </div>

                  <h4>{resource.title}</h4>

                  <p>{resource.author}</p>

                  <p>
                    <strong>{resource.department}</strong>
                  </p>

                  <p>{resource.type}</p>

                  <button 
                    className="reserve-btn"
                    onClick={() => handleReadOnline(resource)}
                  >
                    Read Online
                  </button>

                  <button
                    className="reserve-btn"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleDownload(resource)}
                  >
                    Download
                  </button>

                </div>

              ))}

            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default DigitalLibrary;