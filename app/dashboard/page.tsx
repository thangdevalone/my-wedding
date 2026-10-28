"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { GuestItem, GuestOwner } from "../lib/db";

const CATEGORIES = [
  "Gia đình / Họ hàng",
  "Bạn đại học",
  "Bạn cấp 3",
  "Bạn cấp 2",
  "Bạn cấp 1",
  "Đồng nghiệp",
  "Bạn xã giao",
  "Khách của Bố Mẹ",
  "Khác",
];

const RELATIONSHIPS = [
  "Thân thiết",
  "Rất thân (Ruột thịt)",
  "Bình thường",
  "Xã giao",
  "Mới quen",
];

const PRIORITIES = [
  "Ưu tiên 1 (Chắc chắn mời)",
  "Ưu tiên 2 (Nên mời)",
  "Ưu tiên 3 (Cân nhắc)",
  "Mời báo hỷ",
];

const RETURN_GIFT_STATUSES = [
  "Chưa đi lại",
  "Đã đi lại (Trả nợ xong)",
  "Mừng trước (Họ trả nợ mình)",
  "Không cần đi lại",
];

function parseMoneyToVND(raw: string): number {
  if (!raw) return 0;
  const s = raw.toLowerCase().trim();
  if (!s) return 0;

  // Handle patterns like "1tr5", "1.5tr", "2 triệu", "500k", "500.000", "500,000", "500"
  const trMatch = s.match(/^(\d+)(?:[.,](\d+))?\s*(?:tr|trieu|triệu|củ|cu)(\d*)$/);
  if (trMatch) {
    const main = parseInt(trMatch[1], 10);
    const dec = trMatch[2] || trMatch[3] || "";
    const decVal = dec ? parseInt(dec, 10) / Math.pow(10, dec.length) : 0;
    return Math.round((main + decVal) * 1_000_000);
  }

  const kMatch = s.match(/^(\d+)(?:[.,](\d+))?\s*(?:k|nghin|nghìn|ngàn|n)$/);
  if (kMatch) {
    const main = parseInt(kMatch[1], 10);
    const dec = kMatch[2] || "";
    const decVal = dec ? parseInt(dec, 10) / Math.pow(10, dec.length) : 0;
    return Math.round((main + decVal) * 1_000);
  }

  // Pure digits with dots or commas
  const digitsOnly = s.replace(/[^\d]/g, "");
  if (!digitsOnly) return 0;
  const num = parseInt(digitsOnly, 10);
  if (isNaN(num)) return 0;

  // If user typed 500 or 200 or 1000 without 000, treat < 50000 as thousands (e.g. 500 -> 500,000đ)
  if (num > 0 && num < 50_000) {
    return num * 1_000;
  }
  return num;
}

function formatVND(amount: number): string {
  if (!amount || amount <= 0) return "0 đ";
  return amount.toLocaleString("vi-VN") + " đ";
}

function getCategoryBadgeColor(cat: string): string {
  if (cat.includes("Gia đình")) return "bg-amber-100 text-amber-900 border-amber-300";
  if (cat.includes("đại học")) return "bg-blue-100 text-blue-900 border-blue-300";
  if (cat.includes("cấp 3")) return "bg-purple-100 text-purple-900 border-purple-300";
  if (cat.includes("cấp 2") || cat.includes("cấp 1")) return "bg-indigo-100 text-indigo-900 border-indigo-300";
  if (cat.includes("Đồng nghiệp")) return "bg-teal-100 text-teal-900 border-teal-300";
  if (cat.includes("xã giao")) return "bg-stone-100 text-stone-700 border-stone-300";
  return "bg-rose-50 text-rose-900 border-rose-200";
}

function getPriorityBadgeColor(prio: string): string {
  if (prio.includes("Ưu tiên 1")) return "bg-red-100 text-red-900 border-red-300 font-semibold";
  if (prio.includes("Ưu tiên 2")) return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-stone-100 text-stone-600 border-stone-200";
}

function getRelationshipBadgeColor(rel: string): string {
  if (rel.includes("Thân") || rel.includes("Ruột thịt")) return "bg-rose-100 text-rose-900 border-rose-300 font-medium";
  if (rel.includes("Xã giao")) return "bg-stone-100 text-stone-700 border-stone-300";
  return "bg-orange-50 text-orange-900 border-orange-200";
}

export default function DashboardPage() {
  // Auth state
  const [authUser, setAuthUser] = useState<GuestOwner | null>(null);
  const [authPass, setAuthPass] = useState<string>("");
  const [loginUser, setLoginUser] = useState<string>("");
  const [loginPass, setLoginPass] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [initializing, setInitializing] = useState<boolean>(true);

  // Data state
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Add / Quick form state
  const [nameInput, setNameInput] = useState<string>("");
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<string>("Bạn đại học");
  const [relationshipInput, setRelationshipInput] = useState<string>("Thân thiết");
  const [priorityInput, setPriorityInput] = useState<string>("Ưu tiên 1 (Chắc chắn mời)");
  const [giftAmountInput, setGiftAmountInput] = useState<string>("");
  const [returnGiftInput, setReturnGiftInput] = useState<string>("Chưa đi lại");
  const [notesInput, setNotesInput] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formSuccessMsg, setFormSuccessMsg] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Edit modal state
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);
  const [savingEdit, setSavingEdit] = useState<boolean>(false);

  // Inline quick gift update loading state
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRelationship, setFilterRelationship] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterGiftState, setFilterGiftState] = useState<string>("all");

  // Load Guests from API
  const fetchGuests = useCallback(async (user: string, pass: string): Promise<boolean> => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch(
        `/api/guests?user=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setAuthError(data.error || "Đăng nhập không thành công!");
        return false;
      }
      setGuests(data.guests || []);
      setAuthUser(data.owner);
      setAuthPass(pass);
      if (typeof window !== "undefined") {
        localStorage.setItem("wedding_dashboard_user", data.owner);
        localStorage.setItem("wedding_dashboard_pass", pass);
      }
      return true;
    } catch {
      setAuthError("Lỗi kết nối máy chủ. Vui lòng thử lại!");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-restore session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("wedding_dashboard_user");
      const savedPass = localStorage.getItem("wedding_dashboard_pass");
      if (savedUser && savedPass) {
        setLoginUser(savedUser);
        setLoginPass(savedPass);
        fetchGuests(savedUser, savedPass).finally(() => setInitializing(false));
        return;
      }
    }
    setInitializing(false);
  }, [fetchGuests]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser.trim() || !loginPass.trim()) {
      setAuthError("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
      return;
    }
    await fetchGuests(loginUser.trim(), loginPass.trim());
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthPass("");
    setGuests([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("wedding_dashboard_user");
      localStorage.removeItem("wedding_dashboard_pass");
    }
  };

  // Add Guest (Only name is required)
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !authPass) return;
    if (!nameInput.trim()) {
      nameInputRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setFormSuccessMsg("");
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-user": authUser,
          "x-guest-pass": authPass,
        },
        body: JSON.stringify({
          name: nameInput.trim(),
          phone: phoneInput.trim(),
          category: categoryInput,
          relationship: relationshipInput,
          priority: priorityInput,
          giftAmount: giftAmountInput.trim(),
          returnGift: returnGiftInput,
          notes: notesInput.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.guest) {
        setGuests((prev) => [data.guest, ...prev]);
        // Reset only personal fields, keep category/relationship/priority so user can batch-input friends in same group rapidly!
        setNameInput("");
        setPhoneInput("");
        setGiftAmountInput("");
        setNotesInput("");
        setFormSuccessMsg(`Đã thêm "${data.guest.name}"!`);
        setTimeout(() => setFormSuccessMsg(""), 2500);
        nameInputRef.current?.focus();
      } else {
        alert(data.error || "Không thể thêm khách mời");
      }
    } catch {
      alert("Lỗi kết nối khi thêm khách mời!");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Inline Update for Gift Amount or Return Gift Status directly from Table
  const handleQuickUpdate = async (guest: GuestItem, changes: Partial<GuestItem>) => {
    if (!authUser || !authPass) return;
    const updatedOptimistic = { ...guest, ...changes };
    setGuests((prev) => prev.map((g) => (g.id === guest.id ? updatedOptimistic : g)));
    setUpdatingId(guest.id);

    try {
      const res = await fetch("/api/guests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-guest-user": authUser,
          "x-guest-pass": authPass,
        },
        body: JSON.stringify({
          id: guest.id,
          ...changes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.guest) {
        setGuests((prev) => prev.map((g) => (g.id === guest.id ? data.guest : g)));
      }
    } catch {
      // revert if needed
    } finally {
      setUpdatingId(null);
    }
  };

  // Full Edit Modal Save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest || !authUser || !authPass) return;
    if (!editingGuest.name.trim()) {
      alert("Tên khách mời không được để trống!");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch("/api/guests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-guest-user": authUser,
          "x-guest-pass": authPass,
        },
        body: JSON.stringify(editingGuest),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.guest) {
        setGuests((prev) => prev.map((g) => (g.id === data.guest.id ? data.guest : g)));
        setEditingGuest(null);
      } else {
        alert(data.error || "Cập nhật thất bại!");
      }
    } catch {
      alert("Lỗi khi lưu chỉnh sửa!");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Guest
  const handleDeleteGuest = async (guest: GuestItem) => {
    if (!authUser || !authPass) return;
    if (!window.confirm(`Bạn có chắc muốn xóa khách mời "${guest.name}" khỏi danh sách?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/guests?id=${guest.id}`, {
        method: "DELETE",
        headers: {
          "x-guest-user": authUser,
          "x-guest-pass": authPass,
        },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== guest.id));
        if (editingGuest?.id === guest.id) {
          setEditingGuest(null);
        }
      } else {
        alert(data.error || "Xóa thất bại");
      }
    } catch {
      alert("Lỗi khi xóa khách mời!");
    }
  };

  // Filtered list & Statistics
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.phone.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.relationship.toLowerCase().includes(q) ||
        g.giftAmount.toLowerCase().includes(q) ||
        g.notes.toLowerCase().includes(q);

      const matchCat = filterCategory === "all" || g.category === filterCategory;
      const matchRel = filterRelationship === "all" || g.relationship === filterRelationship;
      const matchPrio = filterPriority === "all" || g.priority === filterPriority;

      let matchGift = true;
      if (filterGiftState === "has_gift") {
        matchGift = Boolean(g.giftAmount && g.giftAmount.trim() !== "");
      } else if (filterGiftState === "no_gift") {
        matchGift = !g.giftAmount || g.giftAmount.trim() === "";
      } else if (filterGiftState === "need_return") {
        matchGift = Boolean(g.giftAmount && g.giftAmount.trim() !== "") && g.returnGift === "Chưa đi lại";
      } else if (filterGiftState === "returned") {
        matchGift = g.returnGift.includes("Đã đi lại");
      }

      return matchSearch && matchCat && matchRel && matchPrio && matchGift;
    });
  }, [guests, searchQuery, filterCategory, filterRelationship, filterPriority, filterGiftState]);

  const stats = useMemo(() => {
    let totalMoney = 0;
    let countWithGift = 0;
    let countPriority1 = 0;
    let countReturned = 0;

    for (const g of guests) {
      if (g.priority.includes("Ưu tiên 1")) countPriority1++;
      if (g.giftAmount && g.giftAmount.trim() !== "") {
        countWithGift++;
        totalMoney += parseMoneyToVND(g.giftAmount);
      }
      if (g.returnGift.includes("Đã đi lại")) {
        countReturned++;
      }
    }

    return {
      totalGuests: guests.length,
      countPriority1,
      countWithGift,
      totalMoney,
      countReturned,
    };
  }, [guests]);

  if (initializing) {
    return (
      <div className="dashboard-root min-h-screen bg-[#f8f3ed] flex items-center justify-center p-4 text-[16px] text-[#382420]">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">💒</div>
          <p className="font-medium text-[#7f0606] text-[16px]">Đang tải sổ quản lý khách mời...</p>
        </div>
      </div>
    );
  }

  // ==================== LOGIN SCREEN ====================
  if (!authUser) {
    return (
      <div className="dashboard-root min-h-screen bg-[#f8f3ed] flex items-center justify-center p-4 font-sans text-[16px] text-[#382420]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#7f0606]/15 overflow-hidden">
          <div className="bg-[#7f0606] text-[#f8f3ed] px-6 py-6 text-center">
            <div className="text-3xl mb-1">💍</div>
            <h1 className="text-[20px] font-bold tracking-wide uppercase">Sổ Quản Lý Khách Mời & Phong Bì</h1>
            <p className="text-[14px] text-[#f8f3ed]/85 mt-1">Quang Thắng &amp; Tường Lan • 28.11.2026</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[15px] flex items-center gap-2">
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Quick Account Switcher Pills */}
            <div>
              <label className="block text-[14px] font-semibold text-[#7a3519] mb-2">
                Chọn nhanh tài khoản hoặc tự nhập:
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setLoginUser("codau");
                    if (!loginPass) setLoginPass("28112026");
                    setAuthError("");
                  }}
                  className={`py-2.5 px-3 rounded-xl border text-[16px] font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    loginUser.toLowerCase().trim() === "codau"
                      ? "bg-[#7f0606] text-white border-[#7f0606] shadow-sm"
                      : "bg-[#f8f3ed] text-[#7a3519] border-[#7a3519]/25 hover:bg-[#f5ece7]"
                  }`}
                >
                  <span>👰🏻‍♀️</span> Cô Dâu (codau)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginUser("chure");
                    if (!loginPass) setLoginPass("28112026");
                    setAuthError("");
                  }}
                  className={`py-2.5 px-3 rounded-xl border text-[16px] font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    loginUser.toLowerCase().trim() === "chure"
                      ? "bg-[#7f0606] text-white border-[#7f0606] shadow-sm"
                      : "bg-[#f8f3ed] text-[#7a3519] border-[#7a3519]/25 hover:bg-[#f5ece7]"
                  }`}
                >
                  <span>🤵🏻‍♂️</span> Chú Rể (chure)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-stone-700 mb-1.5">
                Tài khoản đăng nhập
              </label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Nhập codau hoặc chure"
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full px-4 py-3 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-stone-50/50 text-stone-900"
              />
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-stone-700 mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Nhập mật khẩu (28112026)..."
                className="w-full px-4 py-3 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-stone-50/50 text-stone-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#7f0606] hover:bg-[#660505] active:scale-[0.99] text-white font-bold text-[16px] rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Đang mở sổ..." : "Vào Sổ Khách Mời"}
            </button>

            <div className="pt-3 border-t border-stone-200/80 text-center text-[13px] text-stone-500 space-y-1">
              <p>Dữ liệu Cô Dâu (<code className="font-mono text-[#7f0606]">codau</code>) và Chú Rể (<code className="font-mono text-[#7f0606]">chure</code>) được tách riêng biệt 100%.</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const isBride = authUser === "codau";
  const ownerTitle = isBride ? "Sổ Khách Mời Cô Dâu (Tường Lan)" : "Sổ Khách Mời Chú Rể (Quang Thắng)";
  const ownerBadge = isBride ? "👰🏻‍♀️ Nhà Gái • codau" : "🤵🏻‍♂️ Nhà Trai • chure";

  // ==================== DASHBOARD SCREEN ====================
  return (
    <div className="dashboard-root min-h-screen bg-[#f8f3ed] font-sans text-[16px] text-[#382420] pb-16">
      {/* Top Sticky Header */}
      <header className="bg-[#7f0606] text-[#f8f3ed] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[24px]">{isBride ? "👰🏻‍♀️" : "🤵🏻‍♂️"}</span>
            <div>
              <h1 className="text-[17px] sm:text-[19px] font-bold leading-tight text-white">
                {ownerTitle}
              </h1>
              <p className="text-[13px] text-[#f8f3ed]/80">
                Tài khoản: <span className="font-semibold underline">{authUser}</span> • Dữ liệu độc lập
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch fast between Bride & Groom */}
            <button
              type="button"
              onClick={() => {
                const target = isBride ? "chure" : "codau";
                fetchGuests(target, authPass);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[13px] sm:text-[14px] font-medium transition cursor-pointer"
              title="Đổi nhanh sang sổ bên kia"
            >
              Đổi sang {isBride ? "🤵🏻‍♂️ Chú Rể" : "👰🏻‍♀️ Cô Dâu"}
            </button>

            <a
              href={`/api/guests?user=${encodeURIComponent(authUser)}&password=${encodeURIComponent(authPass)}&format=csv`}
              download={`danh-sach-khach-${authUser}.csv`}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[13px] sm:text-[14px] font-medium transition shadow-xs"
            >
              📥 Xuất Excel
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-black/25 hover:bg-black/40 text-white text-[13px] sm:text-[14px] font-medium transition cursor-pointer"
            >
              Thoát
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#7a3519]/15 shadow-xs">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#7a3519]">
              Tổng khách mời ({isBride ? "Cô Dâu" : "Chú Rể"})
            </div>
            <div className="text-[24px] font-bold text-[#382420] mt-1">{stats.totalGuests} <span className="text-[14px] font-normal text-stone-500">khách</span></div>
            <div className="text-[13px] text-stone-500 mt-0.5">
              Ưu tiên 1: <strong className="text-[#7f0606]">{stats.countPriority1}</strong> khách
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#7a3519]/15 shadow-xs border-l-4 border-l-[#7f0606]">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#7f0606]">
              Đã nhập phong bì
            </div>
            <div className="text-[24px] font-bold text-[#7f0606] mt-1">
              {stats.countWithGift} <span className="text-[14px] font-normal text-stone-500">/ {stats.totalGuests}</span>
            </div>
            <div className="text-[13px] text-stone-500 mt-0.5">
              Chưa nhập: {stats.totalGuests - stats.countWithGift} khách
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#7a3519]/15 shadow-xs border-l-4 border-l-amber-600">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-amber-800">
              Tổng tiền mừng (Tạm tính)
            </div>
            <div className="text-[22px] sm:text-[24px] font-bold text-amber-900 mt-1 truncate">
              {formatVND(stats.totalMoney)}
            </div>
            <div className="text-[13px] text-stone-500 mt-0.5">
              Tự động cộng từ cột Phong bì
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#7a3519]/15 shadow-xs border-l-4 border-l-emerald-600">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-emerald-700">
              Đã đi lại / Đáp lễ
            </div>
            <div className="text-[24px] font-bold text-emerald-800 mt-1">
              {stats.countReturned} <span className="text-[14px] font-normal text-stone-500">khách</span>
            </div>
            <div className="text-[13px] text-stone-500 mt-0.5">
              Dễ dàng tra cứu sau đám cưới
            </div>
          </div>
        </div>

        {/* QUICK ADD GUEST FORM (16px Mobile-friendly, only Name required) */}
        <section className="bg-white rounded-2xl border border-[#7a3519]/20 shadow-xs overflow-hidden">
          <div className="bg-[#f5ece7] px-4 py-3 border-b border-[#7a3519]/15 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[18px]">➕</span>
              <h2 className="text-[16px] font-bold text-[#7f0606]">
                Thêm Khách Mời Mới ({ownerBadge})
              </h2>
            </div>
            <span className="text-[13px] text-[#7a3519] font-medium">
              * Chỉ bắt buộc nhập <strong>Tên khách mời</strong>, các mục khác có thể bổ sung sau
            </span>
          </div>

          <form onSubmit={handleAddGuest} className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1. Name (Required) */}
              <div>
                <label className="block text-[13px] font-bold uppercase text-[#7f0606] mb-1">
                  Tên khách mời <span className="text-red-600">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="VD: Nguyễn Văn A (Bạn ĐH)..."
                  className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-white text-stone-900"
                />
              </div>

              {/* 2. Phone (Optional) */}
              <div>
                <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                  Số điện thoại (Tùy chọn)
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="VD: 0987..."
                  className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-white text-stone-900"
                />
              </div>

              {/* 3. Category */}
              <div>
                <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                  Danh mục / Nhóm
                </label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-white text-stone-900"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Relationship */}
              <div>
                <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                  Mức độ thân thiết
                </label>
                <select
                  value={relationshipInput}
                  onChange={(e) => setRelationshipInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-white text-stone-900"
                >
                  {RELATIONSHIPS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Priority */}
              <div>
                <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                  Độ ưu tiên mời
                </label>
                <select
                  value={priorityInput}
                  onChange={(e) => setPriorityInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-white text-stone-900"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Gift Amount (Phong bì sau cưới) */}
              <div>
                <label className="block text-[13px] font-semibold uppercase text-amber-800 mb-1">
                  💰 Tiền phong bì (Nhập sau cưới)
                </label>
                <input
                  type="text"
                  value={giftAmountInput}
                  onChange={(e) => setGiftAmountInput(e.target.value)}
                  placeholder="VD: 500k, 1tr, 1 chỉ vàng..."
                  className="w-full px-3.5 py-2.5 text-[16px] border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 bg-amber-50/40 text-stone-900"
                />
              </div>

              {/* 7. Return gift status (Đi lại) */}
              <div>
                <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                  🔄 Trạng thái đi lại
                </label>
                <select
                  value={returnGiftInput}
                  onChange={(e) => setReturnGiftInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-white text-stone-900"
                >
                  {RETURN_GIFT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Notes */}
              <div>
                <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                  Ghi chú (Đi cùng, bàn tiệc, trả lễ...)
                </label>
                <input
                  type="text"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="VD: Mời 2 vợ chồng, gửi thiệp..."
                  className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-white text-stone-900"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="text-[14px] text-emerald-700 font-medium min-h-[20px]">
                {formSuccessMsg && <span>✅ {formSuccessMsg}</span>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 bg-[#7f0606] hover:bg-[#660505] active:scale-[0.99] text-white font-bold text-[16px] rounded-xl shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Đang lưu..." : "+ Lưu Vào Danh Sách"}
              </button>
            </div>
          </form>
        </section>

        {/* SEARCH & FILTER BAR (All 16px inputs for zero zoom on mobile) */}
        <section className="bg-white p-4 rounded-2xl border border-[#7a3519]/20 shadow-xs space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Box */}
            <div className="md:col-span-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Tìm tên, SĐT, tiền phong bì, ghi chú để đi lại..."
                className="w-full px-4 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606] bg-stone-50/60 text-stone-900"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-[16px] border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
              >
                <option value="all">Tất cả danh mục</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Relationship Filter */}
            <div className="md:col-span-2">
              <select
                value={filterRelationship}
                onChange={(e) => setFilterRelationship(e.target.value)}
                className="w-full px-3 py-2.5 text-[16px] border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
              >
                <option value="all">Mọi quan hệ</option>
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="md:col-span-3">
              <select
                value={filterGiftState}
                onChange={(e) => setFilterGiftState(e.target.value)}
                className="w-full px-3 py-2.5 text-[16px] border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
              >
                <option value="all">Tất cả trạng thái phong bì</option>
                <option value="has_gift">💰 Đã có phong bì</option>
                <option value="no_gift">⏳ Chưa nhập phong bì</option>
                <option value="need_return">🔔 Cần đi lại (Chưa trả lễ)</option>
                <option value="returned">✅ Đã đi lại xong</option>
              </select>
            </div>
          </div>

          {/* Quick Category Pills for 1-Tap Filtering */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setFilterCategory("all")}
              className={`px-3 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition cursor-pointer ${
                filterCategory === "all"
                  ? "bg-[#7f0606] text-white"
                  : "bg-[#f8f3ed] text-[#7a3519] hover:bg-[#f5ece7]"
              }`}
            >
              Tất cả ({guests.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = guests.filter((g) => g.category === cat).length;
              if (count === 0 && filterCategory !== cat) return null;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(filterCategory === cat ? "all" : cat)}
                  className={`px-3 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    filterCategory === cat
                      ? "bg-[#7f0606] text-white"
                      : "bg-[#f8f3ed] text-[#7a3519] hover:bg-[#f5ece7]"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* GUEST LIST: FULL TABLE ON DESKTOP + EASY CARDS/TABLE ON MOBILE */}
        <section className="bg-white rounded-2xl border border-[#7a3519]/20 shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-[#f5ece7] border-b border-[#7a3519]/15 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[14px] font-bold uppercase tracking-wider text-[#7f0606]">
              Danh Sách Khách Mời ({filteredGuests.length} khách)
            </span>
            <span className="text-[13px] text-stone-600">
              💡 Bạn có thể gõ trực tiếp <strong>Tiền phong bì</strong> hoặc đổi <strong>Trạng thái đi lại</strong> ngay trên dòng của khách
            </span>
          </div>

          {filteredGuests.length === 0 ? (
            <div className="text-center py-14 px-4 text-stone-500">
              <div className="text-[36px] mb-2">📋</div>
              <p className="text-[16px] font-medium text-stone-700">
                Chưa có khách mời nào trong danh sách lọc này
              </p>
              <p className="text-[14px] mt-1">
                Hãy nhập tên khách mời ở biểu mẫu bên trên để bắt đầu lên danh sách nhé!
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE CARD LIST (Visible on Mobile < 768px for 100% comfortable 16px touch input without horizontal scroll) */}
              <div className="md:hidden divide-y divide-stone-200">
                {filteredGuests.map((guest, index) => (
                  <div key={guest.id} className="p-4 space-y-3 bg-white hover:bg-[#f8f3ed]/40">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7f0606]/10 text-[#7f0606] text-[12px] font-bold">
                            {index + 1}
                          </span>
                          <span className="font-bold text-[17px] text-[#382420]">
                            {guest.name}
                          </span>
                        </div>
                        {guest.phone && (
                          <a
                            href={`tel:${guest.phone}`}
                            className="text-[14px] text-stone-600 hover:text-[#7f0606] inline-flex items-center gap-1 mt-1"
                          >
                            📞 {guest.phone}
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingGuest({ ...guest })}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 active:bg-amber-100 text-stone-700 text-[13px] font-semibold"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGuest(guest)}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 active:bg-red-100 text-red-700 text-[13px] font-semibold"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[12px] font-semibold border ${getCategoryBadgeColor(
                          guest.category
                        )}`}
                      >
                        {guest.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[12px] border ${getRelationshipBadgeColor(
                          guest.relationship
                        )}`}
                      >
                        {guest.relationship}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[12px] border ${getPriorityBadgeColor(
                          guest.priority
                        )}`}
                      >
                        {guest.priority}
                      </span>
                    </div>

                    {/* Quick Gift & Return Gift inputs on Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div>
                        <label className="block text-[12px] font-semibold text-amber-800 mb-1">
                          💰 Tiền phong bì (Sau cưới):
                        </label>
                        <input
                          type="text"
                          defaultValue={guest.giftAmount}
                          key={`mob-gift-${guest.id}-${guest.updatedAt}`}
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            if (val !== guest.giftAmount) {
                              handleQuickUpdate(guest, { giftAmount: val });
                            }
                          }}
                          placeholder="Nhập: 500k, 1tr..."
                          className={`w-full px-3 py-2 text-[16px] rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-600 ${
                            guest.giftAmount
                              ? "bg-amber-50/90 border-amber-400 font-bold text-amber-950"
                              : "bg-stone-50 border-stone-300 text-stone-800"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-semibold text-stone-600 mb-1">
                          🔄 Đi lại / Đáp lễ:
                        </label>
                        <select
                          value={guest.returnGift || "Chưa đi lại"}
                          onChange={(e) =>
                            handleQuickUpdate(guest, { returnGift: e.target.value })
                          }
                          className={`w-full px-3 py-2 text-[16px] rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7f0606] ${
                            guest.returnGift?.includes("Đã đi lại")
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                              : guest.returnGift?.includes("Mừng trước")
                              ? "bg-blue-50 border-blue-300 text-blue-900 font-medium"
                              : "bg-white border-stone-300 text-stone-700"
                          }`}
                        >
                          {RETURN_GIFT_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {guest.notes && (
                      <div className="text-[13px] text-stone-600 bg-stone-50 px-3 py-2 rounded-lg border border-stone-200/80">
                        📝 {guest.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* DESKTOP FULL TABLE (Visible on >= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 text-[13px] font-bold uppercase tracking-wider border-b border-stone-200">
                    <th className="py-3.5 px-3 w-10 text-center">#</th>
                    <th className="py-3.5 px-3 min-w-[180px]">Khách mời &amp; SĐT</th>
                    <th className="py-3.5 px-3 min-w-[140px]">Danh mục</th>
                    <th className="py-3.5 px-3 min-w-[130px]">Quan hệ &amp; Ưu tiên</th>
                    <th className="py-3.5 px-3 min-w-[175px]">💰 Phong bì (Sau cưới)</th>
                    <th className="py-3.5 px-3 min-w-[175px]">🔄 Đi lại / Đáp lễ</th>
                    <th className="py-3.5 px-3 min-w-[160px]">Ghi chú</th>
                    <th className="py-3.5 px-3 text-center min-w-[115px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-[15px]">
                  {filteredGuests.map((guest, index) => (
                    <tr
                      key={guest.id}
                      className="hover:bg-[#f8f3ed]/60 transition align-middle"
                    >
                      {/* STT */}
                      <td className="py-3 px-3 text-center text-[13px] font-semibold text-stone-400">
                        {index + 1}
                      </td>

                      {/* Name & Phone */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-[16px] text-[#382420]">
                          {guest.name}
                        </div>
                        {guest.phone ? (
                          <a
                            href={`tel:${guest.phone}`}
                            className="text-[13px] text-stone-500 hover:text-[#7f0606] inline-flex items-center gap-1 mt-0.5"
                          >
                            📞 {guest.phone}
                          </a>
                        ) : (
                          <span className="text-[13px] text-stone-400 italic">Chưa có SĐT</span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[13px] font-semibold border ${getCategoryBadgeColor(
                            guest.category
                          )}`}
                        >
                          {guest.category}
                        </span>
                      </td>

                      {/* Relationship & Priority */}
                      <td className="py-3 px-3 space-y-1">
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[13px] border ${getRelationshipBadgeColor(
                              guest.relationship
                            )}`}
                          >
                            {guest.relationship}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[12px] border ${getPriorityBadgeColor(
                              guest.priority
                            )}`}
                          >
                            {guest.priority}
                          </span>
                        </div>
                      </td>

                      {/* Inline Quick Input: Gift Amount (16px font to prevent mobile zoom) */}
                      <td className="py-3 px-3">
                        <div className="relative">
                          <input
                            type="text"
                            defaultValue={guest.giftAmount}
                            key={`gift-${guest.id}-${guest.updatedAt}`}
                            onBlur={(e) => {
                              const val = e.target.value.trim();
                              if (val !== guest.giftAmount) {
                                handleQuickUpdate(guest, { giftAmount: val });
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            placeholder="Nhập: 500k, 1tr..."
                            className={`w-full px-3 py-2 text-[16px] rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-amber-600 ${
                              guest.giftAmount
                                ? "bg-amber-50/90 border-amber-400 font-bold text-amber-950"
                                : "bg-stone-50 border-stone-300 text-stone-800"
                            }`}
                          />
                          {updatingId === guest.id && (
                            <span className="absolute right-2 top-2.5 text-[13px] text-amber-700">
                              ⏳
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Inline Quick Select: Return Gift Status */}
                      <td className="py-3 px-3">
                        <select
                          value={guest.returnGift || "Chưa đi lại"}
                          onChange={(e) =>
                            handleQuickUpdate(guest, { returnGift: e.target.value })
                          }
                          className={`w-full px-2.5 py-2 text-[16px] rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7f0606] ${
                            guest.returnGift?.includes("Đã đi lại")
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                              : guest.returnGift?.includes("Mừng trước")
                              ? "bg-blue-50 border-blue-300 text-blue-900 font-medium"
                              : "bg-white border-stone-300 text-stone-700"
                          }`}
                        >
                          {RETURN_GIFT_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-3 text-[14px] text-stone-600">
                        {guest.notes ? (
                          <span>{guest.notes}</span>
                        ) : (
                          <span className="text-stone-400 italic">—</span>
                        )}
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingGuest({ ...guest })}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 text-[13px] font-semibold transition cursor-pointer"
                            title="Sửa thông tin"
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(guest)}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-600 hover:text-red-700 text-[13px] font-semibold transition cursor-pointer"
                            title="Xóa khách mời"
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </section>
      </main>

      {/* EDIT MODAL (16px inputs for mobile comfort) */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#7a3519]/20 overflow-hidden my-8">
            <div className="bg-[#7f0606] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[17px]">
                ✏️ Sửa Thông Tin Khách Mời
              </h3>
              <button
                type="button"
                onClick={() => setEditingGuest(null)}
                className="text-white/80 hover:text-white text-[20px] leading-none px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-[16px]">
              <div>
                <label className="block text-[13px] font-bold uppercase text-[#7f0606] mb-1">
                  Tên khách mời <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingGuest.name}
                  onChange={(e) =>
                    setEditingGuest({ ...editingGuest, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editingGuest.phone}
                    onChange={(e) =>
                      setEditingGuest({ ...editingGuest, phone: e.target.value })
                    }
                    placeholder="Tùy chọn..."
                    className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                    Danh mục / Nhóm
                  </label>
                  <select
                    value={editingGuest.category}
                    onChange={(e) =>
                      setEditingGuest({ ...editingGuest, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                    Mức độ thân thiết
                  </label>
                  <select
                    value={editingGuest.relationship}
                    onChange={(e) =>
                      setEditingGuest({
                        ...editingGuest,
                        relationship: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
                  >
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                    Độ ưu tiên
                  </label>
                  <select
                    value={editingGuest.priority}
                    onChange={(e) =>
                      setEditingGuest({ ...editingGuest, priority: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold uppercase text-amber-800 mb-1">
                    💰 Tiền phong bì
                  </label>
                  <input
                    type="text"
                    value={editingGuest.giftAmount}
                    onChange={(e) =>
                      setEditingGuest({
                        ...editingGuest,
                        giftAmount: e.target.value,
                      })
                    }
                    placeholder="VD: 500k, 1tr..."
                    className="w-full px-3.5 py-2.5 text-[16px] border border-amber-300 bg-amber-50/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                    🔄 Trạng thái đi lại
                  </label>
                  <select
                    value={editingGuest.returnGift}
                    onChange={(e) =>
                      setEditingGuest({
                        ...editingGuest,
                        returnGift: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
                  >
                    {RETURN_GIFT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold uppercase text-stone-600 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={2}
                  value={editingGuest.notes}
                  onChange={(e) =>
                    setEditingGuest({ ...editingGuest, notes: e.target.value })
                  }
                  placeholder="Ghi chú thêm..."
                  className="w-full px-3.5 py-2.5 text-[16px] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f0606]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-[16px] hover:bg-stone-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2.5 rounded-xl bg-[#7f0606] hover:bg-[#660505] text-white font-bold text-[16px] shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
