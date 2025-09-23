"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/config/api";
import { LogOut } from "lucide-react";

type Participant = {
  id: string;
  name: string;
  email: string;
  country: string;
  approved: boolean;
};

const AdminPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState(0);
  const [pageViews, setPageViews] = useState(0);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await apiFetch<{ visits: number; pageViews: number }>("/api/admin/analytics", "GET", undefined, token);
        setVisits(analytics.visits);
        setPageViews(analytics.pageViews);

        const participantList = await apiFetch<Participant[]>("/api/admin/participants", "GET", undefined, token);
        setParticipants(participantList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleApprove = async (id: string) => {
    await apiFetch(`/api/admin/participants/${id}/approve`, "PUT", {}, token);
    setParticipants((prev) => prev.map(p => p.id === id ? { ...p, approved: true } : p));
  };

  const handleReject = async (id: string) => {
    await apiFetch(`/api/admin/participants/${id}/reject`, "PUT", {}, token);
    setParticipants((prev) => prev.filter(p => p.id !== id));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-lg font-medium text-gray-600 animate-pulse">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 lg:p-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Kia HQ Admin Dashboard</h1>
        <button
          onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}
          className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 text-gray-700 transition-colors duration-200"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Analytics Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold  text-gray-800 mb-6">Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8">
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-200">
            <p className="text-gray-500 text-sm font-bold">Total Visits</p>
            <p className="text-4xl font-bold text-indigo-600">{visits}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-200">
            <p className="text-gray-500 text-sm font-bold">Page Views</p>
            <p className="text-4xl font-bold text-indigo-600">{pageViews}</p>
          </div>
        </div>
      </section>

      {/* Participants Management Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Participants Management</h2>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Country</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4 text-gray-800">{p.name}</td>
                    <td className="p-4 text-gray-600">{p.email}</td>
                    <td className="p-4 text-gray-600">{p.country}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {p.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 flex gap-3">
                      {!p.approved && (
                        <>
                          <button
                            onClick={() => handleApprove(p.id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(p.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors duration-200"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {participants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-gray-500">
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
  );
};

export default AdminPage;