"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface RsvpItem {
  id: number;
  name: string;
  message: string;
  attendance: string;
  companions: string;
  side: string;
  invite: string;
  created_at: string;
}

interface Summary {
  total: number;
  attending: number;
  declined: number;
  noAnswer: number;
}

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [rsvps, setRsvps] = useState<RsvpItem[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, attending: 0, declined: 0, noAnswer: 0 });

  // Filter & Search states
  const [search, setSearch] = useState<string>("");
  const [filterAttendance, setFilterAttendance] = useState<string>("all");
  const [filterSide, setFilterSide] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Initialize token from URL or localStorage
  useEffect(() => {
    const urlToken = searchParams.get("token");
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("wedding_admin_token") : null;
    const activeToken = urlToken || savedToken || "";

    if (activeToken) {
      setToken(activeToken);
      fetchRsvps(activeToken);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchRsvps = async (authToken: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/rsvps?token=${encodeURIComponent(authToken)}`);
      if (res.status === 401) {
        setError("Mã token không chính xác. Vui lòng nhập lại!");
        setToken("");
        if (typeof window !== "undefined") localStorage.removeItem("wedding_admin_token");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        throw new Error(`Lỗi tải dữ liệu: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.ok) {
        setRsvps(data.rsvps || []);
        setSummary(data.summary || { total: 0, attending: 0, declined: 0, noAnswer: 0 });
        if (typeof window !== "undefined") {
          localStorage.setItem("wedding_admin_token", authToken);
        }
      } else {
        setError(data.error || "Không thể tải danh sách");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    setToken(inputToken.trim());
    router.replace(`/admin?token=${encodeURIComponent(inputToken.trim())}`);
    fetchRsvps(inputToken.trim());
  };

  const handleLogout = () => {
    setToken("");
    setInputToken("");
    setRsvps([]);
    if (typeof window !== "undefined") localStorage.removeItem("wedding_admin_token");
    router.replace("/admin");
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa phản hồi của khách "${name}" (ID #${id}) không?`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/rsvps?token=${encodeURIComponent(token)}&id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setRsvps((prev) => prev.filter((item) => item.id !== id));
        fetchRsvps(token);
      } else {
        alert("Xóa không thành công: " + (data.error || "Lỗi không xác định"));
      }
    } catch (err) {
      alert("Lỗi khi xóa: " + (err instanceof Error ? err.message : ""));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRsvps = useMemo(() => {
    return rsvps.filter((item) => {
      const matchSearch =
        search === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.message.toLowerCase().includes(search.toLowerCase()) ||
        item.companions.toLowerCase().includes(search.toLowerCase());

      const matchAttendance =
        filterAttendance === "all" ||
        (filterAttendance === "attending" && item.attendance === "Tôi sẽ tham dự") ||
        (filterAttendance === "declined" && item.attendance === "Xin lỗi, tôi không thể tham dự") ||
        (filterAttendance === "noAnswer" && !item.attendance);

      const matchSide =
        filterSide === "all" ||
        (filterSide === "trai" && item.side?.includes("Trai")) ||
        (filterSide === "gai" && item.side?.includes("Gái"));

      return matchSearch && matchAttendance && matchSide;
    });
  }, [rsvps, search, filterAttendance, filterSide]);

  // Format date helper
  const formatDate = (isoString: string) => {
    if (!isoString) return "---";
    try {
      const d = new Date(isoString);
      return d.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // Login screen
  if (!token) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans text-neutral-800">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
          <div className="text-center mb-6">
            <span className="text-4xl">💌</span>
            <h1 className="text-2xl font-bold mt-2 text-neutral-900">Quản Lý Thiệp Cưới</h1>
            <p className="text-sm text-neutral-500 mt-1">Nhập Admin Token để xem thông tin RSVP & Lời chúc</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                Mã Admin Token
              </label>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Nhập thangdevalone..."
                autoFocus
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:outline-none text-neutral-800 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl transition shadow hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "Đang xác thực..." : "Đăng Nhập Quản Trị"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-400">
            Hệ thống xác nhận tham dự đám cưới
          </div>
        </div>
      </div>
    );
  }

  // Dashboard screen
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800">
      {/* Top Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💒</span>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 leading-tight">Danh Sách RSVP & Lời Chúc</h1>
              <p className="text-xs text-neutral-500">Quản trị viên: <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700 font-mono">{token}</code></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/api/admin/rsvps?token=${encodeURIComponent(token)}&format=csv`}
              download="danh-sach-rsvp.csv"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition shadow-xs"
            >
              <span>📥</span> Xuất Excel (CSV)
            </a>

            <button
              onClick={() => fetchRsvps(token)}
              disabled={loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition cursor-pointer"
            >
              <span>🔄</span> {loading ? "Đang tải..." : "Làm mới"}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium rounded-lg transition cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tổng phản hồi</div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">{summary.total}</div>
            <div className="text-xs text-neutral-400 mt-1">Lượt gửi form</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs border-l-4 border-l-emerald-500">
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <span>✅</span> Sẽ tham dự
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{summary.attending}</div>
            <div className="text-xs text-emerald-600 mt-1">
              {summary.total > 0 ? `${Math.round((summary.attending / summary.total) * 100)}% tổng số` : "0%"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs border-l-4 border-l-rose-500">
            <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider flex items-center gap-1">
              <span>❌</span> Không thể tham dự
            </div>
            <div className="text-2xl font-bold text-rose-700 mt-1">{summary.declined}</div>
            <div className="text-xs text-rose-600 mt-1">
              {summary.total > 0 ? `${Math.round((summary.declined / summary.total) * 100)}% tổng số` : "0%"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs border-l-4 border-l-amber-500">
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <span>💬</span> Có lời chúc
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-1">
              {rsvps.filter((r) => r.message && r.message.trim() !== "").length}
            </div>
            <div className="text-xs text-amber-600 mt-1">Lời chúc mừng gửi tới dâu rể</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên, lời chúc, người đi cùng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterAttendance}
              onChange={(e) => setFilterAttendance(e.target.value)}
              className="px-3 py-2 text-xs font-medium border border-neutral-300 rounded-lg bg-white focus:outline-none text-neutral-700"
            >
              <option value="all">Tất cả xác nhận</option>
              <option value="attending">✅ Sẽ tham dự</option>
              <option value="declined">❌ Không tham dự</option>
              <option value="noAnswer">⏳ Chưa xác nhận</option>
            </select>

            <select
              value={filterSide}
              onChange={(e) => setFilterSide(e.target.value)}
              className="px-3 py-2 text-xs font-medium border border-neutral-300 rounded-lg bg-white focus:outline-none text-neutral-700"
            >
              <option value="all">Tất cả khách</option>
              <option value="trai">Nhà Trai</option>
              <option value="gai">Nhà Gái</option>
            </select>
          </div>
        </div>

        {/* RSVP List Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-neutral-600 tracking-wider">
              Danh sách phản hồi ({filteredRsvps.length} kết quả)
            </span>
          </div>

          {filteredRsvps.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <span className="text-4xl block mb-2">📭</span>
              <p className="text-sm">Chưa có phản hồi nào phù hợp</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-700 font-semibold border-b border-neutral-200 uppercase tracking-wider">
                    <th className="py-3 px-4">Khách mời</th>
                    <th className="py-3 px-4">Xác nhận</th>
                    <th className="py-3 px-4">Đi cùng</th>
                    <th className="py-3 px-4">Khách của</th>
                    <th className="py-3 px-4 min-w-[200px]">Lời chúc</th>
                    <th className="py-3 px-4">Link mời</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredRsvps.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3 px-4 font-semibold text-neutral-900">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-xs uppercase">
                            {item.name.charAt(0)}
                          </span>
                          <span>{item.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {item.attendance === "Tôi sẽ tham dự" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Sẽ tham dự
                          </span>
                        ) : item.attendance === "Xin lỗi, tôi không thể tham dự" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
                            Không thể tham dự
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-600">
                            Chưa xác nhận
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-neutral-600">
                        {item.companions || "—"}
                      </td>

                      <td className="py-3 px-4">
                        {item.side ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            {item.side}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="py-3 px-4 text-neutral-700 italic">
                        {item.message ? `"${item.message}"` : <span className="text-neutral-400 not-italic">—</span>}
                      </td>

                      <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                        {item.invite ? `#${item.invite}` : "—"}
                      </td>

                      <td className="py-3 px-4 text-neutral-500 whitespace-nowrap text-[11px]">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          disabled={deletingId === item.id}
                          title="Xóa phản hồi này"
                          className="text-neutral-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition cursor-pointer disabled:opacity-40"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">Đang tải trang quản trị...</div>}>
      <AdminContent />
    </Suspense>
  );
}
