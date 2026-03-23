import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, ArrowRight, Shield, Building2,
  HeartPulse, Activity, Stethoscope, Pill,
} from 'lucide-react';

/* ── Floating 3D shapes ── */
const shapes = [
  { w: 80, h: 80, r: 20, bg: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', top: '8%', left: '5%', delay: '0s', dur: '6s', shadow: 'rgba(108,92,231,0.3)' },
  { w: 60, h: 60, r: 16, bg: 'linear-gradient(135deg, #74B9FF, #0984E3)', top: '15%', right: '8%', delay: '1s', dur: '7s', shadow: 'rgba(9,132,227,0.25)' },
  { w: 50, h: 50, r: 14, bg: 'linear-gradient(135deg, #55EFC4, #00B894)', bottom: '20%', left: '8%', delay: '2s', dur: '5.5s', shadow: 'rgba(0,184,148,0.25)' },
  { w: 70, h: 70, r: 50, bg: 'linear-gradient(135deg, #FF7675, #E17055)', bottom: '12%', right: '6%', delay: '0.5s', dur: '6.5s', shadow: 'rgba(225,112,85,0.25)' },
  { w: 45, h: 45, r: 12, bg: 'linear-gradient(135deg, #FDCB6E, #F39C12)', top: '45%', left: '3%', delay: '1.5s', dur: '7.5s', shadow: 'rgba(243,156,18,0.2)' },
  { w: 35, h: 35, r: 10, bg: 'linear-gradient(135deg, #E84393, #FD79A8)', top: '35%', right: '4%', delay: '2.5s', dur: '5s', shadow: 'rgba(232,67,147,0.2)' },
  { w: 55, h: 55, r: 50, bg: 'linear-gradient(135deg, #A29BFE, #6C5CE7)', bottom: '35%', right: '12%', delay: '3s', dur: '8s', shadow: 'rgba(162,155,254,0.25)' },
  { w: 40, h: 40, r: 10, bg: 'linear-gradient(135deg, #00B894, #74B9FF)', top: '60%', left: '12%', delay: '0.8s', dur: '6s', shadow: 'rgba(0,184,148,0.2)' },
];

/* ── Particle dots ── */
const particles = Array.from({ length: 20 }, (_, i) => ({
  size: 2 + Math.random() * 4,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 5,
  dur: 4 + Math.random() * 6,
  opacity: 0.15 + Math.random() * 0.25,
}));

/* ── Feature icons that float around ── */
const floatingIcons = [
  { Icon: HeartPulse, top: '25%', left: '15%', delay: '0s', color: 'rgba(214,48,49,0.12)', size: 32 },
  { Icon: Activity, top: '70%', right: '15%', delay: '1.2s', color: 'rgba(9,132,227,0.1)', size: 28 },
  { Icon: Stethoscope, bottom: '25%', left: '20%', delay: '2.4s', color: 'rgba(108,92,231,0.1)', size: 30 },
  { Icon: Pill, top: '18%', right: '18%', delay: '3s', color: 'rgba(0,184,148,0.1)', size: 26 },
];

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(loginType);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0D0B1A',
      backgroundImage: `
        radial-gradient(ellipse 100% 80% at 30% 20%, rgba(108,92,231,0.15) 0%, transparent 50%),
        radial-gradient(ellipse 80% 60% at 70% 80%, rgba(9,132,227,0.1) 0%, transparent 45%),
        radial-gradient(ellipse 50% 40% at 50% 50%, rgba(162,155,254,0.05) 0%, transparent 40%)
      `,
      overflow: 'hidden', position: 'relative', fontFamily: "'Sarabun','Inter',system-ui,sans-serif",
    }}>

      {/* ── Animated grid background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(108,92,231,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108,92,231,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
        animation: 'gridMove 20s linear infinite',
      }} />

      {/* ── Floating shapes ── */}
      {shapes.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: s.w, height: s.h, borderRadius: s.r,
          background: s.bg,
          boxShadow: `0 12px 40px ${s.shadow}`,
          top: s.top, left: s.left, right: s.right, bottom: s.bottom,
          animation: `loginFloat ${s.dur} ease-in-out infinite`,
          animationDelay: s.delay,
          opacity: 0.6,
          zIndex: 0,
        }} />
      ))}

      {/* ── Particle dots ── */}
      {particles.map((p, i) => (
        <div key={`p-${i}`} style={{
          position: 'absolute',
          width: p.size, height: p.size, borderRadius: '50%',
          background: 'white', opacity: p.opacity,
          left: `${p.x}%`, top: `${p.y}%`,
          animation: `particleDrift ${p.dur}s ease-in-out infinite`,
          animationDelay: `${p.delay}s`,
          zIndex: 0,
        }} />
      ))}

      {/* ── Floating healthcare icons ── */}
      {floatingIcons.map(({ Icon, color, size, delay, ...pos }, i) => (
        <div key={`icon-${i}`} style={{
          position: 'absolute', ...pos,
          animation: `loginFloat 8s ease-in-out infinite`,
          animationDelay: delay,
          zIndex: 0,
        }}>
          <Icon size={size} style={{ color }} />
        </div>
      ))}

      {/* ── Large ambient orbs ── */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,92,231,0.12) 0%, transparent 65%)',
        filter: 'blur(60px)',
        animation: 'orbit1 18s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(9,132,227,0.1) 0%, transparent 65%)',
        filter: 'blur(50px)',
        animation: 'orbit2 22s ease-in-out infinite',
      }} />

      {/* ═══════════════════════════════════════════
          LOGIN CARD
          ═══════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: 440, maxWidth: '90vw',
        animation: 'loginCardIn 0.8s cubic-bezier(.22,1,.36,1) both',
      }}>
        {/* Glow behind card */}
        <div style={{
          position: 'absolute', inset: -40,
          borderRadius: 40,
          background: 'radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: -1,
        }} />

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderRadius: 32,
          border: '1.5px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 96px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
          padding: '48px 40px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Shine line on top */}
          <div style={{
            position: 'absolute', top: 0, left: 40, right: 40, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }} />

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #8B7CF8, #6C5CE7, #5A4BD1)',
              boxShadow: '0 12px 36px rgba(108,92,231,0.5), 0 4px 8px rgba(108,92,231,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 28, fontWeight: 900, fontFamily: "'Inter',sans-serif",
              position: 'relative',
            }}>
              A
              {/* Glow ring */}
              <div style={{
                position: 'absolute', inset: -5, borderRadius: 24,
                background: 'linear-gradient(135deg, #A29BFE, #74B9FF)',
                opacity: 0.2, zIndex: -1, filter: 'blur(10px)',
                animation: 'pulse 3s ease-in-out infinite',
              }} />
            </div>
            <h1 style={{
              fontSize: 30, fontWeight: 900, letterSpacing: -0.5,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #A29BFE 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', fontFamily: "'Inter',sans-serif",
            }}>
              Atlas Dashboard
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 6, letterSpacing: 0.3 }}>
              ระบบติดตามสุขภาพผู้ป่วยอัจฉริยะ
            </p>
          </div>

          {/* Role selector */}
          <div style={{
            display: 'flex', gap: 3, padding: 4, borderRadius: 16,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 28,
          }}>
            {[
              { key: 'admin', icon: Shield, label: 'Admin', sub: 'ระดับประเทศ' },
              { key: 'hospital', icon: Building2, label: 'Hospital', sub: 'ระดับจังหวัด' },
            ].map(({ key, icon: Icon, label, sub }) => (
              <button key={key} onClick={() => setLoginType(key)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '14px 16px', borderRadius: 12,
                border: 'none', cursor: 'pointer', fontFamily: "'Inter','Sarabun',sans-serif",
                transition: 'all 0.3s ease',
                background: loginType === key
                  ? 'linear-gradient(135deg, rgba(108,92,231,0.3), rgba(139,124,248,0.2))'
                  : 'transparent',
                color: loginType === key ? 'white' : 'rgba(255,255,255,0.35)',
                boxShadow: loginType === key
                  ? '0 4px 20px rgba(108,92,231,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
                  : 'none',
                borderWidth: 1, borderStyle: 'solid',
                borderColor: loginType === key ? 'rgba(162,155,254,0.15)' : 'transparent',
              }}>
                <Icon size={18} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
                  <div style={{ fontSize: 10, opacity: 0.6 }}>{sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 1.5,
                color: 'rgba(255,255,255,0.3)', marginBottom: 8,
              }}>
                ชื่อผู้ใช้งาน
              </label>
              <input
                type="text"
                placeholder="กรอกชื่อผู้ใช้งาน..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%', height: 52, padding: '0 18px',
                  borderRadius: 14, fontSize: 14,
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'white', outline: 'none',
                  fontFamily: "'Sarabun','Inter',sans-serif",
                  transition: 'all 0.25s ease',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(162,155,254,0.4)'; e.target.style.boxShadow = '0 0 0 4px rgba(108,92,231,0.1)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 1.5,
                color: 'rgba(255,255,255,0.3)', marginBottom: 8,
              }}>
                รหัสผ่าน
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="กรอกรหัสผ่าน..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%', height: 52, padding: '0 50px 0 18px',
                    borderRadius: 14, fontSize: 14,
                    border: '1.5px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'white', outline: 'none',
                    fontFamily: "'Sarabun','Inter',sans-serif",
                    transition: 'all 0.25s ease',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(162,155,254,0.4)'; e.target.style.boxShadow = '0 0 0 4px rgba(108,92,231,0.1)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                  color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" style={{
                  width: 18, height: 18, borderRadius: 6, cursor: 'pointer',
                  accentColor: '#6C5CE7',
                }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>จดจำการเข้าสู่ระบบ</span>
              </label>
              <a href="#" style={{ fontSize: 13, color: '#A29BFE', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = '#A29BFE'}
              >
                ลืมรหัสผ่าน?
              </a>
            </div>

            {/* Submit button */}
            <button type="submit" disabled={loading} style={{
              width: '100%', height: 54, borderRadius: 16,
              border: 'none', cursor: loading ? 'wait' : 'pointer',
              fontSize: 16, fontWeight: 700,
              fontFamily: "'Sarabun','Inter',sans-serif",
              color: 'white',
              background: loading
                ? 'linear-gradient(135deg, rgba(108,92,231,0.5), rgba(162,155,254,0.4))'
                : 'linear-gradient(135deg, #6C5CE7 0%, #8573F0 50%, #A29BFE 100%)',
              boxShadow: loading
                ? 'none'
                : '0 10px 36px rgba(108,92,231,0.4), 0 4px 10px rgba(108,92,231,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.3s cubic-bezier(.22,1,.36,1)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Shimmer on button */}
              {!loading && <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 4s ease-in-out infinite',
              }} />}
              {loading ? (
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.2)',
                  borderTopColor: 'white',
                  animation: 'spin 0.8s linear infinite',
                }} />
              ) : (
                <>เข้าสู่ระบบ <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 28 }}>
            Atlas Healthcare Dashboard v2.0 — Powered by <span style={{ color: '#A29BFE' }}>AI</span>
          </p>
        </div>
      </div>

      {/* ── Animations ── */}
      <style>{`
        @keyframes loginFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(3deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
          75% { transform: translateY(-25px) rotate(1deg); }
        }
        @keyframes particleDrift {
          0%, 100% { transform: translate(0, 0); opacity: var(--o, 0.2); }
          25% { transform: translate(15px, -20px); opacity: 0.05; }
          50% { transform: translate(-10px, -30px); opacity: var(--o, 0.3); }
          75% { transform: translate(20px, -10px); opacity: 0.1; }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes loginCardIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.35; }
        }
        @keyframes orbit1 {
          0%,100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(50px,-30px) scale(1.1); }
          50% { transform: translate(20px,20px) scale(0.9); }
          75% { transform: translate(-20px,-10px) scale(1.05); }
        }
        @keyframes orbit2 {
          0%,100% { transform: translate(0,0) scale(1); }
          30% { transform: translate(-40px,25px) scale(1.1); }
          60% { transform: translate(15px,-30px) scale(0.95); }
        }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </div>
  );
}
