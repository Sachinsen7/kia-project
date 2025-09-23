

"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/config/api";
import { LogOut, CheckCircle, XCircle, Clock, Video } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  isActive: boolean | null;
};

const AdminPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [visits, setVisits] = useState(0);
  const [pageViews, setPageViews] = useState(0);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admintoken") || ""
      : "";

  // Fetch analytics and participants
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch analytics (uncomment when API is ready)
        // const analytics = await apiFetch<{ visits: number; pageViews: number }>("/api/admin/analytics", "GET", undefined, token);
        // setVisits(analytics.visits);
        // setPageViews(analytics.pageViews);

        // Fetch participants
        const response = await apiFetch<{ success: boolean; users: any[] }>(
          "/api/admin/all",
          "GET",
          undefined,
          token
        );
        const participantList = response.users.map((u) => ({
          id: u._id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          country: u.country,
          isActive: u.isActive ?? null,
        }));
        setParticipants(participantList);
        setTotalUsers(participantList.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleApprove = async (id: string) => {
    try {
      const response = await apiFetch(
        `/api/admin/approve/${id}`,
        "PATCH",
        {},
        token
      );
      if ((response as any).success) {
        setParticipants((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: true } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const response = await apiFetch(
        `/api/admin/decline/${id}`,
        "PATCH",
        {},
        token
      );
      if ((response as any).success) {
        setParticipants((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );

  return (
        <ProtectedRoute role="admin">
    <div className="min-h-screen bg-gray-200 text-gray-900 p-4 sm:p-6 md:p-10 lg:p-14">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-0">
          Kia HQ Admin Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <button
            onClick={() => (window.location.href = "/admin/videos")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base font-bold transition-colors duration-200 w-full sm:w-auto"
          >
            <Video size={18} /> Manage Contents
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("admintoken");
              localStorage.removeItem("role");
              window.location.href = "/";
            }}
            className="flex items-center text-sm sm:text-base font-bold gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 text-gray-700 transition-colors duration-200 w-full sm:w-auto"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </header>

      {/* Analytics */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          Analytics Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-gray-100 shadow-lg rounded-xl p-4 sm:p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-200">
            <p className="text-gray-500 text-sm sm:text-md font-bold">Total Users</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-600">{totalUsers}</p>
          </div>
          <div className="bg-gray-100 shadow-lg rounded-xl p-4 sm:p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-200">
            <p className="text-gray-500 text-sm sm:text-md font-bold">Total Visits</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-600">{visits}</p>
          </div>
          <div className="bg-gray-100 shadow-lg rounded-xl p-4 sm:p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-200">
            <p className="text-gray-500 text-sm sm:text-md font-bold">Page Views</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-600">{pageViews}</p>
          </div>
        </div>
      </section>

      {/* Participants Management */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Participants Management
        </h2>
        <div className="bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto border border-gray-400 p-2 rounded">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                    Country
                  </th>
                  <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left p-2 sm:p-4 text-xs sm:text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-gray-100 transition-colors duration-150"
                  >
                    <td className="p-2 sm:p-4 text-gray-800">
                      <div className="block sm:hidden">
                        <div className="font-medium">{`${p.firstName} ${p.lastName}`}</div>
                        <div className="text-xs text-gray-600">{p.email}</div>
                        <div className="text-xs text-gray-600">{p.country}</div>
                      </div>
                      <div className="hidden sm:block">{`${p.firstName} ${p.lastName}`}</div>
                    </td>
                    <td className="p-2 sm:p-4 text-gray-600 hidden sm:table-cell">{p.email}</td>
                    <td className="p-2 sm:p-4 text-gray-600 hidden md:table-cell">{p.country}</td>
                    <td className="p-2 sm:p-4 flex items-center gap-2">
                      {p.isActive === true && (
                        <CheckCircle className="text-green-600" size={16} />
                      )}
                      {p.isActive === false && (
                        <XCircle className="text-red-600" size={16} />
                      )}
                      {p.isActive === null && (
                        <Clock className="text-yellow-600" size={16} />
                      )}
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          p.isActive === true
                            ? "text-green-800"
                            : p.isActive === false
                            ? "text-red-800"
                            : "text-yellow-800"
                        }`}
                      >
                        {p.isActive === true
                          ? "Approved"
                          : p.isActive === false
                          ? "Declined"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="p-2 sm:p-4">
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        {p.isActive !== true && (
                          <button
                            onClick={() => handleApprove(p.id)}
                            className="flex items-center gap-2 px-3 py-1 sm:py-2 bg-green-500 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm font-medium shadow-sm transition-colors duration-200 w-full sm:w-auto"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}
                        {p.isActive !== false && (
                          <button
                            onClick={() => handleDecline(p.id)}
                            className="flex items-center gap-2 px-3 py-1 sm:py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-xs sm:text-sm font-medium shadow-sm transition-colors duration-200 w-full sm:w-auto"
                          >
                            <XCircle size={14} /> Decline
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {participants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 sm:p-6 text-gray-500">
                      No participants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
    </ProtectedRoute>
  );
};

export default AdminPage;