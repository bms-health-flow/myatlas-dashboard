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
      {/* ─── Sidebar (Figma: dark purple gradient) ─── */}
      <aside style={{
        width: 200, flexShrink: 0, padding: 16, zIndex: 30,
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', height: '100%',
          background: 'linear-gradient(180deg, #4438AD 0%, #1C1747 100%)',
          borderRadius: 24,
          padding: '0',
          overflow: 'hidden',
          boxShadow: '0 4px 4px rgba(0,0,0,0.1)',
          position: 'relative',
        }}>
          {/* Overlay blur tint */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(68,56,173,0.5), rgba(28,23,71,0.5))', backdropFilter: 'blur(40px)', borderRadius: 24, pointerEvents: 'none' }} />

          {/* Logo */}
          <div style={{ display: 'flex', gap: 16, padding: 16, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16, background: 'white',
              boxShadow: '0 0 24px 4px rgba(143,134,251,0.35)',
              flexShrink: 0,
            }} />
            <div style={{ color: 'white' }}>
              <p style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>ATLAS</p>
              <p style={{ fontSize: 14, fontWeight: 400, fontFamily: 'Inter, sans-serif', letterSpacing: 2.24, opacity: 0.8 }}>Dashboad</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '0 16px', position: 'relative', zIndex: 1 }} />

          {/* Nav */}
          <div style={{ flex: 1, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 10, color: 'white', opacity: 0.5, marginTop: 8, marginBottom: 4 }}>Menu</p>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 8px',
                    borderRadius: isActive ? 100 : 8,
                    background: isActive ? 'white' : 'transparent',
                    color: isActive ? '#4438AD' : 'white',
                    fontSize: 14,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    border: isActive ? '1px solid rgba(255,255,255,0.6)' : '1px solid transparent',
                    boxShadow: isActive ? '0 4px 4px rgba(0,0,0,0.1)' : 'none',
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {({ isActive }) => null}
                    <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                      <item.icon size={14} />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {location.pathname === item.to && (
                    <div style={{ width: 16, height: 16, borderRadius: 8, background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight size={10} />
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User section */}
          <div style={{ padding: 12, position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              padding: 16, borderRadius: 16,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative circles */}
              <div style={{ position: 'absolute', top: -21, left: -21, width: 74, height: 74, borderRadius: '50%', background: 'radial-gradient(circle, rgba(143,134,251,0.3), transparent)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 55, left: 69, width: 74, height: 74, borderRadius: '50%', background: 'radial-gradient(circle, rgba(143,134,251,0.2), transparent)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #0984E3, #6C5CE7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, position: 'relative' }}>
                  ส
                  <div style={{ position: 'absolute', bottom: 2, right: 2, width: 7, height: 7, borderRadius: '50%', background: '#34C759' }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'white' }}>สมชาย ใจดี</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>{role === "admin" ? "ผู้ดูแลระบบ" : "เจ้าหน้าที่ รพ."}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="ออกจากระบบ"
                style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', position: 'relative', zIndex: 1,
                }}
              >
                <LogOut size={12} />
              </button>
            </div>
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
