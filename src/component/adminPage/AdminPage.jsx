import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import "./AdminPage.css";
import Pagination from "../posts/Pagination";
import axios from "axios";

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reports, setReports] = useState([]);
  const [groupName, setGroupName] = useState("");
  const authorization = sessionStorage.getItem("Authorization");
  const [currentPath, setCurrentPath] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  useEffect(() => {
    setCurrentPath(window.location.pathname);
    async function fetchReports() {
      const response = await axios.get(
        `https://ashortwalk.store/api/reports?page=${currentPage}`,
        {
          headers: { Authorization: authorization },
        }
      );

      setReports(response.data);
    }
    async function fetchTotalPages() {
      const response = await axios.get(
        "https://ashortwalk.store/api/reports/count",
        {
          headers: { Authorization: authorization },
        }
      );
      if (response.stauts == 200 || response.status == 201) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setTotalPages(Math.ceil(response.data / 3));
    }

    const checkRedirect = () => {
      if (!isAdmin) {
        window.location.href = "https://ashortwalk.store";
      }
    };
    fetchTotalPages();
    fetchReports();
    checkRedirect();
  }, [isAdmin]);

  async function deleteContent(reportId) {
    const response = await axios.delete(
      `https://ashortwalk.store/api/reports/${reportId}`,
      {
        headers: { Authorization: authorization },
      }
    );
    if (200 <= response.status < 300) {
      alert("신고가 처리되어 콘텐츠가 삭제되었습니다.");
      window.location.reload();
    }
  }
  async function deleteGroup() {
    const response = await axios.delete(
      `https://ashortwalk.store/api/groups/${groupName}`,
      { headers: { Authorization: authorization } }
    );
    if (300 > response.status >= 200) {
      alert("그룹이 삭제되었습니다.");
    }
  }

  return (
    <div>
      <Header />
      <div className="group-outer-box">
        <h1 className="admin-title">Admin</h1>
        <div className="group-inner-box">
          <div className="group-box">
            <div className="group-border-box">
              {/* 그룹삭제 */}
              <div className="admin-box">
                <h2 className="admin-subtitle">그룹 삭제</h2>
                <div className="group-name-box">
                  <label className="admin-label">그룹 이름</label>
                  <input
                    className="group-name"
                    onChange={(e) => {
                      e.preventDefault();
                      setGroupName(e.target.value);
                    }}
                  />
                </div>
                <button
                  className="group-delete-button"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteGroup();
                  }}
                >
                  그룹 삭제
                </button>
              </div>
            </div>
          </div>

          <div className="group-border-box">
            <h2 className="report-subtitle">신고 내역</h2>
            <div id="report-list">
              {reports.map((report) => {
                return (
                  <div
                    className={`report-content-box ${
                      reports.length === 0 ? "empty" : ""
                    }`}
                  >
                    <h3>제목 : {report.reportTitle}</h3>
                    <p>내용 : {report.reportContent}</p>
                    <div className="report-button-box">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/${report.contentType}/${report.contentId}`;
                        }}
                      >
                        조회
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteContent(report.id);
                        }}
                      >
                        처리
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="report-pagination">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              ></Pagination>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
