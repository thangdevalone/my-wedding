"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f3ed",
        color: "#7f0606",
        fontFamily: "sans-serif",
        fontSize: "16px",
        fontWeight: 700,
      }}
    >
      Đang chuyển tới trang Quản Lý Khách Mời &amp; Lời Chúc (/dashboard)...
    </div>
  );
}
