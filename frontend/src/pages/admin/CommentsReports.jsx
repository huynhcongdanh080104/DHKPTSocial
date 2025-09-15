import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/NavBar";
const CommentReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://dhkptsocial.onrender.com/admin/comments-reports")
      .then((response) => {
        console.log(response.data);
        setReports(response.data.reports);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Cập nhật trạng thái báo cáo
  const updateStatus = (commentID, status) => {
    axios
      .put(`https://dhkptsocial.onrender.com/admin/comments-reports/${commentID}`, { status })
      .then((response) => {
        console.log("Cập nhật thành công:", response.data);
  
       
        setReports(
          reports.map((report) =>
            report.commentID._id === commentID
              ? { ...report, commentID: { ...report.commentID, commentStatus: status } }
              : report
          )
        );
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái:", error);
      });
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center w-full">
          Quản Lý Báo Cáo Bình Luận
        </h1>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">
                  ID Bình Luận
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Người Báo Cáo
                </th>
                <th className="border border-gray-300 px-4 py-2">Lý Do</th>
                <th className="border border-gray-300 px-4 py-2">
                  Nội Dung Bình Luận
                </th>
                <th className="border border-gray-300 px-4 py-2">Trạng Thái</th>
                <th className="border border-gray-300 px-4 py-2">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {reports.length != 0 ? (
                reports.map((report, index) => (
                  <tr key={report._id}>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {report.commentID?._id || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {report.userID?.username || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {report.reportDetail}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {report.commentID.commentDetail}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {report.commentID.commentStatus || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-md mr-2"
                        onClick={() => updateStatus(report.commentID._id, "hidden")}
                      >
                        Ẩn
                      </button>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded-md"
                        onClick={() => updateStatus(report.commentID._id, "active")}
                      >
                        Hiện
                      </button>
                    </td>
                  </tr>
                ))
              ):(
                <div className="hidden"></div>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CommentReportsPage;
