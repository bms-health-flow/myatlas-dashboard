import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, HeartPulse, Home, ChevronRight,
  RefreshCw, LogOut, Shield, Building2, Bell, Search, ArrowRight,
  Sparkles, Download,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/vitalsign", icon: HeartPulse, label: "Vital Sign" },
  { to: "/homevisit", icon: Home, label: "การเยี่ยมบ้าน" },
];

const pageTitles = {
  "/dashboard": "Dashboard",
  "/vitalsign": "ติดตาม Vital Sign",
  "/homevisit": "ติดตามการเยี่ยมบ้าน",
};

const notifications = [
  {
    id: 1,
    name: "น.ส.ธาตุทอง สีดา",
    condition: "ค่าความดันผิดปกติ 150/77 mmHg",
    time: "2 นาทีที่แล้ว",
    type: "critical",
  },
  {
    id: 2,
    name: "นายประทัย แดงฐูม",
    condition: "อัตราหัวใจเต้นเร็ว 115 bpm",
    time: "5 นาทีที่แล้ว",
    type: "critical",
  },
  {
    id: 3,
    name: "นางอารณ์ คำศรี",
    condition: "อุณหภูมิสูง 38.5°C",
    time: "12 นาทีที่แล้ว",
    type: "warning",
  },
];

const glassCardStyle = {
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: "20px",
  boxShadow: "0 16px 56px rgba(0,0,0,0.1)",
  border: "1.5px solid rgba(255,255,255,0.9)",
};

export default function MainLayout({ initialRole = "admin", onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [role, setRole] = useState(initialRole);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close notification & search dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("th-TH", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const pageTitle = pageTitles[location.pathname] || "Atlas Dashboard";

  // Search filtering
  const filteredNavItems = searchQuery.trim()
    ? navItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  return (
    <div className="app">
      {/* ─── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar-inner">
          {/* Logo */}
          <div className="s-logo">
            <div className="s-logo-icon">A</div>
            <span className="s-logo-text">
              Atlas
              <span>Healthcare</span>
            </span>
          </div>

          {/* Role Switcher */}
          <div className="s-role">
            <button
              className={`s-role-btn ${role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
            >
              <Shield size={13} /> Admin
            </button>
            <button
              className={`s-role-btn ${role === "hospital" ? "active" : ""}`}
              onClick={() => setRole("hospital")}
            >
              <Building2 size={13} /> Hospital
            </button>
          </div>

          <div className="s-divider" />

          {/* Nav */}
          <div className="s-section">Menu</div>
          <nav className="s-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) => `s-link ${isActive ? "active" : ""}`}
              >
                <item.icon />
                <span>{item.label}</span>
                <span className="s-arrow"><ChevronRight size={14} /></span>
              </NavLink>
            ))}
          </nav>

          {/* Promo */}
          <div className="s-bottom">
            <div className="s-promo">
              <p>ระบบติดตามสุขภาพ อัจฉริยะ ด้วย AI</p>
              <a href="#">
                <Sparkles size={14} /> อัปเกรด Pro <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* User */}
          <div className="s-user">
            <div className="s-user-avatar">ส</div>
            <div className="s-user-info">
              <div className="name">สมชาย ใจดี</div>
              <div className="role">{role === "admin" ? "ผู้ดูแลระบบ" : "เจ้าหน้าที่ รพ."}</div>
            </div>
            <button className="s-logout" title="ออกจากระบบ" onClick={onLogout}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div className="main">
        <div className="main-inner">
          {/* Top bar */}
          <header className="topbar">
            <h1>{pageTitle}</h1>
            <div className="topbar-right">

              {/* ─── Search with dropdown ─── */}
              <div ref={searchRef} style={{ position: "relative" }}>
                <div className="t-search">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="ค้นหา..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(e.target.value.trim().length > 0);
                    }}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) setSearchOpen(true);
                    }}
                  />
                </div>

                {searchOpen && searchQuery.trim() && (
                  <div
                    style={{
                      ...glassCardStyle,
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      width: "100%",
                      minWidth: "220px",
                      zIndex: 1000,
                      padding: "8px 0",
                      animation: "notifSlideDown 0.2s ease-out",
                    }}
                  >
                    {filteredNavItems.map((item) => (
                      <div
                        key={item.to}
                        onClick={() => {
                          navigate(item.to);
                          setSearchQuery("");
                          setSearchOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 16px",
                          cursor: "pointer",
                          fontSize: "13px",
                          color: "#334155",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <item.icon size={16} style={{ color: "#6366f1" }} />
                        <span>{item.label}</span>
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        alert(`ค้นหาผู้ป่วย: ${searchQuery.trim()}`);
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 16px",
                        cursor: "pointer",
                        fontSize: "13px",
                        color: "#6366f1",
                        borderTop: filteredNavItems.length > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                        marginTop: filteredNavItems.length > 0 ? "4px" : 0,
                        paddingTop: filteredNavItems.length > 0 ? "12px" : "10px",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Search size={14} />
                      <span>ค้นหาผู้ป่วย: {searchQuery.trim()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── Notification bell with dropdown ─── */}
              <div ref={notifRef} style={{ position: "relative" }}>
                <button
                  className="t-icon"
                  onClick={() => setNotifOpen((prev) => !prev)}
                >
                  <Bell size={18} />
                  <span className="t-dot" />
                </button>

                {notifOpen && (
                  <div
                    style={{
                      ...glassCardStyle,
                      position: "absolute",
                      top: "calc(100% + 12px)",
                      right: 0,
                      width: "380px",
                      zIndex: 1000,
                      overflow: "hidden",
                      animation: "notifSlideDown 0.25s ease-out",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "18px 20px 14px",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b" }}>
                          การแจ้งเตือน
                        </span>
                        <span
                          style={{
                            background: "linear-gradient(135deg, #ef4444, #f97316)",
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: 700,
                            borderRadius: "10px",
                            padding: "2px 9px",
                            lineHeight: "18px",
                          }}
                        >
                          3
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ padding: "6px 0" }}>
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          style={{
                            display: "flex",
                            gap: "12px",
                            padding: "14px 20px",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          {/* Dot */}
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              marginTop: "5px",
                              flexShrink: 0,
                              background: n.type === "critical" ? "#ef4444" : "#f97316",
                              boxShadow:
                                n.type === "critical"
                                  ? "0 0 8px rgba(239,68,68,0.4)"
                                  : "0 0 8px rgba(249,115,22,0.4)",
                            }}
                          />
                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#1e293b",
                                marginBottom: "3px",
                                lineHeight: 1.4,
                              }}
                            >
                              {n.name}
                            </div>
                            <div
                              style={{
                                fontSize: "12.5px",
                                color: n.type === "critical" ? "#dc2626" : "#ea580c",
                                marginBottom: "4px",
                                lineHeight: 1.4,
                              }}
                            >
                              {n.condition}
                            </div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                              {n.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div
                      style={{
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                        padding: "12px 20px",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#6366f1",
                          cursor: "pointer",
                        }}
                      >
                        ดูทั้งหมด
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="t-divider" />
              <div className="t-time">
                <div className="date">{formattedDate}</div>
                <div className="time">{formattedTime}</div>
              </div>
              <button className="t-icon" onClick={() => window.location.reload()} title="รีเฟรช">
                <RefreshCw size={16} />
              </button>

              {/* ─── Export button ─── */}
              <button
                className="t-icon"
                onClick={() => alert("กำลังส่งออกรายงาน...")}
                title="ส่งออกรายงาน"
              >
                <Download size={16} />
              </button>
            </div>
          </header>

          {/* Page */}
          <main className="page">
            <div className="page-inner">
              <Outlet context={{ role }} />
            </div>
          </main>
        </div>
      </div>

      {/* Keyframe animation for dropdowns */}
      <style>{`
        @keyframes notifSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
