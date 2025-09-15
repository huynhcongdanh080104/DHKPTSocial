import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/NavBar";
import CardPost from "../../components/CardPost";
import CardPostAdmin from "../../components/CardPostAdmin";

const PostsReports = () => {
  const [reports, setReports] = useState([]);
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchFiles = async (postId) => {
    try {
      const response = await axios.get(`https://dhkptsocial.onrender.com/files/download/${postId}`);
      return response.data; // Trả về danh sách file
    } catch (error) {
      console.error("Lỗi khi lấy file:", error);
      return [];
    }
  };
  // const fetchPost = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://dhkptsocial.onrender.com/articles/all/${postID}`
  //     );
  //     console.log(response.data);
  //     setPost(response.data);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy bài đăng:", error);
  //   }
  // };

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://dhkptsocial.onrender.com/admin/posts-reports")
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
  

  const updateArticleStatus = (articleID, status) => {
    axios
      .put(`https://dhkptsocial.onrender.com/admin/posts-reports/${articleID}`, { status })
      .then((response) => {
        setReports(
          reports.map((report) =>
            report.articleID._id === articleID
              ? { ...report, articleID: { ...report.articleID, articleStatus: status } }
              : report
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Quản Lý Báo Cáo Bài Đăng</h1>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">Nội dung</th>               
                <th className="border border-gray-300 px-4 py-2">ID Bài Đăng</th>
                <th className="border border-gray-300 px-4 py-2">Người Báo Cáo</th>
                <th className="border border-gray-300 px-4 py-2">Lý Do</th>
                
                <th className="border border-gray-300 px-4 py-2">Trạng Thái</th>
                <th className="border border-gray-300 px-4 py-2">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report._id}>
                  
                  
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <CardPostAdmin
                      postID={report.articleID._id} 
                      author={report.articleID.userID} 
                      description={report.articleID.description} 
                      post={report.articleID}
                    />
                  </td>
                  
                  
                  <td className="border border-gray-300 px-4 py-2 text-center">{report.articleID?._id || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{report.userID?.username || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{report.reportDetail}</td>
                  
                  <td className="border border-gray-300 px-4 py-2 text-center">{report.articleID?.articleStatus || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md mr-2"
                      onClick={() => updateArticleStatus(report.articleID._id, "hidden")}
                    >
                      Ẩn
                    </button>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-md"
                      onClick={() => updateArticleStatus(report.articleID._id, "active")}
                    >
                      Hiện
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
export default PostsReports;
