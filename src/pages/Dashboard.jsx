import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, Home, HeartPulse, AlertTriangle, Building2, TrendingUp,
  Activity, ChevronRight, Bell, Zap, Eye, BarChart3, Stethoscope, ArrowRight,
  MapPin, Map, Flame, Trophy, Filter, Hospital,
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import HeatLayer from '../components/HeatLayer';
import {
  DASHBOARD_STATS, USAGE_CHART_DATA, HOSPITAL_COMPARISON,
  DISEASE_GROUPS, CRITICAL_CASES, CGM_PATIENTS, FEATURE_USAGE,
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
  { icon: Users, label: 'จำนวนผู้ป่วย', value: DASHBOARD_STATS.totalPatients, growth: DASHBOARD_STATS.growthPatients, bg: 'linear-gradient(135deg, #6C5CE7, #A29BFE)' },
  { icon: Home, label: 'เคสส่งเยี่ยม', value: DASHBOARD_STATS.totalVisits, growth: DASHBOARD_STATS.growthVisits, bg: 'linear-gradient(135deg, #00B894, #55EFC4)' },
  { icon: HeartPulse, label: 'Vital Signs', value: DASHBOARD_STATS.totalVitalSigns, growth: DASHBOARD_STATS.growthVitalSigns, bg: 'linear-gradient(135deg, #E17055, #FAB1A0)' },
  { icon: AlertTriangle, label: 'VS ผิดปกติ', value: DASHBOARD_STATS.abnormalVitalSigns, growth: DASHBOARD_STATS.growthAbnormal, bg: 'linear-gradient(135deg, #D63031, #FF7675)' },
  { icon: Building2, label: 'รพ. ใช้งาน', value: `${DASHBOARD_STATS.hospitalsActive}/${DASHBOARD_STATS.totalHospitals}`, bg: 'linear-gradient(135deg, #0984E3, #74B9FF)' },
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
      <div className="hero anim-up" style={ad(0)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {isHospital ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(108,92,231,0.08)', fontSize: 12, fontWeight: 600, color: '#6C5CE7' }}>
                    <Hospital size={14} /> {HOSPITAL_INFO.name}
                  </div>
                  <span className="badge b-purple" style={{ fontSize: 10 }}>จ.{HOSPITAL_INFO.province}</span>
                </div>
                <h2>Dashboard <span>{HOSPITAL_INFO.name}</span></h2>
                <p className="sub" style={{ marginTop: 12 }}>ข้อมูลผู้ป่วยและการให้บริการ ระดับจังหวัด{HOSPITAL_INFO.province}</p>
              </>
            ) : (
              <>
                <h2>ยินดีต้อนรับสู่ <span>Atlas</span><br/>Healthcare Dashboard</h2>
                <p className="sub" style={{ marginTop: 12 }}>ระบบติดตามและ Monitor ข้อมูลผู้ป่วยแบบ Real-time<br/>สำหรับบุคลากรทางการแพทย์ ครบทุกมิติ</p>
                <button className="btn btn-primary" style={{ marginTop: 24 }}>เริ่มต้นใช้งาน <ArrowRight size={16} /></button>
              </>
            )}
          </div>
          <div style={{ position: 'relative', width: 220, height: 160 }}>
            {[
              { t: 0, l: 10, w: 65, h: 65, r: 16, bg: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', d: '0s' },
              { t: 20, l: 90, w: 55, h: 55, r: 14, bg: 'linear-gradient(135deg, #74B9FF, #0984E3)', d: '0.6s' },
              { t: 80, l: 20, w: 50, h: 50, r: 14, bg: 'linear-gradient(135deg, #FDCB6E, #F39C12)', d: '1.2s' },
              { t: 5, l: 160, w: 40, h: 40, r: 12, bg: 'linear-gradient(135deg, #55EFC4, #00B894)', d: '1.8s' },
              { t: 90, l: 140, w: 45, h: 45, r: 50, bg: 'linear-gradient(135deg, #FF7675, #E17055)', d: '2.4s' },
              { t: 50, l: 60, w: 30, h: 30, r: 8, bg: 'linear-gradient(135deg, #E84393, #FD79A8)', d: '0.3s' },
            ].map(({ t, l, w, h, r, bg, d: dl }, i) => (
              <div key={i} className="anim-float" style={{ position: 'absolute', top: t, left: l, width: w, height: h, borderRadius: r, background: bg, boxShadow: `0 8px 28px rgba(0,0,0,0.1)`, animationDelay: dl, animationDuration: `${3.5 + i * 0.3}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentStats.length}, 1fr)`, gap: 18 }}>
        {currentStats.map((s, i) => (
          <div key={s.label} className="sc anim-up" style={{ ...ad(i + 1), background: s.bg }}>
            <div className="shimmer" />
            <div className="sc-in">
              <div className="sc-top">
                <div className="ic"><s.icon size={22} /></div>
                {s.growth && <div className="tr"><TrendingUp size={11} />+{s.growth}%</div>}
              </div>
              <div className="val">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
              <div className="lbl">{s.label}</div>
            </div>
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

      {/* ═══ CGM ═══ */}
      <div className="gc anim-up" style={ad(10)}>
        <div className="gc-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div className="gc-icon" style={{ background: 'linear-gradient(135deg, #FDCB6E, #E17055)' }}><Zap size={20} style={{ color: 'white' }} /></div>
            <div className="gc-title"><h3>CGM Patient Monitor</h3><p>Continuous Glucose Monitoring</p></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 18 }}>
            <div style={{ background: 'linear-gradient(145deg, #FFF8ED, #FFFBF0)', border: '1.5px solid rgba(251,191,36,0.1)', borderRadius: 22, padding: 28, textAlign: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(217,119,6,0.5)' }}>ผู้ป่วย</p>
              <p className="num" style={{ fontSize: 52, fontWeight: 900, color: '#D97706', marginTop: 8 }}>{CGM_PATIENTS.length}</p>
              <p style={{ fontSize: 12, color: '#B2BEC3', marginTop: 10 }}>{totalReadings.toLocaleString()} readings</p>
            </div>
            <div style={{ background: 'linear-gradient(145deg, #FFF8ED, #FFFBF0)', border: '1.5px solid rgba(251,191,36,0.1)', borderRadius: 22, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(217,119,6,0.5)', marginBottom: 14 }}>เฉลี่ย</p>
              <div style={{ position: 'relative', width: 110, height: 110 }}>
                <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="9" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={avgGlucose > 140 ? '#FDCB6E' : '#00B894'} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(avgGlucose / 200) * 314} 314`} transform="rotate(-90 60 60)" style={{ transition: 'all 1s ease', filter: `drop-shadow(0 2px 6px ${avgGlucose > 140 ? 'rgba(253,203,110,0.4)' : 'rgba(0,184,148,0.4)'})` }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="num" style={{ fontSize: 26, fontWeight: 900, color: '#2D3436' }}>{avgGlucose}</span>
                  <span style={{ fontSize: 10, color: '#B2BEC3' }}>mg/dL</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CGM_PATIENTS.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, boxShadow: `0 4px 12px ${p.color}40` }}>{p.initial}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="truncate" style={{ fontSize: 14, fontWeight: 600, color: '#2D3436' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: '#B2BEC3' }}>{p.readings.toLocaleString()} readings</p>
                  </div>
                  <span className="num" style={{ fontSize: 14, fontWeight: 700, color: '#2D3436', flexShrink: 0 }}>{p.avg} <span style={{ fontSize: 10, fontWeight: 400, color: '#B2BEC3' }}>mg/dL</span></span>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.status === 'warning' ? '#FDCB6E' : '#00B894', boxShadow: `0 0 0 3px white, 0 0 8px ${p.status === 'warning' ? 'rgba(253,203,110,0.4)' : 'rgba(0,184,148,0.4)'}`, flexShrink: 0 }} />
                </div>
              ))}
            </div>
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
