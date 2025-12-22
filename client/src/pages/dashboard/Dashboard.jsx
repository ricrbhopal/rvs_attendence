import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/api.jsx";
import { toast } from "react-hot-toast";
import logo from "../../assets/image.png";
import AddTeacherModal from "../../components/AddTeacherModal";

const Dashboard = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch teachers from backend
  useEffect(() => {
    // Check if user is logged in
    const user = sessionStorage.getItem("user");
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    fetchTeachers();
  }, [navigate]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/principal/allTeachers");
      setTeachers(res.data.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please login again");
        sessionStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to fetch teachers"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (teacherData) => {
    try {
      const res = await axios.post("/principal/addTeacher", teacherData);
      toast.success(res.data.message);
      fetchTeachers(); // Refresh the list
      setIsModalOpen(false);
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please login again");
        sessionStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to add teacher"
        );
      }
    }
  };

  const handleStatusChange = async (teacherId, newStatus) => {
    try {
      const res = await axios.patch(`/principal/updateStatus/${teacherId}`, {
        status: newStatus,
      });
      toast.success(res.data.message);
      // Update local state
      setTeachers(
        teachers.map((teacher) =>
          teacher._id === teacherId ? { ...teacher, status: newStatus } : teacher
        )
      );
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please login again");
        sessionStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to update status"
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      sessionStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      navigate("/login");
    }
  };

  // Filter teachers based on search and status
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.rfid?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || teacher.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status) => {
    const colors = getStatusColor(status);
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${colors}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: teachers.length,
    active: teachers.filter((t) => t.status === "active").length,
    inactive: teachers.filter((t) => t.status === "inactive").length,
    suspended: teachers.filter((t) => t.status === "suspended").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-[#7B2D26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Raj Vedanta School"
                className="h-14 w-auto"
              />
              <div>
                <div className="text-xl font-bold text-[#7B2D26]">
                  Teacher Management Dashboard
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#7B2D26] hover:bg-[#5A1F1A] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-[#7B2D26] flex justify-between items-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Total Teachers
            </div>
            <div className="text-3xl font-bold text-[#7B2D26]">
              {stats.total}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500 flex justify-between items-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Active
            </div>
            <div className="text-3xl font-bold text-green-600">
              {stats.active}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-500 flex justify-between items-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Inactive
            </div>
            <div className="text-3xl font-bold text-gray-600">
              {stats.inactive}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500 flex justify-between items-center">
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Suspended
            </div>
            <div className="text-3xl font-bold text-red-600">
              {stats.suspended}
            </div>
          </div>
        </div>

        {/* Teacher List Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-[#7B2D26]">
              Teacher Management
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Add New Teacher Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Teacher
              </button>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent outline-none w-full sm:w-64"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Teachers Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#7B2D26] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Teacher Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    RFID Card
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status Control
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Loading teachers...
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No teachers found
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              teacher.status === "active"
                                ? "bg-green-500"
                                : teacher.status === "inactive"
                                ? "bg-gray-400"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <div className="font-semibold text-gray-900">
                            {teacher.fullname}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                          {teacher.rfid}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {teacher.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {teacher.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={teacher.status}
                          onChange={(e) =>
                            handleStatusChange(teacher._id, e.target.value)
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 outline-none transition cursor-pointer ${
                            teacher.status === "active"
                              ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                              : teacher.status === "inactive"
                              ? "border-gray-500 bg-gray-50 text-gray-700 hover:bg-gray-100"
                              : "border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/attendance/${teacher._id}`)
                            }
                            className="bg-[#7B2D26] hover:bg-[#5A1F1A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            View
                          </button>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTeacher}
      />
    </div>
  );
};

export default Dashboard;
