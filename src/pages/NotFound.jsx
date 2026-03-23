import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

/* ── Floating 3D shapes (same style as login page) ── */
const shapes = [
  { w: 80, h: 80, r: 20, bg: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', top: '10%', left: '6%', delay: '0s', dur: '6s', shadow: 'rgba(108,92,231,0.3)' },
  { w: 60, h: 60, r: 16, bg: 'linear-gradient(135deg, #74B9FF, #0984E3)', top: '18%', right: '10%', delay: '1s', dur: '7s', shadow: 'rgba(9,132,227,0.25)' },
  { w: 50, h: 50, r: 14, bg: 'linear-gradient(135deg, #55EFC4, #00B894)', bottom: '22%', left: '10%', delay: '2s', dur: '5.5s', shadow: 'rgba(0,184,148,0.25)' },
  { w: 70, h: 70, r: 50, bg: 'linear-gradient(135deg, #FF7675, #E17055)', bottom: '14%', right: '8%', delay: '0.5s', dur: '6.5s', shadow: 'rgba(225,112,85,0.25)' },
  { w: 45, h: 45, r: 12, bg: 'linear-gradient(135deg, #FDCB6E, #F39C12)', top: '50%', left: '4%', delay: '1.5s', dur: '7.5s', shadow: 'rgba(243,156,18,0.2)' },
];

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', background: '#0D0B1A',
      backgroundImage: `
        radial-gradient(ellipse 100% 80% at 30% 20%, rgba(108,92,231,0.15) 0%, transparent 50%),
        radial-gradient(ellipse 80% 60% at 70% 80%, rgba(9,132,227,0.1) 0%, transparent 45%),
        radial-gradient(ellipse 50% 40% at 50% 50%, rgba(162,155,254,0.05) 0%, transparent 40%)
      `,
      overflow: 'hidden', position: 'relative',
      fontFamily: "'Sarabun','Inter',system-ui,sans-serif",
    }}>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes nf-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-20px) rotate(5deg); }
          50%      { transform: translateY(-10px) rotate(-3deg); }
          75%      { transform: translateY(-25px) rotate(4deg); }
        }
        @keyframes nf-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(1.15); }
        }
        @keyframes nf-fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Ambient orbs ── */}
      {[
        { size: 260, top: '10%', left: '15%', color: 'rgba(108,92,231,0.08)', dur: '8s', delay: '0s' },
        { size: 200, bottom: '15%', right: '12%', color: 'rgba(9,132,227,0.06)', dur: '10s', delay: '2s' },
        { size: 180, top: '55%', left: '60%', color: 'rgba(162,155,254,0.05)', dur: '12s', delay: '1s' },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'absolute', width: orb.size, height: orb.size,
          borderRadius: '50%', background: orb.color, filter: 'blur(60px)',
          top: orb.top, left: orb.left, bottom: orb.bottom, right: orb.right,
          animation: `nf-pulse ${orb.dur} ease-in-out ${orb.delay} infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Floating 3D shapes ── */}
      {shapes.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: s.w, height: s.h, borderRadius: s.r,
          background: s.bg,
          boxShadow: `0 8px 32px ${s.shadow}`,
          top: s.top, left: s.left, right: s.right, bottom: s.bottom,
          animation: `nf-float ${s.dur} ease-in-out ${s.delay} infinite`,
          opacity: 0.7, pointerEvents: 'none',
        }} />
      ))}

      {/* ── Content ── */}
      <div style={{
        position: 'relative', zIndex: 10, textAlign: 'center',
        animation: 'nf-fadeUp 0.8s cubic-bezier(.22,1,.36,1) forwards',
      }}>
        {/* Large 404 */}
        <h1 style={{
          fontSize: 'clamp(100px, 20vw, 200px)',
          fontWeight: 900, lineHeight: 1, margin: 0,
          background: 'linear-gradient(180deg, #FFFFFF 30%, #A29BFE 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-4px',
          textShadow: 'none',
          filter: 'drop-shadow(0 4px 40px rgba(162,155,254,0.3))',
        }}>
          404
        </h1>

        {/* Message */}
        <p style={{
          color: '#E0DFFF', fontSize: 22, fontWeight: 600,
          margin: '16px 0 8px',
        }}>
          ไม่พบหน้าที่คุณต้องการ
        </p>

        {/* Subtitle */}
        <p style={{
          color: 'rgba(255,255,255,0.45)', fontSize: 15,
          margin: '0 0 40px', maxWidth: 360, lineHeight: 1.6,
        }}>
          หน้านี้อาจถูกย้ายหรือลบออกไปแล้ว
        </p>

        {/* Button */}
        <Link to="/dashboard" className="btn-primary" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          textDecoration: 'none', fontSize: 15, fontWeight: 600,
          padding: '12px 28px', borderRadius: 12,
        }}>
          <ArrowLeft size={18} />
          กลับหน้าหลัก
          <Home size={16} />
        </Link>
      </div>
    </div>
  );
}
