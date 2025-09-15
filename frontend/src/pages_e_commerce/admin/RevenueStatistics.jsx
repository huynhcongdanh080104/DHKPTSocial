import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Pagination from "../components/Pagination";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueStatistics = () => {
  // State cho dữ liệu
  const [revenueData, setRevenueData] = useState({ labels: [], data: [] });
  const [orderStats, setOrderStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");

  // State cho tháng và năm
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // State cho phân trang
  const [displayCount, setDisplayCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // State cho so sánh doanh thu
  const [compareMonth1, setCompareMonth1] = useState(new Date().getMonth() + 1);
  const [compareYear1, setCompareYear1] = useState(new Date().getFullYear());
  const [compareMonth2, setCompareMonth2] = useState(new Date().getMonth() + 1);
  const [compareYear2, setCompareYear2] = useState(new Date().getFullYear());
  const [revenueData1, setRevenueData1] = useState({ labels: [], data: [] });
  const [revenueData2, setRevenueData2] = useState({ labels: [], data: [] });

  // State cho chế độ hiển thị
  const [viewMode, setViewMode] = useState("overview"); // "overview" hoặc "compare"

  const { enqueueSnackbar } = useSnackbar();

  // Lấy dữ liệu doanh thu theo tháng và năm
  useEffect(() => {
    axios.get(`https://dhkshop.onrender.com/order/revenue?type=daily&month=${selectedMonth}&year=${selectedYear}`)
      .then((response) => {
        const data = response.data;
        setRevenueData({
          labels: data.map((item) => item._id),
          data: data.map((item) => item.totalRevenue),
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
      });
  }, [selectedMonth, selectedYear]);

  // Lấy thống kê đơn hàng theo tháng và năm
  useEffect(() => {
    axios.get(`https://dhkshop.onrender.com/order/stats?month=${selectedMonth}&year=${selectedYear}`)
      .then((response) => {
        setOrderStats(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thống kê đơn hàng:", error);
      });
  }, [selectedMonth, selectedYear]);

  // Lấy danh sách đơn hàng theo tháng và năm đã chọn
  useEffect(() => {
    axios.get(`https://dhkshop.onrender.com/order?month=${selectedMonth}&year=${selectedYear}`)
      .then((response) => {
        console.log("Dữ liệu đơn hàng từ API:", response.data);
        setOrders(response.data); // Lưu danh sách đơn hàng vào state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        setLoading(false);
      });
  }, [selectedMonth, selectedYear]); // Chỉ gọi lại khi tháng hoặc năm thay đổi

  // Lọc danh sách đơn hàng
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createAt);
    const matchesMonthAndYear =
      orderDate.getMonth() + 1 === selectedMonth && orderDate.getFullYear() === selectedYear;

    const matchesSearch = [order._id, order.customer?.name, order.address].some(
      (field) => String(field).toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    return (
      matchesMonthAndYear &&
      matchesSearch &&
      (statusFilter === "" || order.status === statusFilter) &&
      (paymentMethodFilter === "" || order.paymentMethod === paymentMethodFilter)
    );
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredOrders.length / displayCount);
  const startIndex = (currentPage - 1) * displayCount;
  const currentOrders = displayCount === filteredOrders.length 
    ? filteredOrders 
    : filteredOrders.slice(startIndex, startIndex + displayCount);

  // Dữ liệu cho biểu đồ doanh thu
  const revenueChartData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: revenueData.data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ thống kê trạng thái đơn hàng
  const orderStatsChartData = {
    labels: orderStats.map((stat) => stat._id),
    datasets: [
      {
        label: "Số lượng đơn hàng",
        data: orderStats.map((stat) => stat.count),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Lấy dữ liệu so sánh doanh thu
  useEffect(() => {
    // Lấy dữ liệu cho khoảng thời gian 1
    axios.get(`https://dhkshop.onrender.com/order/revenue?type=daily&month=${compareMonth1}&year=${compareYear1}`)
      .then((response) => {
        const data = response.data;
        setRevenueData1({
          labels: data.map((item) => item._id),
          data: data.map((item) => item.totalRevenue),
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu doanh thu 1:", error);
      });

    // Lấy dữ liệu cho khoảng thời gian 2
    axios.get(`https://dhkshop.onrender.com/order/revenue?type=daily&month=${compareMonth2}&year=${compareYear2}`)
      .then((response) => {
        const data = response.data;
        setRevenueData2({
          labels: data.map((item) => item._id),
          data: data.map((item) => item.totalRevenue),
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu doanh thu 2:", error);
      });
  }, [compareMonth1, compareYear1, compareMonth2, compareYear2]);

  // Dữ liệu cho biểu đồ so sánh doanh thu
  const compareChartData = {
    labels: revenueData1.labels, // Sử dụng labels từ khoảng thời gian 1
    datasets: [
      {
        label: `Doanh thu Tháng ${compareMonth1}/${compareYear1}`,
        data: revenueData1.data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
      {
        label: `Doanh thu Tháng ${compareMonth2}/${compareYear2}`,
        data: revenueData2.data,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  // Tính tổng doanh thu
  const totalRevenue1 = revenueData1.data.reduce((sum, value) => sum + value, 0);
  const totalRevenue2 = revenueData2.data.reduce((sum, value) => sum + value, 0);

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4 bg-white pl-3 border-l-4 border-[#008500] h-9 flex items-center rounded-lg justify-between pr-3">
        Thống kê doanh thu
      </h2>

      {/* Thanh chuyển đổi chức năng */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            viewMode === "overview"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setViewMode("overview")}
        >
          Tổng quan
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            viewMode === "compare"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setViewMode("compare")}
        >
          So sánh
        </button>
      </div>

      <div className="bg-white p-4 shadow rounded-lg">
        {viewMode === "overview" ? (
          // Hiển thị nội dung Tổng quan
          <>
            {/* Dropdown chọn tháng và năm */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <select
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>
                      Năm {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Biểu đồ doanh thu theo ngày */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Doanh thu theo ngày</h3>
              <div className="bg-white p-4 rounded-none shadow-md">
                <Line data={revenueChartData} />
              </div>
            </div>

            {/* Biểu đồ thống kê trạng thái đơn hàng */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Thống kê trạng thái đơn hàng</h3>
              <div className="bg-white p-4 rounded-none shadow-md">
                <Bar data={orderStatsChartData} />
              </div>
            </div>
          </>
        ) : (
          // Hiển thị nội dung So sánh
          <>
            {/* Dropdown chọn khoảng thời gian so sánh */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap">Tháng/Năm 1:</label>
                <div className="flex gap-2">
                  <select
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={compareMonth1}
                    onChange={(e) => setCompareMonth1(Number(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        Tháng {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={compareYear1}
                    onChange={(e) => setCompareYear1(Number(e.target.value))}
                  >
                    {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year}>
                        Năm {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap">Tháng/Năm 2:</label>
                <div className="flex gap-2">
                  <select
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={compareMonth2}
                    onChange={(e) => setCompareMonth2(Number(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        Tháng {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={compareYear2}
                    onChange={(e) => setCompareYear2(Number(e.target.value))}
                  >
                    {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year}>
                        Năm {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Hiển thị tổng doanh thu */}
            <div className="flex gap-4 mb-4">
              <div>
                <strong>Tổng doanh thu Tháng {compareMonth1}/{compareYear1}:</strong> {totalRevenue1.toLocaleString()} VND
              </div>
              <div>
                <strong>Tổng doanh thu Tháng {compareMonth2}/{compareYear2}:</strong> {totalRevenue2.toLocaleString()} VND
              </div>
            </div>

            {/* Biểu đồ so sánh */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">So sánh doanh thu</h3>
              <div className="bg-white p-4 rounded-none shadow-md">
                <Line data={compareChartData} />
              </div>
            </div>
          </>
        )}

        {/* Tìm kiếm và lọc */}
        {viewMode !== "compare" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              {/* Ô tìm kiếm */}
              <div className="flex-1 min-w-[250px]">
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn hàng, tên khách hàng hoặc địa chỉ..."
                  className="w-full p-2 border rounded-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Phần hiển thị số lượng */}
              <div className="flex items-center gap-2">
                <span className="font-semibold whitespace-nowrap">Hiển thị:</span>
                <select
                  className="border p-2 rounded-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={displayCount}
                  onChange={(e) => {
                    setDisplayCount(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[10, 20, 30]
                    .filter((num) => num <= filteredOrders.length) // Chỉ giữ các giá trị nhỏ hơn hoặc bằng filteredOrders.length
                    .map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  <option value={filteredOrders.length}>Tất cả</option>
                </select>
              </div>
            </div>

            {/* Bộ lọc */}
            <div className="flex flex-wrap gap-4 mb-4">
              {/* Lọc theo trạng thái */}
              <div>
                <select
                  className="border p-2 rounded-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="pending">Đang chờ</option>
                  <option value="shipping">Đang giao</option>
                  <option value="shipped">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Lọc theo phương thức thanh toán */}
              <div>
                <select
                  className="border p-2 rounded-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                >
                  <option value="">Tất cả phương thức</option>
                  <option value="COD">COD</option>
                  <option value="VNPay">VNPay</option>
                </select>
              </div>
            </div>

            {/* Bảng danh sách đơn hàng */}
            <div className="overflow-hidden rounded-none border-l-4 border-r-4 border-[#008500]">
              <table className="w-full border-collapse border-t border-b border-gray-300 border-x-0">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border-t border-b border-gray-300 p-2">Mã đơn hàng</th>
                    <th className="border-t border-b border-gray-300 p-2">Khách hàng</th>
                    <th className="border-t border-b border-gray-300 p-2">Tổng giá trị</th>
                    <th className="border-t border-b border-gray-300 p-2">Trạng thái</th>
                    <th className="border-t border-b border-gray-300 p-2">PTTT</th>
                    <th className="border-t border-b border-gray-300 p-2">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">
                        Không tìm thấy đơn hàng nào phù hợp
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order) => (
                      <tr key={order._id} className="border-t border-b border-gray-300">
                        <td className="border-t border-b border-gray-300 p-2 text-center">
                          <span
                            className="inline-block max-w-[140px] truncate cursor-pointer"
                            title={order._id} // Hiển thị tooltip khi hover
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(order._id); // Copy mã đơn hàng vào clipboard
                                enqueueSnackbar("Đã copy mã đơn hàng vào clipboard!", { variant: "success" }); // Hiển thị thông báo thành công
                              } catch (err) {
                                enqueueSnackbar("Đã có lỗi xảy ra!", { variant: "error" }); // Hiển thị thông báo lỗi
                              }
                            }}
                          >
                            {order._id.length > 20 ? order._id.slice(0, 20) + "..." : order._id} {/* Giới hạn độ dài hiển thị */}
                          </span>
                        </td>
                        <td className="border-t border-b border-gray-300 p-2 text-center">{order.customer?.name || "Không có thông tin"}</td>
                        <td className="border-t border-b border-gray-300 p-2 text-center">{order.totalPrice.toLocaleString()} VND</td>
                        <td className="border-t border-b border-gray-300 p-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "shipped"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="border-t border-b border-gray-300 p-2 text-center">{order.paymentMethod}</td>
                        <td className="border-t border-b border-gray-300 p-2 text-center">{new Date(order.createAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && displayCount < filteredOrders.length && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueStatistics;