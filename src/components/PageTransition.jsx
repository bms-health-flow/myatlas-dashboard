/* ── Page transition wrapper (fadeUp on mount) ── */

const keyframes = `
@keyframes pt-fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

export default function PageTransition({ children, delay = 0 }) {
  return (
    <>
      <style>{keyframes}</style>
      <div style={{
        opacity: 0,
        animation: 'pt-fadeUp 0.5s cubic-bezier(.22,1,.36,1) forwards',
        animationDelay: `${delay}s`,
      }}>
        {children}
      </div>
    </>
  );
}
