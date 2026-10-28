"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { GuestItem, GuestOwner, RsvpRow } from "../lib/db";
import "./dashboard.css";

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

  const digitsOnly = s.replace(/[^\d]/g, "");
  if (!digitsOnly) return 0;
  const num = parseInt(digitsOnly, 10);
  if (isNaN(num)) return 0;

  if (num > 0 && num < 50_000) {
    return num * 1_000;
  }
  return num;
}

function formatVND(amount: number): string {
  if (!amount || amount <= 0) return "0 đ";
  return amount.toLocaleString("vi-VN") + " đ";
}

function getCategoryStyle(cat: string): React.CSSProperties {
  if (cat.includes("Gia đình")) return { backgroundColor: "#fef3c7", color: "#78350f", borderColor: "#fcd34d" };
  if (cat.includes("đại học")) return { backgroundColor: "#dbeafe", color: "#1e3a8a", borderColor: "#93c5fd" };
  if (cat.includes("cấp 3")) return { backgroundColor: "#f3e8ff", color: "#581c87", borderColor: "#d8b4fe" };
  if (cat.includes("cấp 2") || cat.includes("cấp 1")) return { backgroundColor: "#e0e7ff", color: "#312e81", borderColor: "#a5b4fc" };
  if (cat.includes("Đồng nghiệp")) return { backgroundColor: "#ccfbf1", color: "#134e4a", borderColor: "#5eead4" };
  if (cat.includes("xã giao")) return { backgroundColor: "#f5f5f4", color: "#44403c", borderColor: "#d6d3d1" };
  return { backgroundColor: "#ffe4e6", color: "#881337", borderColor: "#fda4af" };
}

function getPriorityStyle(prio: string): React.CSSProperties {
  if (prio.includes("Ưu tiên 1")) return { backgroundColor: "#fee2e2", color: "#7f1d1d", borderColor: "#fca5a5" };
  if (prio.includes("Ưu tiên 2")) return { backgroundColor: "#fef3c7", color: "#92400e", borderColor: "#fde68a" };
  return { backgroundColor: "#f5f5f4", color: "#57534e", borderColor: "#e7e5e4" };
}

function getRelationshipStyle(rel: string): React.CSSProperties {
  if (rel.includes("Thân") || rel.includes("Ruột thịt")) return { backgroundColor: "#ffe4e6", color: "#881337", borderColor: "#fda4af" };
  if (rel.includes("Xã giao")) return { backgroundColor: "#f5f5f4", color: "#44403c", borderColor: "#d6d3d1" };
  return { backgroundColor: "#ffedd5", color: "#7c2d12", borderColor: "#fed7aa" };
}

export default function DashboardPage() {
  // Auth state
  const [authUser, setAuthUser] = useState<GuestOwner | null>(null);
  const [authPass, setAuthPass] = useState<string>("");
  const [loginUser, setLoginUser] = useState<string>("codau");
  const [loginPass, setLoginPass] = useState<string>("28112026");
  const [authError, setAuthError] = useState<string>("");
  const [initializing, setInitializing] = useState<boolean>(true);

  // Data state
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [wishes, setWishes] = useState<RsvpRow[]>([]);
  const [deletingWishId, setDeletingWishId] = useState<number | null>(null);
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
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRelationship, setFilterRelationship] = useState<string>("all");
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
      setWishes(data.wishes || []);
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
        setNameInput("");
        setPhoneInput("");
        setGiftAmountInput("");
        setNotesInput("");
        setFormSuccessMsg(`Đã thêm "${data.guest.name}" vào sổ!`);
        setTimeout(() => setFormSuccessMsg(""), 3000);
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

  // Quick Inline Update for Gift Amount or Return Gift Status
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
      // ignore
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

  // Delete Wish
  const handleDeleteWish = async (wish: RsvpRow) => {
    if (!authUser || !authPass) return;
    if (!window.confirm(`Bạn có chắc muốn xóa lời chúc của "${wish.name}" trên thiệp cưới không?`)) {
      return;
    }

    setDeletingWishId(wish.id);
    try {
      const res = await fetch(`/api/guests?id=${wish.id}&type=wish`, {
        method: "DELETE",
        headers: {
          "x-guest-user": authUser,
          "x-guest-pass": authPass,
        },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setWishes((prev) => prev.filter((w) => w.id !== wish.id));
      } else {
        alert(data.error || "Xóa lời chúc thất bại!");
      }
    } catch {
      alert("Lỗi khi xóa lời chúc!");
    } finally {
      setDeletingWishId(null);
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

      return matchSearch && matchCat && matchRel && matchGift;
    });
  }, [guests, searchQuery, filterCategory, filterRelationship, filterGiftState]);

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
      <div className="db-page db-login-wrap">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>💒</div>
          <p style={{ fontWeight: 700, color: "#7f0606", fontSize: 16 }}>
            Đang mở Sổ Quản Lý Khách Mời...
          </p>
        </div>
      </div>
    );
  }

  // ==================== LOGIN SCREEN ====================
  if (!authUser) {
    return (
      <div className="db-page db-login-wrap">
        <div className="db-login-card">
          <div className="db-login-header">
            <div style={{ fontSize: 36 }}>💍</div>
            <h1 className="db-login-title">Sổ Quản Lý Khách Mời &amp; Phong Bì</h1>
            <p className="db-login-subtitle">Quang Thắng &amp; Tường Lan • 28.11.2026</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="db-login-body">
            {authError && (
              <div
                style={{
                  padding: "12px 14px",
                  marginBottom: 18,
                  borderRadius: 12,
                  backgroundColor: "#fef2f2",
                  border: "1.5px solid #fecaca",
                  color: "#b91c1c",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                ⚠️ {authError}
              </div>
            )}

            <div className="db-login-field">
              <label className="db-label">Chọn nhanh sổ của bạn:</label>
              <div className="db-role-grid">
                <button
                  type="button"
                  onClick={() => {
                    setLoginUser("codau");
                    if (!loginPass) setLoginPass("28112026");
                    setAuthError("");
                  }}
                  className={`db-role-btn ${loginUser.toLowerCase().trim() === "codau" ? "active" : ""}`}
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
                  className={`db-role-btn ${loginUser.toLowerCase().trim() === "chure" ? "active" : ""}`}
                >
                  <span>🤵🏻‍♂️</span> Chú Rể (chure)
                </button>
              </div>
            </div>

            <div className="db-login-field">
              <label className="db-label">Tài khoản đăng nhập</label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Nhập codau hoặc chure"
                autoCapitalize="none"
                autoCorrect="off"
                className="db-input"
              />
            </div>

            <div className="db-login-field">
              <label className="db-label">Mật khẩu</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Nhập mật khẩu (28112026)..."
                className="db-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="db-btn db-btn-primary"
              style={{ width: "100%", marginTop: 6 }}
            >
              {loading ? "Đang mở sổ..." : "Vào Sổ Khách Mời →"}
            </button>

            <div
              style={{
                marginTop: 20,
                paddingTop: 14,
                borderTop: "1px solid #eee7e1",
                textAlign: "center",
                fontSize: 13,
                color: "#786c66",
              }}
            >
              Dữ liệu khách mời của Cô Dâu (<strong>codau</strong>) và Chú Rể (<strong>chure</strong>) được tách riêng biệt 100%.
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
    <div className="db-page">
      {/* Top Sticky Header */}
      <header className="db-topbar">
        <div className="db-topbar-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>{isBride ? "👰🏻‍♀️" : "🤵🏻‍♂️"}</span>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#ffffff" }}>
                {ownerTitle}
              </h1>
              <p style={{ fontSize: 13, margin: 0, color: "rgba(248, 243, 237, 0.85)" }}>
                Tài khoản: <strong style={{ textDecoration: "underline" }}>{authUser}</strong> • Dữ liệu tách riêng
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                const target = isBride ? "chure" : "codau";
                fetchGuests(target, authPass);
              }}
              className="db-btn db-btn-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#ffffff" }}
            >
              Đổi sang {isBride ? "🤵🏻‍♂️ Chú Rể" : "👰🏻‍♀️ Cô Dâu"}
            </button>

            <a
              href={`/api/guests?user=${encodeURIComponent(authUser)}&password=${encodeURIComponent(authPass)}&format=csv`}
              download={`danh-sach-khach-${authUser}.csv`}
              className="db-btn db-btn-sm"
              style={{ backgroundColor: "#047857", color: "#ffffff" }}
            >
              📥 Xuất Excel
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="db-btn db-btn-sm"
              style={{ backgroundColor: "rgba(0,0,0,0.28)", color: "#ffffff" }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="db-container">
        {/* Summary Metric Cards */}
        <div className="db-stats-grid">
          <div className="db-stat-card">
            <div className="db-stat-label">
              Tổng khách ({isBride ? "Cô Dâu" : "Chú Rể"})
            </div>
            <div className="db-stat-value">
              {stats.totalGuests} <span style={{ fontSize: 14, fontWeight: 500, color: "#786c66" }}>khách</span>
            </div>
            <div className="db-stat-sub">
              Ưu tiên 1: <strong style={{ color: "#7f0606" }}>{stats.countPriority1}</strong> khách
            </div>
          </div>

          <div className="db-stat-card" style={{ borderLeft: "4px solid #7f0606" }}>
            <div className="db-stat-label" style={{ color: "#7f0606" }}>
              Đã nhập phong bì
            </div>
            <div className="db-stat-value" style={{ color: "#7f0606" }}>
              {stats.countWithGift}{" "}
              <span style={{ fontSize: 14, fontWeight: 500, color: "#786c66" }}>
                / {stats.totalGuests}
              </span>
            </div>
            <div className="db-stat-sub">
              Chưa nhập: {stats.totalGuests - stats.countWithGift} khách
            </div>
          </div>

          <div className="db-stat-card" style={{ borderLeft: "4px solid #d97706" }}>
            <div className="db-stat-label" style={{ color: "#b45309" }}>
              Tổng tiền mừng (Tạm tính)
            </div>
            <div className="db-stat-value" style={{ color: "#92400e" }}>
              {formatVND(stats.totalMoney)}
            </div>
            <div className="db-stat-sub">Tự động cộng từ cột Phong bì</div>
          </div>

          <div className="db-stat-card" style={{ borderLeft: "4px solid #059669" }}>
            <div className="db-stat-label" style={{ color: "#047857" }}>
              Đã đi lại / Đáp lễ
            </div>
            <div className="db-stat-value" style={{ color: "#065f46" }}>
              {stats.countReturned}{" "}
              <span style={{ fontSize: 14, fontWeight: 500, color: "#786c66" }}>khách</span>
            </div>
            <div className="db-stat-sub">Dễ dàng tra cứu sau đám cưới</div>
          </div>
        </div>

        {/* QUICK ADD GUEST FORM */}
        <section className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">
              <span>➕</span> Thêm Khách Mời Mới ({ownerBadge})
            </h2>
            <span style={{ fontSize: 13, color: "#7a3519", fontWeight: 600 }}>
              * Chỉ bắt buộc nhập <strong>Tên khách mời</strong>, các mục khác để trống được
            </span>
          </div>

          <form onSubmit={handleAddGuest} className="db-card-body">
            <div className="db-form-grid">
              <div>
                <label className="db-label db-label-required">
                  1. Tên khách mời <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="VD: Nguyễn Văn A (Bạn ĐH)..."
                  className="db-input"
                />
              </div>

              <div>
                <label className="db-label">2. Số điện thoại (Tùy chọn)</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="VD: 0987..."
                  className="db-input"
                />
              </div>

              <div>
                <label className="db-label">3. Danh mục / Nhóm</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="db-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="db-label">4. Mức độ thân thiết</label>
                <select
                  value={relationshipInput}
                  onChange={(e) => setRelationshipInput(e.target.value)}
                  className="db-select"
                >
                  {RELATIONSHIPS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="db-label">5. Độ ưu tiên mời</label>
                <select
                  value={priorityInput}
                  onChange={(e) => setPriorityInput(e.target.value)}
                  className="db-select"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="db-label" style={{ color: "#92400e" }}>
                  6. 💰 Tiền phong bì (Sau cưới)
                </label>
                <input
                  type="text"
                  value={giftAmountInput}
                  onChange={(e) => setGiftAmountInput(e.target.value)}
                  placeholder="VD: 500k, 1tr, 1 chỉ vàng..."
                  className="db-input db-input-gift"
                />
              </div>

              <div>
                <label className="db-label">7. 🔄 Trạng thái đi lại</label>
                <select
                  value={returnGiftInput}
                  onChange={(e) => setReturnGiftInput(e.target.value)}
                  className="db-select"
                >
                  {RETURN_GIFT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="db-label">8. Ghi chú thêm</label>
                <input
                  type="text"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="VD: Mời 2 vợ chồng, bàn số 3..."
                  className="db-input"
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 18,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: "#047857", minHeight: 22 }}>
                {formSuccessMsg && <span>✅ {formSuccessMsg}</span>}
              </div>

              <button type="submit" disabled={submitting} className="db-btn db-btn-primary">
                {submitting ? "Đang lưu..." : "+ Lưu Vào Danh Sách"}
              </button>
            </div>
          </form>
        </section>

        {/* SEARCH & FILTER BAR */}
        <section className="db-card">
          <div className="db-card-body">
            <div className="db-filter-grid">
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Tìm tên, SĐT, tiền phong bì, ghi chú để đi lại..."
                  className="db-input"
                />
              </div>

              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="db-select"
                >
                  <option value="all">Tất cả danh mục</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterRelationship}
                  onChange={(e) => setFilterRelationship(e.target.value)}
                  className="db-select"
                >
                  <option value="all">Mọi quan hệ</option>
                  {RELATIONSHIPS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterGiftState}
                  onChange={(e) => setFilterGiftState(e.target.value)}
                  className="db-select"
                >
                  <option value="all">Mọi trạng thái phong bì</option>
                  <option value="has_gift">💰 Đã có phong bì</option>
                  <option value="no_gift">⏳ Chưa nhập phong bì</option>
                  <option value="need_return">🔔 Cần đi lại (Chưa trả lễ)</option>
                  <option value="returned">✅ Đã đi lại xong</option>
                </select>
              </div>
            </div>

            {/* Category Quick Pills */}
            <div className="db-pills">
              <button
                type="button"
                onClick={() => setFilterCategory("all")}
                className={`db-pill ${filterCategory === "all" ? "active" : ""}`}
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
                    className={`db-pill ${filterCategory === cat ? "active" : ""}`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* GUEST LIST */}
        <section className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">
              <span>📋</span> Danh Sách Khách Mời ({filteredGuests.length} khách)
            </h2>
            <span style={{ fontSize: 13, color: "#6b4c3e" }}>
              💡 Gõ trực tiếp <strong>Tiền phong bì</strong> hoặc chọn <strong>Đi lại</strong> ngay trên từng dòng, hệ thống tự lưu!
            </span>
          </div>

          {filteredGuests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#786c66" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#382420", margin: "0 0 4px 0" }}>
                Chưa có khách mời nào trong danh sách
              </p>
              <p style={{ fontSize: 14, margin: 0 }}>
                Hãy nhập tên khách mời ở khung Thêm Khách Mời bên trên để bắt đầu nhé!
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE CARDS (< 768px) */}
              <div className="db-mobile-list">
                {filteredGuests.map((guest, index) => (
                  <div key={guest.id} className="db-mobile-card">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              backgroundColor: "rgba(127,6,6,0.12)",
                              color: "#7f0606",
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            {index + 1}
                          </span>
                          <strong style={{ fontSize: 17, color: "#2b1814" }}>{guest.name}</strong>
                        </div>
                        {guest.phone && (
                          <a
                            href={`tel:${guest.phone}`}
                            style={{
                              display: "inline-block",
                              marginTop: 4,
                              fontSize: 14,
                              color: "#7a3519",
                              fontWeight: 600,
                            }}
                          >
                            📞 {guest.phone}
                          </a>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setEditingGuest({ ...guest })}
                          className="db-btn db-btn-secondary db-btn-sm"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGuest(guest)}
                          className="db-btn db-btn-sm"
                          style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      <span className="db-badge" style={getCategoryStyle(guest.category)}>
                        {guest.category}
                      </span>
                      <span className="db-badge" style={getRelationshipStyle(guest.relationship)}>
                        {guest.relationship}
                      </span>
                      <span className="db-badge" style={getPriorityStyle(guest.priority)}>
                        {guest.priority}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                      <div>
                        <label className="db-label" style={{ color: "#92400e", marginBottom: 4 }}>
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
                          className={`db-input ${guest.giftAmount ? "db-input-gift" : ""}`}
                        />
                      </div>

                      <div>
                        <label className="db-label" style={{ marginBottom: 4 }}>
                          🔄 Đi lại / Đáp lễ:
                        </label>
                        <select
                          value={guest.returnGift || "Chưa đi lại"}
                          onChange={(e) =>
                            handleQuickUpdate(guest, { returnGift: e.target.value })
                          }
                          className="db-select"
                          style={
                            guest.returnGift?.includes("Đã đi lại")
                              ? { backgroundColor: "#ecfdf5", borderColor: "#6ee7b7", color: "#065f46", fontWeight: 700 }
                              : guest.returnGift?.includes("Mừng trước")
                              ? { backgroundColor: "#eff6ff", borderColor: "#93c5fd", color: "#1e40af", fontWeight: 600 }
                              : undefined
                          }
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
                      <div
                        style={{
                          marginTop: 10,
                          padding: "8px 12px",
                          backgroundColor: "#faf6f2",
                          borderRadius: 8,
                          fontSize: 13,
                          color: "#574c47",
                        }}
                      >
                        📝 {guest.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* DESKTOP FULL TABLE (>= 768px) */}
              <div className="db-desktop-table db-table-wrap">
                <table className="db-table">
                <thead>
                  <tr>
                    <th style={{ width: 46, textAlign: "center" }}>#</th>
                    <th style={{ minWidth: 190 }}>Khách mời &amp; SĐT</th>
                    <th style={{ minWidth: 145 }}>Danh mục</th>
                    <th style={{ minWidth: 165 }}>Quan hệ &amp; Ưu tiên</th>
                    <th style={{ minWidth: 185 }}>💰 Phong bì (Sau cưới)</th>
                    <th style={{ minWidth: 195 }}>🔄 Đi lại / Đáp lễ</th>
                    <th style={{ minWidth: 160 }}>Ghi chú</th>
                    <th style={{ minWidth: 135, textAlign: "center" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest, index) => (
                    <tr key={guest.id}>
                      <td style={{ textAlign: "center", fontWeight: 700, color: "#9a8c84" }}>
                        {index + 1}
                      </td>

                      <td>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#2b1814" }}>
                          {guest.name}
                        </div>
                        {guest.phone ? (
                          <a
                            href={`tel:${guest.phone}`}
                            style={{ fontSize: 13, color: "#7a3519", fontWeight: 600 }}
                          >
                            📞 {guest.phone}
                          </a>
                        ) : (
                          <span style={{ fontSize: 12, color: "#a89f9a", fontStyle: "italic" }}>
                            Chưa có SĐT
                          </span>
                        )}
                      </td>

                      <td>
                        <span className="db-badge" style={getCategoryStyle(guest.category)}>
                          {guest.category}
                        </span>
                      </td>

                      <td>
                        <div style={{ marginBottom: 4 }}>
                          <span className="db-badge" style={getRelationshipStyle(guest.relationship)}>
                            {guest.relationship}
                          </span>
                        </div>
                        <div>
                          <span className="db-badge" style={getPriorityStyle(guest.priority)}>
                            {guest.priority}
                          </span>
                        </div>
                      </td>

                      {/* Quick Inline Gift Amount Input */}
                      <td>
                        <div style={{ position: "relative" }}>
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
                            className={`db-input ${guest.giftAmount ? "db-input-gift" : ""}`}
                            style={{ padding: "8px 12px !important" }}
                          />
                          {updatingId === guest.id && (
                            <span style={{ position: "absolute", right: 10, top: 10, fontSize: 13 }}>
                              ⏳
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quick Inline Return Gift Select */}
                      <td>
                        <select
                          value={guest.returnGift || "Chưa đi lại"}
                          onChange={(e) =>
                            handleQuickUpdate(guest, { returnGift: e.target.value })
                          }
                          className="db-select"
                          style={
                            guest.returnGift?.includes("Đã đi lại")
                              ? { backgroundColor: "#ecfdf5", borderColor: "#6ee7b7", color: "#065f46", fontWeight: 700 }
                              : guest.returnGift?.includes("Mừng trước")
                              ? { backgroundColor: "#eff6ff", borderColor: "#93c5fd", color: "#1e40af", fontWeight: 600 }
                              : undefined
                          }
                        >
                          {RETURN_GIFT_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td style={{ fontSize: 14, color: "#574c47" }}>
                        {guest.notes || <span style={{ color: "#b8afa9" }}>—</span>}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => setEditingGuest({ ...guest })}
                            className="db-btn db-btn-secondary db-btn-sm"
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(guest)}
                            className="db-btn db-btn-sm"
                            style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}
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

        {/* WISHES MANAGEMENT SECTION */}
        <section className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">
              <span>💌</span> Lời Chúc Trên Thiệp Cưới ({wishes.length} lời chúc)
            </h2>
            <span style={{ fontSize: 13, color: "#6b4c3e" }}>
              Hiển thị ngoài trang chủ • Bấm <strong>Xóa lời chúc</strong> nếu có spam hoặc nhầm lẫn
            </span>
          </div>

          {wishes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 20px", color: "#786c66" }}>
              Chưa có lời chúc nào được gửi trên thiệp cưới.
            </div>
          ) : (
            <div style={{ maxHeight: 460, overflowY: "auto" }}>
              {wishes.map((w) => (
                <div
                  key={w.id}
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #eee7e1",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 16, color: "#7f0606" }}>{w.name}</strong>
                      {w.invite && (
                        <span
                          className="db-badge"
                          style={{ backgroundColor: "#fef3c7", color: "#92400e", borderColor: "#fde68a" }}
                        >
                          Link: #{w.invite}
                        </span>
                      )}
                      {w.created_at && (
                        <span style={{ fontSize: 12, color: "#8a7e78" }}>
                          {new Date(w.created_at).toLocaleString("vi-VN", {
                            timeZone: "Asia/Ho_Chi_Minh",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: 15, fontStyle: "italic", color: "#382420", wordBreak: "break-word" }}>
                      “{w.message}”
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteWish(w)}
                    disabled={deletingWishId === w.id}
                    className="db-btn db-btn-sm"
                    style={{ backgroundColor: "#fee2e2", color: "#b91c1c", flexShrink: 0 }}
                  >
                    {deletingWishId === w.id ? "Đang xóa..." : "🗑️ Xóa lời chúc"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* EDIT MODAL */}
      {editingGuest && (
        <div className="db-modal-backdrop">
          <div className="db-modal">
            <div className="db-modal-header">
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#ffffff" }}>
                ✏️ Sửa Thông Tin Khách Mời
              </h3>
              <button
                type="button"
                onClick={() => setEditingGuest(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontSize: 20,
                  cursor: "pointer",
                  padding: "0 6px",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="db-modal-body">
              <div style={{ marginBottom: 14 }}>
                <label className="db-label db-label-required">
                  Tên khách mời <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingGuest.name}
                  onChange={(e) =>
                    setEditingGuest({ ...editingGuest, name: e.target.value })
                  }
                  className="db-input"
                />
              </div>

              <div className="db-form-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 14 }}>
                <div>
                  <label className="db-label">Số điện thoại</label>
                  <input
                    type="tel"
                    value={editingGuest.phone}
                    onChange={(e) =>
                      setEditingGuest({ ...editingGuest, phone: e.target.value })
                    }
                    placeholder="Tùy chọn..."
                    className="db-input"
                  />
                </div>

                <div>
                  <label className="db-label">Danh mục / Nhóm</label>
                  <select
                    value={editingGuest.category}
                    onChange={(e) =>
                      setEditingGuest({ ...editingGuest, category: e.target.value })
                    }
                    className="db-select"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="db-label">Mức độ thân thiết</label>
                  <select
                    value={editingGuest.relationship}
                    onChange={(e) =>
                      setEditingGuest({
                        ...editingGuest,
                        relationship: e.target.value,
                      })
                    }
                    className="db-select"
                  >
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="db-label">Độ ưu tiên</label>
                  <select
                    value={editingGuest.priority}
                    onChange={(e) =>
                      setEditingGuest({ ...editingGuest, priority: e.target.value })
                    }
                    className="db-select"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="db-label" style={{ color: "#92400e" }}>
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
                    className="db-input db-input-gift"
                  />
                </div>

                <div>
                  <label className="db-label">🔄 Trạng thái đi lại</label>
                  <select
                    value={editingGuest.returnGift}
                    onChange={(e) =>
                      setEditingGuest({
                        ...editingGuest,
                        returnGift: e.target.value,
                      })
                    }
                    className="db-select"
                  >
                    {RETURN_GIFT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="db-label">Ghi chú</label>
                <textarea
                  rows={2}
                  value={editingGuest.notes}
                  onChange={(e) =>
                    setEditingGuest({ ...editingGuest, notes: e.target.value })
                  }
                  placeholder="Ghi chú thêm..."
                  className="db-textarea"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="db-btn db-btn-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="db-btn db-btn-primary"
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
