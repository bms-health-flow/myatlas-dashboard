import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  Users, Home, HeartPulse, AlertTriangle, Building2, TrendingUp,
  Activity, ChevronRight, Bell, Zap, Eye, BarChart3, Stethoscope,
  MapPin, Map, Flame, Trophy, Filter, Hospital,
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import HeatLayer from '../components/HeatLayer';
import {
  DASHBOARD_STATS, USAGE_CHART_DATA, HOSPITAL_COMPARISON,
  DISEASE_GROUPS, CRITICAL_CASES, CGM_PATIENTS, CGM_GLUCOSE_TREND, FEATURE_USAGE,
  REGIONS, PROVINCES_DATA,
  HOSPITAL_INFO, HOSPITAL_STATS, HOSPITAL_USAGE_CHART,
  HOSPITAL_DISEASE_GROUPS, HOSPITAL_CRITICAL_CASES, HOSPITAL_PATIENTS_MAP,
} from '../data/mockData';

const ad = (i) => ({ animationDelay: `${i * 80}ms` });

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', border: '1.5px solid rgba(255,255,255,0.9)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#B2BEC3', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

const stats = [
  { icon: Users, label: 'จำนวนผู้ป่วย', value: DASHBOARD_STATS.totalPatients, growth: DASHBOARD_STATS.growthPatients, bg: 'linear-gradient(135deg, #00B894, #55EFC4)', iconBg: 'rgba(0,184,148,0.15)', iconColor: '#00B894' },
  { icon: Home, label: 'เคสส่งเยี่ยม', value: DASHBOARD_STATS.totalVisits, growth: DASHBOARD_STATS.growthVisits, bg: 'linear-gradient(135deg, #00B894, #55EFC4)', iconBg: 'rgba(0,184,148,0.15)', iconColor: '#00B894' },
  { icon: HeartPulse, label: 'Vital Signs', value: DASHBOARD_STATS.totalVitalSigns, growth: DASHBOARD_STATS.growthVitalSigns, bg: 'linear-gradient(135deg, #00B894, #55EFC4)', iconBg: 'rgba(0,184,148,0.15)', iconColor: '#00B894' },
  { icon: AlertTriangle, label: 'VS ผิดปกติ', value: DASHBOARD_STATS.abnormalVitalSigns, growth: DASHBOARD_STATS.growthAbnormal, bg: 'linear-gradient(135deg, #E17055, #FAB1A0)', iconBg: 'rgba(225,112,85,0.15)', iconColor: '#E17055' },
  { icon: Building2, label: 'รพ. ใช้งาน', value: `${DASHBOARD_STATS.hospitalsActive}/${DASHBOARD_STATS.totalHospitals}`, growth: 9.2, bg: 'linear-gradient(135deg, #00B894, #55EFC4)', iconBg: 'rgba(0,184,148,0.15)', iconColor: '#00B894' },
];

/* ═══ THAILAND MAP SECTION ═══ */
function ThailandMapSection({ delay }) {
  const [regionFilter, setRegionFilter] = useState('all');
  const [mapMode, setMapMode] = useState('markers'); // markers | heat
  const [heatType, setHeatType] = useState('visit'); // visit | vitalsign | cgm

  const filteredProvinces = useMemo(() => {
    if (regionFilter === 'all') return PROVINCES_DATA;
    return PROVINCES_DATA.filter(p => p.region === regionFilter);
  }, [regionFilter]);

  const getMarkerColor = (p) => {
    const total = p.visited + p.notVisited + p.pending;
    if (p.notVisited / total > 0.3) return '#D63031';
    if (p.pending / total > 0.2) return '#FDCB6E';
    return '#00B894';
  };

  const getMarkerSize = (p) => {
    const total = p.visited + p.notVisited + p.pending;
    return Math.max(8, Math.min(22, total / 8));
  };

  const heatPoints = useMemo(() => {
    return filteredProvinces.map(p => {
      const intensity = heatType === 'visit' ? (p.visited + p.notVisited + p.pending)
        : heatType === 'vitalsign' ? p.vitalsign
        : p.cgm / 50;
      return [p.lat, p.lng, Math.min(intensity / 200, 1)];
    });
  }, [filteredProvinces, heatType]);

  const top10 = useMemo(() => {
    const key = heatType === 'visit' ? (p) => p.visited + p.notVisited + p.pending
      : heatType === 'vitalsign' ? (p) => p.vitalsign
      : (p) => p.cgm;
    return [...PROVINCES_DATA].sort((a, b) => key(b) - key(a)).slice(0, 10);
  }, [heatType]);

  const statusColors = [
    { color: '#00B894', label: 'เยี่ยมแล้ว' },
    { color: '#D63031', label: 'ยังไม่เยี่ยม' },
    { color: '#FDCB6E', label: 'รอรับงาน' },
  ];

  return (
    <div className="gc anim-up" style={delay(8)}>
      <div className="gc-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="gc-icon" style={{ background: 'rgba(108,92,231,0.08)' }}><MapPin size={20} style={{ color: '#6C5CE7' }} /></div>
          <div className="gc-title"><h3>แผนที่ผู้ป่วย</h3><p>แสดงตำแหน่งและสถานะผู้ป่วยทั่วประเทศ</p></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Map mode toggle */}
          <div className="seg">
            <button className={`seg-btn ${mapMode === 'markers' ? 'active' : ''}`} onClick={() => setMapMode('markers')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} /> ตำแหน่ง
            </button>
            <button className={`seg-btn ${mapMode === 'heat' ? 'active' : ''}`} onClick={() => setMapMode('heat')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Flame size={12} /> Heatmap
            </button>
          </div>
        </div>
      </div>

      <div className="gc-body" style={{ padding: 0 }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid rgba(108,92,231,0.04)', flexWrap: 'wrap', gap: 12 }}>
          {/* Region filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={14} style={{ color: '#B2BEC3' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#636E72', marginRight: 4 }}>ภูมิภาค:</span>
            <div className="seg">
              <button className={`seg-btn ${regionFilter === 'all' ? 'active' : ''}`} onClick={() => setRegionFilter('all')}>ทั้งหมด</button>
              {REGIONS.map(r => (
                <button key={r.id} className={`seg-btn ${regionFilter === r.id ? 'active' : ''}`} onClick={() => setRegionFilter(r.id)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="dot" style={{ background: r.color }} />{r.name.replace('ภาค', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Heatmap type (shown only in heat mode) */}
          {mapMode === 'heat' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#636E72' }}>ข้อมูล:</span>
              <div className="seg">
                <button className={`seg-btn ${heatType === 'visit' ? 'active' : ''}`} onClick={() => setHeatType('visit')}>เยี่ยมบ้าน</button>
                <button className={`seg-btn ${heatType === 'vitalsign' ? 'active' : ''}`} onClick={() => setHeatType('vitalsign')}>Vital Signs</button>
                <button className={`seg-btn ${heatType === 'cgm' ? 'active' : ''}`} onClick={() => setHeatType('cgm')}>CGM</button>
              </div>
            </div>
          )}

          {/* Status legend (markers mode) */}
          {mapMode === 'markers' && (
            <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
              {statusColors.map(s => (
                <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#636E72' }}>
                  <span className="dot" style={{ background: s.color }} />{s.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Map + Side panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px' }}>
          {/* Map */}
          <div style={{ height: 500 }}>
            <MapContainer
              center={[13.0, 101.0]}
              zoom={6}
              scrollWheelZoom
              style={{ height: '100%', width: '100%', borderRadius: '0 0 0 28px' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OSM &amp; CartoDB"
              />

              {/* Markers mode */}
              {mapMode === 'markers' && filteredProvinces.map(p => {
                const total = p.visited + p.notVisited + p.pending;
                return (
                  <CircleMarker
                    key={p.name}
                    center={[p.lat, p.lng]}
                    radius={getMarkerSize(p)}
                    pathOptions={{
                      color: '#fff',
                      fillColor: getMarkerColor(p),
                      fillOpacity: 0.85,
                      weight: 2.5,
                    }}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'Sarabun, Inter, sans-serif', padding: 4, minWidth: 160 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#2D3436', marginBottom: 8 }}>{p.name}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {[
                            { label: 'เยี่ยมแล้ว', val: p.visited, color: '#00B894' },
                            { label: 'ยังไม่เยี่ยม', val: p.notVisited, color: '#D63031' },
                            { label: 'รอรับงาน', val: p.pending, color: '#FDCB6E' },
                          ].map(s => (
                            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#636E72' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />{s.label}
                              </span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#2D3436' }}>{s.val}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11, color: '#B2BEC3' }}>รวม</span>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#6C5CE7' }}>{total} เคส</span>
                        </div>
                        <div style={{ marginTop: 6, display: 'flex', gap: 12, fontSize: 11 }}>
                          <span style={{ color: '#636E72' }}>VS: <strong style={{ color: '#0984E3' }}>{p.vitalsign}</strong></span>
                          <span style={{ color: '#636E72' }}>CGM: <strong style={{ color: '#D97706' }}>{p.cgm.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {/* Heatmap mode */}
              {mapMode === 'heat' && <HeatLayer points={heatPoints} />}
            </MapContainer>
          </div>

          {/* Side: Top 10 */}
          <div style={{ padding: 24, borderLeft: '1px solid rgba(108,92,231,0.04)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div className="gc-icon" style={{ background: 'rgba(253,203,110,0.15)', width: 36, height: 36 }}><Trophy size={16} style={{ color: '#D97706' }} /></div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#2D3436' }}>10 อันดับ รพ. ใช้งาน</h4>
                <p style={{ fontSize: 11, color: '#B2BEC3' }}>
                  {heatType === 'visit' ? 'เยี่ยมบ้าน' : heatType === 'vitalsign' ? 'Vital Signs' : 'CGM'}
                </p>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {top10.map((p, i) => {
                const val = heatType === 'visit' ? p.visited + p.notVisited + p.pending
                  : heatType === 'vitalsign' ? p.vitalsign : p.cgm;
                const maxVal = heatType === 'visit' ? top10[0].visited + top10[0].notVisited + top10[0].pending
                  : heatType === 'vitalsign' ? top10[0].vitalsign : top10[0].cgm;
                const barColor = i === 0 ? '#6C5CE7' : i === 1 ? '#A29BFE' : i === 2 ? '#74B9FF' : 'rgba(108,92,231,0.15)';

                return (
                  <div key={p.name} style={{ padding: '10px 12px', borderRadius: 14, background: i < 3 ? 'rgba(108,92,231,0.04)' : 'transparent', transition: 'background 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="num" style={{
                          fontSize: 11, fontWeight: 800,
                          color: i < 3 ? '#6C5CE7' : '#B2BEC3',
                          width: 20, textAlign: 'center',
                        }}>{i + 1}</span>
                        <span className="truncate" style={{ fontSize: 12, fontWeight: 600, color: '#2D3436', maxWidth: 150 }}>{p.name}</span>
                      </div>
                      <span className="num" style={{ fontSize: 12, fontWeight: 700, color: i < 3 ? '#6C5CE7' : '#636E72' }}>{val.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: 'rgba(108,92,231,0.06)', overflow: 'hidden', marginLeft: 28 }}>
                      <div style={{ height: '100%', borderRadius: 99, background: barColor, width: `${(val / maxVal) * 100}%`, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status summary */}
            <div style={{ marginTop: 16, padding: '16px 0 0', borderTop: '1px solid rgba(108,92,231,0.06)', display: 'flex', gap: 8 }}>
              {[
                { label: 'ทั้งหมด', val: PROVINCES_DATA.reduce((s, p) => s + p.visited + p.notVisited + p.pending, 0), bg: '#E8E5FF', color: '#6C5CE7' },
                { label: 'เยี่ยมแล้ว', val: PROVINCES_DATA.reduce((s, p) => s + p.visited, 0), bg: '#E0FFF8', color: '#00B894' },
                { label: 'ยังไม่เยี่ยม', val: PROVINCES_DATA.reduce((s, p) => s + p.notVisited, 0), bg: '#FFE8E8', color: '#D63031' },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: s.bg, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: s.color, opacity: 0.7 }}>{s.label}</p>
                  <p className="num" style={{ fontSize: 16, fontWeight: 800, color: s.color, marginTop: 2 }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { role } = useOutletContext();
  const isHospital = role === 'hospital';

  const [chartPeriod, setChartPeriod] = useState('monthly');
  const [caseFilter, setCaseFilter] = useState('ทั้งหมด');

  // Pick data based on role
  const currentStats = isHospital ? [
    { icon: Users, label: 'ผู้ป่วยในเขต', value: HOSPITAL_STATS.totalPatients, growth: HOSPITAL_STATS.growthPatients, bg: 'linear-gradient(135deg, #6C5CE7, #A29BFE)' },
    { icon: Home, label: 'เคสส่งเยี่ยม', value: HOSPITAL_STATS.totalVisits, growth: HOSPITAL_STATS.growthVisits, bg: 'linear-gradient(135deg, #00B894, #55EFC4)' },
    { icon: HeartPulse, label: 'Vital Signs', value: HOSPITAL_STATS.totalVitalSigns, growth: HOSPITAL_STATS.growthVitalSigns, bg: 'linear-gradient(135deg, #E17055, #FAB1A0)' },
    { icon: AlertTriangle, label: 'VS ผิดปกติ', value: HOSPITAL_STATS.abnormalVitalSigns, growth: HOSPITAL_STATS.growthAbnormal, bg: 'linear-gradient(135deg, #D63031, #FF7675)' },
  ] : stats;

  const chartData = isHospital
    ? (HOSPITAL_USAGE_CHART[chartPeriod] || HOSPITAL_USAGE_CHART.monthly)
    : (USAGE_CHART_DATA[chartPeriod] || USAGE_CHART_DATA.monthly);

  const diseaseData = isHospital ? HOSPITAL_DISEASE_GROUPS : DISEASE_GROUPS;
  const criticalData = isHospital ? HOSPITAL_CRITICAL_CASES : CRITICAL_CASES;

  const avgGlucose = Math.round(CGM_PATIENTS.reduce((s, p) => s + p.avg, 0) / CGM_PATIENTS.length);
  const totalReadings = CGM_PATIENTS.reduce((s, p) => s + p.readings, 0);
  const hospMax = Math.max(...HOSPITAL_COMPARISON.map(h => h.visited + h.notVisited + h.pending));
  const diseaseTotal = diseaseData.reduce((s, d) => s + d.count, 0);

  const getMarkerColorLocal = (s) => s === 'visited' ? '#00B894' : s === 'pending' ? '#FDCB6E' : '#D63031';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ═══ HERO ═══ */}
      <div className="anim-up" style={{ ...ad(0), borderRadius: 'var(--r-l)', padding: '24px 28px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        {/* Background grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: 100, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div>
            {isHospital ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.15)', fontSize: 12, fontWeight: 600 }}>
                    <Hospital size={14} /> {HOSPITAL_INFO.name}
                  </div>
                  <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.1)' }}>จ.{HOSPITAL_INFO.province}</span>
                </div>
                <p style={{ fontSize: 14, opacity: 0.8 }}>ยินดีต้อนรับสู่</p>
                <h2 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, marginTop: 4, color: 'white', WebkitTextFillColor: 'white', backgroundImage: 'none' }}>Atlas Dashboard</h2>
                <p style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>ข้อมูลผู้ป่วยและการให้บริการ ระดับจังหวัด{HOSPITAL_INFO.province}</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 14, opacity: 0.8 }}>ยินดีต้อนรับสู่</p>
                <h2 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.2, marginTop: 4, color: 'white', WebkitTextFillColor: 'white', backgroundImage: 'none' }}>
                  Atlas <span style={{ color: '#55EFC4' }}>Dashboard</span>
                </h2>
                <p style={{ fontSize: 13, opacity: 0.7, marginTop: 8, maxWidth: 360 }}>ระบบติดตามและ Monitor ข้อมูลผู้ป่วยแบบ Real-time</p>
              </>
            )}
          </div>

          {/* Right side: illustration placeholder */}
          <div style={{ position: 'relative', width: 200, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* 3D-ish illustration blocks */}
            <div className="anim-float" style={{ position: 'absolute', width: 70, height: 70, borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))', backdropFilter: 'blur(10px)', top: 5, left: 10, animationDuration: '4s' }} />
            <div className="anim-float" style={{ position: 'absolute', width: 55, height: 55, borderRadius: 14, background: 'linear-gradient(135deg, rgba(85,239,196,0.3), rgba(0,184,148,0.15))', top: 30, left: 80, animationDelay: '1s', animationDuration: '3.5s' }} />
            <div className="anim-float" style={{ position: 'absolute', width: 45, height: 45, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(253,203,110,0.3), rgba(243,156,18,0.15))', top: 0, left: 140, animationDelay: '0.5s', animationDuration: '4.5s' }} />
            <div className="anim-float" style={{ position: 'absolute', width: 35, height: 35, borderRadius: 10, background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))', top: 65, left: 140, animationDelay: '1.5s', animationDuration: '3s' }} />
          </div>
        </div>
      </div>

      {/* ═══ STAT CARDS (Figma style: white card, icon circle, trend badge) ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentStats.length}, 1fr)`, gap: 16 }}>
        {currentStats.map((s, i) => (
          <div key={s.label} className="gc anim-up" style={{ ...ad(i + 1), padding: '20px 16px', overflow: 'hidden', position: 'relative' }}>
            {/* Top row: icon + trend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
              }}>
                <s.icon size={18} style={{ color: 'white' }} />
              </div>
              {s.growth && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  padding: '4px 10px', borderRadius: 99,
                  background: s.iconBg || 'rgba(0,184,148,0.1)',
                  fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                  color: s.iconColor || '#00B894',
                }}>
                  <TrendingUp size={11} /> +{s.growth}%
                </div>
              )}
            </div>
            {/* Label */}
            <p style={{ fontSize: 12, fontWeight: 500, color: '#636E72', marginBottom: 4 }}>{s.label}</p>
            {/* Value */}
            <p className="num" style={{ fontSize: 28, fontWeight: 900, color: '#2D3436', lineHeight: 1 }}>
              {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ═══ CHARTS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: isHospital ? '1fr 1fr' : '3fr 2fr', gap: 22 }}>
        {/* Line Chart */}
        <div className="gc anim-up" style={ad(6)}>
          <div className="gc-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="gc-icon" style={{ background: 'rgba(108,92,231,0.08)' }}><Activity size={20} style={{ color: '#6C5CE7' }} /></div>
                <div className="gc-title"><h3>ภาพรวมการใช้งาน</h3><p>Vital Signs & เยี่ยมบ้าน</p></div>
              </div>
              <div className="seg">
                {[{ k: 'daily', l: 'วัน' }, { k: 'weekly', l: 'สัปดาห์' }, { k: 'monthly', l: 'เดือน' }].map(t => (
                  <button key={t.k} onClick={() => setChartPeriod(t.k)} className={`seg-btn ${chartPeriod === t.k ? 'active' : ''}`}>{t.l}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, marginBottom: 20, fontSize: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#636E72' }}><span className="dot" style={{ background: '#D63031' }} /> Vital Signs</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#636E72' }}><span className="dot" style={{ background: '#00B894' }} /> เยี่ยมบ้าน</span>
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,92,231,0.06)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#B2BEC3' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#B2BEC3' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Line type="monotone" dataKey="vitalsign" name="Vital Signs" stroke="#D63031" strokeWidth={3} dot={{ r: 5, fill: '#D63031', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, fill: '#D63031', stroke: '#fff', strokeWidth: 3 }} />
                  <Line type="monotone" dataKey="visit" name="เยี่ยมบ้าน" stroke="#00B894" strokeWidth={3} dot={{ r: 5, fill: '#00B894', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, fill: '#00B894', stroke: '#fff', strokeWidth: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hospital Comparison (Admin) / Province Map (Hospital) */}
        {isHospital ? (
          /* ── HOSPITAL: Province-level map ── */
          <div className="gc anim-up" style={{ ...ad(7), overflow: 'hidden' }}>
            <div className="gc-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="gc-icon" style={{ background: 'rgba(108,92,231,0.08)' }}><MapPin size={20} style={{ color: '#6C5CE7' }} /></div>
                <div className="gc-title"><h3>แผนที่ผู้ป่วย จ.{HOSPITAL_INFO.province}</h3><p>ตำแหน่งและสถานะผู้ป่วยในพื้นที่</p></div>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                {[{ c: '#00B894', l: 'เยี่ยมแล้ว' }, { c: '#D63031', l: 'ยังไม่เยี่ยม' }, { c: '#FDCB6E', l: 'รอรับงาน' }].map(x => (
                  <span key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#636E72' }}><span className="dot" style={{ background: x.c }} />{x.l}</span>
                ))}
              </div>
            </div>
            <div style={{ height: 340 }}>
              <MapContainer center={[HOSPITAL_INFO.lat, HOSPITAL_INFO.lng]} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%', borderRadius: '0 0 28px 28px' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OSM" />
                {HOSPITAL_PATIENTS_MAP.map((p, i) => (
                  <CircleMarker key={i} center={[p.lat, p.lng]} radius={10}
                    pathOptions={{ color: '#fff', fillColor: getMarkerColorLocal(p.status), fillOpacity: 0.85, weight: 2.5 }}>
                    <Popup>
                      <div style={{ fontFamily: 'Sarabun, Inter, sans-serif', padding: 4 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#2D3436' }}>{p.name}</p>
                        <p style={{ fontSize: 12, color: '#636E72', marginTop: 4 }}>{p.disease}</p>
                        <span className={`badge ${p.status === 'visited' ? 'b-green' : p.status === 'pending' ? 'b-orange' : 'b-red'}`} style={{ marginTop: 6 }}>
                          {p.status === 'visited' ? 'เยี่ยมแล้ว' : p.status === 'pending' ? 'รอรับงาน' : 'ยังไม่เยี่ยม'}
                        </span>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        ) : (
          /* ── ADMIN: Hospital comparison bars ── */
          <div className="gc anim-up" style={ad(7)}>
            <div className="gc-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div className="gc-icon" style={{ background: 'rgba(9,132,227,0.08)' }}><BarChart3 size={20} style={{ color: '#0984E3' }} /></div>
                <div className="gc-title"><h3>เปรียบเทียบ รพ.</h3><p>สถานะการเยี่ยมบ้าน</p></div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 20, fontSize: 11 }}>
                {[{ c: '#00B894', l: 'เยี่ยมแล้ว' }, { c: '#D63031', l: 'ยังไม่เยี่ยม' }, { c: '#FDCB6E', l: 'รอรับงาน' }].map(x => (
                  <span key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#636E72' }}><span className="dot" style={{ background: x.c }} />{x.l}</span>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {HOSPITAL_COMPARISON.map((h, i) => {
                  const total = h.visited + h.notVisited + h.pending;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span className="truncate" style={{ fontSize: 12, fontWeight: 600, color: '#2D3436', maxWidth: 170 }}>{h.short}</span>
                        <span className="num" style={{ fontSize: 11, fontWeight: 700, color: '#B2BEC3' }}>{total}</span>
                      </div>
                      <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', background: 'rgba(108,92,231,0.04)' }}>
                        <div style={{ width: `${(h.visited / hospMax) * 100}%`, background: 'linear-gradient(90deg, #00B894, #55EFC4)', borderRadius: '99px 0 0 99px', transition: 'width 0.6s ease' }} />
                        <div style={{ width: `${(h.notVisited / hospMax) * 100}%`, background: 'linear-gradient(90deg, #D63031, #FF7675)', transition: 'width 0.6s ease' }} />
                        <div style={{ width: `${(h.pending / hospMax) * 100}%`, background: 'linear-gradient(90deg, #FDCB6E, #F39C12)', transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ THAILAND MAP (Admin only) ═══ */}
      {!isHospital && <ThailandMapSection delay={ad} />}

      {/* ═══ DISEASE + CRITICAL ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <div className="gc anim-up" style={ad(8)}>
          <div className="gc-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div className="gc-icon" style={{ background: 'rgba(232,67,147,0.08)' }}><Stethoscope size={20} style={{ color: '#E84393' }} /></div>
              <div className="gc-title"><h3>สัดส่วนกลุ่มโรค</h3><p>การเยี่ยมบ้านตามกลุ่มโรค</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={diseaseData} cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3} dataKey="count" strokeWidth={0} cornerRadius={5}>
                    {diseaseData.map((dd, i) => <Cell key={i} fill={dd.color} />)}
                  </Pie><Tooltip formatter={(v, n) => [`${v} ราย`, n]} contentStyle={{ borderRadius: 14, fontSize: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }} /></PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span className="num" style={{ fontSize: 28, fontWeight: 900, color: '#2D3436' }}>{diseaseTotal}</span>
                  <span style={{ fontSize: 10, color: '#B2BEC3', fontWeight: 500 }}>ทั้งหมด</span>
                </div>
              </div>
              <div style={{ flex: 1, maxHeight: 210, overflowY: 'auto' }}>
                {diseaseData.map((dd, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px', borderRadius: 10, transition: 'background 0.15s', cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <span className="dot" style={{ background: dd.color, width: 10, height: 10 }} />
                      <span className="truncate" style={{ fontSize: 13, color: '#636E72' }}>{dd.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span className="num" style={{ fontSize: 13, fontWeight: 700, color: '#2D3436' }}>{dd.count}</span>
                      <span style={{ fontSize: 11, color: '#B2BEC3' }}>({dd.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="gc anim-up" style={{ ...ad(9), display: 'flex', flexDirection: 'column' }}>
          <div className="gc-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="gc-icon" style={{ background: 'rgba(214,48,49,0.06)' }}><Bell size={20} style={{ color: '#D63031' }} /></div>
                <div className="gc-title"><h3>เคสที่ต้องดูแล</h3><p>แจ้งเตือนค่าผิดปกติ</p></div>
              </div>
              <button style={{ fontSize: 12, fontWeight: 700, color: '#6C5CE7', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>ดูทั้งหมด <ChevronRight size={14} /></button>
            </div>
            <div className="seg" style={{ marginBottom: 20 }}>
              {['ทั้งหมด', 'ค่าผิดปกติ', 'ยังไม่เยี่ยม'].map(f => (
                <button key={f} onClick={() => setCaseFilter(f)} className={`seg-btn ${caseFilter === f ? 'active' : ''}`}>{f}</button>
              ))}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
              {criticalData.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 14, padding: 16, borderRadius: 18, border: '1px solid rgba(214,48,49,0.05)', background: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #FFE8E8, #FECACA)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <HeartPulse size={20} style={{ color: '#D63031' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="truncate" style={{ fontSize: 14, fontWeight: 600, color: '#2D3436' }}>{c.name}</span>
                      <span className="badge b-red" style={{ fontSize: 10 }}>{c.severity === 'critical' ? 'วิกฤต' : 'เฝ้าระวัง'}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#636E72', marginTop: 4 }}>{c.condition}</p>
                    <p style={{ fontSize: 11, color: '#B2BEC3', marginTop: 3 }}>{c.hospital} · {c.time}ที่แล้ว</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CGM PATIENT MONITOR ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 22 }}>
        {/* LEFT: Gauge card */}
        <div className="gc anim-up" style={ad(10)}>
          <div className="gc-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 32px 32px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#B2BEC3', letterSpacing: 0.3 }}>Statistics</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#2D3436', marginTop: 6, marginBottom: 32 }}>ค่าน้ำตาลเฉลี่ย CGM</p>

            {/* ── Semicircle gauge ── */}
            {(() => {
              const pct = Math.max(0, Math.min(1, (avgGlucose - 40) / (220 - 40)));
              const angle = 180 - pct * 180;
              const rad = (angle * Math.PI) / 180;
              const cx = 120, cy = 115, R = 90;
              const nx = cx + R * Math.cos(rad);
              const ny = cy - R * Math.sin(rad);
              const valColor = avgGlucose < 70 ? '#D63031' : avgGlucose > 180 ? '#E17055' : '#00B894';
              return (
              <div style={{ position: 'relative', width: 280, height: 170, marginBottom: 8 }}>
                <svg viewBox="0 0 240 135" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="gArc" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#E17055" />
                      <stop offset="20%" stopColor="#FDCB6E" />
                      <stop offset="35%" stopColor="#00B894" />
                      <stop offset="65%" stopColor="#00B894" />
                      <stop offset="80%" stopColor="#FDCB6E" />
                      <stop offset="100%" stopColor="#D63031" />
                    </linearGradient>
                    <filter id="dotGlow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="arcShadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
                    </filter>
                  </defs>

                  {/* Background arc */}
                  <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="#F0EFF5" strokeWidth="22" strokeLinecap="round" />

                  {/* Colored gradient arc */}
                  <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="url(#gArc)" strokeWidth="22" strokeLinecap="round" filter="url(#arcShadow)" />

                  {/* Tick marks */}
                  {[0, 0.167, 0.5, 0.778, 1].map((t, i) => {
                    const a = (180 - t * 180) * Math.PI / 180;
                    const x1 = cx + (R - 14) * Math.cos(a), y1 = cy - (R - 14) * Math.sin(a);
                    const x2 = cx + (R + 14) * Math.cos(a), y2 = cy - (R + 14) * Math.sin(a);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2.5" strokeLinecap="round" />;
                  })}

                  {/* Indicator dot */}
                  <circle cx={nx} cy={ny} r="10" fill={valColor} stroke="white" strokeWidth="4" filter="url(#dotGlow)" />

                  {/* Scale labels */}
                  {[
                    { t: 0, label: '40', color: '#E17055' },
                    { t: 0.167, label: '70', color: '#FDCB6E' },
                    { t: 0.5, label: '130', color: '#00B894' },
                    { t: 0.778, label: '180', color: '#FDCB6E' },
                    { t: 1, label: '220', color: '#D63031' },
                  ].map(({ t, label, color }) => {
                    const a = (180 - t * 180) * Math.PI / 180;
                    const lx = cx + (R + 24) * Math.cos(a);
                    const ly = cy - (R + 24) * Math.sin(a);
                    return <text key={label} x={lx} y={ly + 3} fontSize="9" fontWeight="600" fill={color} textAnchor="middle" fontFamily="Inter,sans-serif">{label}</text>;
                  })}
                </svg>

                {/* Center value */}
                <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  <p className="num" style={{ fontSize: 56, fontWeight: 900, color: valColor, lineHeight: 1, letterSpacing: -2 }}>{avgGlucose}</p>
                  <p style={{ fontSize: 13, color: '#B2BEC3', marginTop: 6, fontWeight: 500 }}>ค่าเฉลี่ยน้ำตาล mg/dL</p>
                </div>
              </div>
              );
            })()}

            {/* ── Separator ── */}
            <div style={{ width: 60, height: 2, borderRadius: 1, background: 'linear-gradient(90deg, transparent, #E8E5FF, transparent)', margin: '16px 0' }} />

            {/* ── Summary stats ── */}
            <div style={{ display: 'flex', gap: 32, width: '100%', justifyContent: 'center' }}>
              {[
                { label: 'ผู้ป่วย', value: CGM_PATIENTS.length, unit: 'คน', color: '#D97706', icon: '👥' },
                { label: 'Readings', value: totalReadings.toLocaleString(), unit: 'รายการ', color: '#6C5CE7', icon: '📊' },
                { label: 'Time in Range', value: Math.round(CGM_PATIENTS.reduce((s, p) => s + p.tirInRange, 0) / CGM_PATIENTS.length) + '%', unit: 'เฉลี่ย', color: '#00B894', icon: '🎯' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</p>
                  <p className="num" style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</p>
                  <p style={{ fontSize: 10, color: '#B2BEC3', fontWeight: 500, marginTop: 2 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Patient list */}
        <div className="gc anim-up" style={ad(11)}>
          <div className="gc-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="gc-icon" style={{ background: 'linear-gradient(135deg, #FDCB6E, #E17055)' }}><Zap size={20} style={{ color: 'white' }} /></div>
              <div className="gc-title"><h3>รายชื่อผู้ป่วย CGM</h3><p>{CGM_PATIENTS.length} คน</p></div>
            </div>
          </div>
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CGM_PATIENTS.map(p => {
              const avgColor = p.avg < 70 ? '#D63031' : p.avg > 180 ? '#E17055' : '#00B894';
              const tirColor = p.tirInRange >= 70 ? '#00B894' : p.tirInRange >= 50 ? '#E17055' : '#D63031';
              return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 18, border: '1px solid rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, boxShadow: `0 4px 12px ${p.color}35`, flexShrink: 0 }}>{p.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="truncate" style={{ fontSize: 14, fontWeight: 600, color: '#2D3436' }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: '#B2BEC3' }}>{p.readings.toLocaleString()} readings</p>
                </div>
                <div style={{ textAlign: 'center', padding: '4px 12px', borderRadius: 12, background: `${avgColor}08` }}>
                  <p style={{ fontSize: 10, color: '#B2BEC3' }}>Glucose</p>
                  <p className="num" style={{ fontSize: 18, fontWeight: 800, color: avgColor }}>{p.avg}</p>
                </div>
                <div style={{ textAlign: 'center', padding: '4px 12px', borderRadius: 12, background: `${tirColor}08` }}>
                  <p style={{ fontSize: 10, color: '#B2BEC3' }}>TIR</p>
                  <p className="num" style={{ fontSize: 18, fontWeight: 800, color: tirColor }}>{p.tirInRange}%</p>
                </div>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: tirColor, boxShadow: `0 0 0 3px white, 0 0 8px ${tirColor}40`, flexShrink: 0 }} />
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ FEATURE TABLE (Admin only) ═══ */}
      {!isHospital && <div className="gc anim-up" style={{ ...ad(11), overflow: 'hidden' }}>
        <div className="gc-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="gc-icon" style={{ background: 'rgba(9,132,227,0.08)' }}><Eye size={20} style={{ color: '#0984E3' }} /></div>
            <div className="gc-title"><h3>การใช้งานฟีเจอร์แยก รพ.</h3><p>สถิติการใช้งานแต่ละฟีเจอร์</p></div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dt">
            <thead>
              <tr style={{ background: 'rgba(108,92,231,0.04)' }}>
                <th style={{ color: '#636E72' }}>โรงพยาบาล</th>
                {['Vital Signs', 'เยี่ยมบ้าน', 'นัดหมาย', 'แบบประเมิน', 'CGM'].map(h => (
                  <th key={h} style={{ color: '#636E72', textAlign: 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_USAGE.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: '#2D3436', maxWidth: 200 }} className="truncate">{row.hospital}</td>
                  {[
                    { v: row.vitalsign, bg: 'rgba(214,48,49,0.06)', c: '#D63031' },
                    { v: row.visit, bg: 'rgba(0,184,148,0.06)', c: '#00B894' },
                    { v: row.appointment, bg: 'rgba(9,132,227,0.06)', c: '#0984E3' },
                    { v: row.assessment, bg: 'rgba(108,92,231,0.06)', c: '#6C5CE7' },
                    { v: row.cgm, bg: 'rgba(253,203,110,0.12)', c: '#D97706' },
                  ].map((cell, ci) => (
                    <td key={ci} style={{ textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', minWidth: 42, justifyContent: 'center', padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: cell.v > 0 ? cell.bg : 'rgba(0,0,0,0.02)', color: cell.v > 0 ? cell.c : '#DFE6E9' }}>{cell.v}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
}
