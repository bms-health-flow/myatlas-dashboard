import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, Home, HeartPulse, AlertTriangle, Building2, TrendingUp,
  Activity, ChevronRight, Bell, Zap, Eye, Stethoscope,
  MapPin, Flame, Trophy, Filter, Hospital, RefreshCw, ChevronDown,
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

/* ═══ COLORS ═══ */
const C = {
  green: '#00B894',
  greenLight: '#55EFC4',
  orange: '#E17055',
  red: '#D63031',
  purple: '#6C5CE7',
  blue: '#0984E3',
  yellow: '#FDCB6E',
  text: '#2D3436',
  subtitle: '#636E72',
  muted: '#B2BEC3',
  pageBg: '#F2F2F7',
  cardBg: '#FFFFFF',
};

/* ═══ CARD STYLE ═══ */
const cardStyle = {
  background: C.cardBg,
  borderRadius: 24,
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  overflow: 'hidden',
};

/* ═══ TOOLTIP ═══ */
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 14, padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

/* ═══ ICON CIRCLE ═══ */
const IconCircle = ({ bg, children, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    {children}
  </div>
);

/* ═══ SECTION HEADER ═══ */
const SectionHeader = ({ icon, iconBg, title, subtitle, right }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconCircle bg={iconBg}>{icon}</IconCircle>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{title}</h3>
        <p style={{ fontSize: 12, color: C.subtitle, margin: 0, marginTop: 2 }}>{subtitle}</p>
      </div>
    </div>
    {right}
  </div>
);

/* ═══ STAT CARDS DATA ═══ */
const statCards = [
  { icon: Users, label: 'จำนวนผู้ป่วย', value: 250, growth: 4.1, gradient: 'linear-gradient(135deg, #00B894, #55EFC4)', iconColor: '#00B894', iconBg: 'rgba(0,184,148,0.12)' },
  { icon: Home, label: 'เคสส่งเยี่ยมบ้าน', value: 250, growth: 4.1, gradient: 'linear-gradient(135deg, #00B894, #55EFC4)', iconColor: '#00B894', iconBg: 'rgba(0,184,148,0.12)' },
  { icon: HeartPulse, label: 'Vital Sign', value: 250, growth: 4.1, gradient: 'linear-gradient(135deg, #00B894, #55EFC4)', iconColor: '#00B894', iconBg: 'rgba(0,184,148,0.12)' },
  { icon: AlertTriangle, label: 'VS ผิดปกติ', value: 100, growth: 4.1, gradient: 'linear-gradient(135deg, #E17055, #FAB1A0)', iconColor: '#E17055', iconBg: 'rgba(225,112,85,0.12)' },
  { icon: Building2, label: 'รพ. ใช้งาน', value: '14/14', growth: 9.2, gradient: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', iconColor: '#6C5CE7', iconBg: 'rgba(108,92,231,0.12)' },
];

/* ═══ THAILAND MAP SECTION ═══ */
function ThailandMapSection() {
  const [regionFilter, setRegionFilter] = useState('all');
  const [mapMode, setMapMode] = useState('markers');

  const filteredProvinces = useMemo(() => {
    if (regionFilter === 'all') return PROVINCES_DATA;
    return PROVINCES_DATA.filter(p => p.region === regionFilter);
  }, [regionFilter]);

  const getMarkerColor = (p) => {
    const total = p.visited + p.notVisited + p.pending;
    if (p.notVisited / total > 0.3) return C.red;
    if (p.pending / total > 0.2) return C.yellow;
    return C.green;
  };

  const getMarkerSize = (p) => {
    const total = p.visited + p.notVisited + p.pending;
    return Math.max(8, Math.min(22, total / 8));
  };

  const heatPoints = useMemo(() => {
    return filteredProvinces.map(p => {
      const intensity = p.visited + p.notVisited + p.pending;
      return [p.lat, p.lng, Math.min(intensity / 200, 1)];
    });
  }, [filteredProvinces]);

  const top10 = useMemo(() => {
    return [...PROVINCES_DATA]
      .sort((a, b) => (b.visited + b.notVisited + b.pending) - (a.visited + a.notVisited + a.pending))
      .slice(0, 10);
  }, []);

  return (
    <div style={{ ...cardStyle }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 0' }}>
        <SectionHeader
          icon={<MapPin size={18} style={{ color: C.purple }} />}
          iconBg="rgba(108,92,231,0.1)"
          title="แผนที่ผู้ป่วย"
          subtitle="แสดงตำแหน่งและสถานะผู้ป่วยทั่วประเทศ"
        />
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid rgba(0,0,0,0.04)', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} style={{ color: C.muted }} />
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setRegionFilter('all')}
              style={{
                padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600,
                background: regionFilter === 'all' ? C.purple : 'rgba(0,0,0,0.04)',
                color: regionFilter === 'all' ? '#fff' : C.subtitle,
              }}
            >ทั้งหมด</button>
            {REGIONS.map(r => (
              <button
                key={r.id}
                onClick={() => setRegionFilter(r.id)}
                style={{
                  padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                  background: regionFilter === r.id ? C.purple : 'rgba(0,0,0,0.04)',
                  color: regionFilter === r.id ? '#fff' : C.subtitle,
                }}
              >{r.name.replace('ภาค', '')}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setMapMode('markers')}
            style={{
              padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
              background: mapMode === 'markers' ? C.purple : 'rgba(0,0,0,0.04)',
              color: mapMode === 'markers' ? '#fff' : C.subtitle,
            }}
          ><MapPin size={12} /> ตำแหน่ง</button>
          <button
            onClick={() => setMapMode('heat')}
            style={{
              padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
              background: mapMode === 'heat' ? C.purple : 'rgba(0,0,0,0.04)',
              color: mapMode === 'heat' ? '#fff' : C.subtitle,
            }}
          ><Flame size={12} /> Heatmap</button>
        </div>
      </div>

      {/* Map + Side panel */}
      <div style={{ display: 'flex', minHeight: 500 }}>
        {/* Map 60% */}
        <div style={{ flex: '0 0 60%', height: 500 }}>
          <MapContainer
            center={[13.0, 101.0]}
            zoom={6}
            scrollWheelZoom
            style={{ height: '100%', width: '100%', borderRadius: '0 0 0 24px' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OSM &amp; CartoDB"
            />
            {mapMode === 'markers' && filteredProvinces.map(p => {
              const total = p.visited + p.notVisited + p.pending;
              return (
                <CircleMarker
                  key={p.name}
                  center={[p.lat, p.lng]}
                  radius={getMarkerSize(p)}
                  pathOptions={{ color: '#fff', fillColor: getMarkerColor(p), fillOpacity: 0.85, weight: 2.5 }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Sarabun, Inter, sans-serif', padding: 4, minWidth: 160 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>{p.name}</p>
                      {[
                        { label: 'เยี่ยมแล้ว', val: p.visited, color: C.green },
                        { label: 'ยังไม่เยี่ยม', val: p.notVisited, color: C.red },
                        { label: 'รอรับงาน', val: p.pending, color: C.yellow },
                      ].map(s => (
                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.subtitle }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />{s.label}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{s.val}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: C.muted }}>รวม</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: C.purple }}>{total} เคส</span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
            {mapMode === 'heat' && <HeatLayer points={heatPoints} />}
          </MapContainer>
        </div>

        {/* Right 40% - Top 10 */}
        <div style={{ flex: '0 0 40%', padding: 20, display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <IconCircle bg="rgba(253,203,110,0.15)" size={34}>
              <Trophy size={16} style={{ color: '#D97706' }} />
            </IconCircle>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>10 อันดับจังหวัดที่ใช้งาน</h4>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>เรียงตามจำนวนผู้ป่วย</p>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {top10.map((p, i) => {
              const visited = p.visited;
              const notVisited = p.notVisited;
              const pending = p.pending;
              const total = visited + notVisited + pending;
              const maxTotal = top10[0].visited + top10[0].notVisited + top10[0].pending;
              const barW = (total / maxTotal) * 100;

              return (
                <div key={p.name} style={{ padding: '8px 10px', borderRadius: 12, background: i < 3 ? 'rgba(108,92,231,0.04)' : 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: i < 3 ? C.purple : C.muted, width: 18, textAlign: 'center' }}>{i + 1}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: i < 3 ? C.purple : C.subtitle }}>{total}</span>
                  </div>
                  <div style={{ display: 'flex', height: 6, borderRadius: 99, overflow: 'hidden', background: 'rgba(0,0,0,0.04)', marginLeft: 26, width: `${barW}%` }}>
                    <div style={{ width: `${(visited / total) * 100}%`, background: C.green }} />
                    <div style={{ width: `${(notVisited / total) * 100}%`, background: C.red }} />
                    <div style={{ width: `${(pending / total) * 100}%`, background: C.orange }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', gap: 16, fontSize: 11 }}>
            {[
              { label: 'เยี่ยม', color: C.green },
              { label: 'ไม่เยี่ยม', color: C.red },
              { label: 'รอ', color: C.orange },
            ].map(s => (
              <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.subtitle }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />{s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ MAIN DASHBOARD ═══ */
export default function Dashboard() {
  const { role } = useOutletContext();
  const isHospital = role === 'hospital';

  const [chartPeriod, setChartPeriod] = useState('monthly');
  const [caseFilter, setCaseFilter] = useState('ทั้งหมด');
  const [featurePage, setFeaturePage] = useState(0);

  const chartData = isHospital
    ? (HOSPITAL_USAGE_CHART[chartPeriod] || HOSPITAL_USAGE_CHART.monthly)
    : (USAGE_CHART_DATA[chartPeriod] || USAGE_CHART_DATA.monthly);

  const diseaseData = isHospital ? HOSPITAL_DISEASE_GROUPS : DISEASE_GROUPS;
  const criticalData = isHospital ? HOSPITAL_CRITICAL_CASES : CRITICAL_CASES;
  const diseaseTotal = diseaseData.reduce((s, d) => s + d.count, 0);

  const avgGlucose = Math.round(CGM_PATIENTS.reduce((s, p) => s + p.avg, 0) / CGM_PATIENTS.length);
  const totalReadings = CGM_PATIENTS.reduce((s, p) => s + p.readings, 0);

  const hospMax = Math.max(...HOSPITAL_COMPARISON.map(h => h.visited + h.notVisited + h.pending));

  const currentStats = isHospital ? [
    { icon: Users, label: 'ผู้ป่วยในเขต', value: HOSPITAL_STATS.totalPatients, growth: HOSPITAL_STATS.growthPatients, gradient: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', iconColor: '#6C5CE7', iconBg: 'rgba(108,92,231,0.12)' },
    { icon: Home, label: 'เคสส่งเยี่ยม', value: HOSPITAL_STATS.totalVisits, growth: HOSPITAL_STATS.growthVisits, gradient: 'linear-gradient(135deg, #00B894, #55EFC4)', iconColor: '#00B894', iconBg: 'rgba(0,184,148,0.12)' },
    { icon: HeartPulse, label: 'Vital Signs', value: HOSPITAL_STATS.totalVitalSigns, growth: HOSPITAL_STATS.growthVitalSigns, gradient: 'linear-gradient(135deg, #E17055, #FAB1A0)', iconColor: '#E17055', iconBg: 'rgba(225,112,85,0.12)' },
    { icon: AlertTriangle, label: 'VS ผิดปกติ', value: HOSPITAL_STATS.abnormalVitalSigns, growth: HOSPITAL_STATS.growthAbnormal, gradient: 'linear-gradient(135deg, #D63031, #FF7675)', iconColor: '#D63031', iconBg: 'rgba(214,48,49,0.12)' },
  ] : statCards;

  const getMarkerColorLocal = (s) => s === 'visited' ? C.green : s === 'pending' ? C.yellow : C.red;

  /* Feature table pagination */
  const pageSize = 5;
  const featurePages = Math.ceil(FEATURE_USAGE.length / pageSize);
  const featureSlice = FEATURE_USAGE.slice(featurePage * pageSize, (featurePage + 1) * pageSize);

  return (
    <div style={{
      maxWidth: 1144,
      margin: '0 auto',
      padding: 24,
      background: C.pageBg,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    }}>

      {/* ═══ 1. HERO BANNER ═══ */}
      <div style={{
        height: 150,
        borderRadius: 24,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}>
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

        {/* Left text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {isHospital && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 600 }}>
                <Hospital size={12} /> {HOSPITAL_INFO.name}
              </span>
            </div>
          )}
          <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>ยินดีต้อนรับสู่</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 0', lineHeight: 1.2, color: 'white' }}>Atlas Dashboard</h2>
          <p style={{ fontSize: 14, opacity: 0.7, margin: '6px 0 0' }}>ระบบติดตามและ Monitor ข้อมูลผู้ป่วยแบบ Real-time</p>
        </div>

        {/* Top right corner: date + dropdown */}
        <div style={{ position: 'absolute', top: 16, right: 24, display: 'flex', alignItems: 'center', gap: 10, zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.15)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            เดือน <ChevronDown size={14} />
          </div>
          <span style={{ fontSize: 12, opacity: 0.8 }}>จ. 23 มี.ค. 2569 10:43:37</span>
          <RefreshCw size={16} style={{ opacity: 0.7, cursor: 'pointer' }} />
        </div>

        {/* Right side: circle placeholder */}
        <div style={{
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 60%, transparent 70%)',
          position: 'relative', zIndex: 1, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          </div>
        </div>
      </div>

      {/* ═══ 2. STAT CARDS ROW ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentStats.length}, 1fr)`, gap: 16 }}>
        {currentStats.map((s, i) => (
          <div key={s.label} style={{
            ...cardStyle,
            width: currentStats.length === 5 ? 'auto' : 'auto',
            minHeight: 131,
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            {/* Top row: icon + trend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: s.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                <s.icon size={18} style={{ color: 'white' }} />
              </div>
              {s.growth !== undefined && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  padding: '4px 10px', borderRadius: 99,
                  background: s.iconBg,
                  fontSize: 11, fontWeight: 700,
                  color: s.iconColor,
                }}>
                  <TrendingUp size={11} /> +{s.growth}%
                </div>
              )}
            </div>
            {/* Bottom */}
            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: C.subtitle, margin: '0 0 4px' }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>
                {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ 3. CHARTS ROW ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Line Chart - ภาพรวมการใช้งาน */}
        <div style={{ ...cardStyle, minHeight: 350, padding: 24 }}>
          <SectionHeader
            icon={<Activity size={18} style={{ color: C.green }} />}
            iconBg="rgba(0,184,148,0.1)"
            title="ภาพรวมการใช้งาน"
            subtitle="Vital Signs & เยี่ยมบ้าน"
          />
          <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.subtitle }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.red, display: 'inline-block' }} /> Vital Signs
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.subtitle }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.blue, display: 'inline-block' }} /> เยี่ยมบ้าน
            </span>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Line type="monotone" dataKey="vitalsign" name="Vital Signs" stroke={C.red} strokeWidth={3} dot={{ r: 4, fill: C.red, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: C.red, stroke: '#fff', strokeWidth: 3 }} />
                <Line type="monotone" dataKey="visit" name="เยี่ยมบ้าน" stroke={C.blue} strokeWidth={3} dot={{ r: 4, fill: C.blue, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: C.blue, stroke: '#fff', strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - เปรียบเทียบ รพ. (Admin) / Province Map (Hospital) */}
        {isHospital ? (
          <div style={{ ...cardStyle, minHeight: 350, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 0' }}>
              <SectionHeader
                icon={<MapPin size={18} style={{ color: C.purple }} />}
                iconBg="rgba(108,92,231,0.1)"
                title={`แผนที่ผู้ป่วย จ.${HOSPITAL_INFO.province}`}
                subtitle="ตำแหน่งและสถานะผู้ป่วยในพื้นที่"
              />
            </div>
            <div style={{ height: 280 }}>
              <MapContainer center={[HOSPITAL_INFO.lat, HOSPITAL_INFO.lng]} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%', borderRadius: '0 0 24px 24px' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OSM" />
                {HOSPITAL_PATIENTS_MAP.map((p, i) => (
                  <CircleMarker key={i} center={[p.lat, p.lng]} radius={10}
                    pathOptions={{ color: '#fff', fillColor: getMarkerColorLocal(p.status), fillOpacity: 0.85, weight: 2.5 }}>
                    <Popup>
                      <div style={{ fontFamily: 'Sarabun, Inter, sans-serif', padding: 4 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{p.name}</p>
                        <p style={{ fontSize: 12, color: C.subtitle, marginTop: 4 }}>{p.disease}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        ) : (
          <div style={{ ...cardStyle, minHeight: 350, padding: 24 }}>
            <SectionHeader
              icon={<Building2 size={18} style={{ color: C.green }} />}
              iconBg="rgba(0,184,148,0.1)"
              title="เปรียบเทียบ รพ."
              subtitle="สถานะการเยี่ยมบ้าน"
              right={
                <button style={{ fontSize: 12, fontWeight: 600, color: C.purple, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  ดูเพิ่มเติม <ChevronRight size={14} />
                </button>
              }
            />
            <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 11 }}>
              {[
                { c: C.green, l: 'เยี่ยมแล้ว' },
                { c: C.red, l: 'ยังไม่เยี่ยม' },
                { c: C.yellow, l: 'รอรับงาน' },
              ].map(x => (
                <span key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.subtitle }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: x.c, display: 'inline-block' }} />{x.l}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {HOSPITAL_COMPARISON.map((h, i) => {
                const total = h.visited + h.notVisited + h.pending;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.text, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.short}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: 'Inter, sans-serif' }}>{total}</span>
                    </div>
                    <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', background: 'rgba(0,0,0,0.03)' }}>
                      <div style={{ width: `${(h.visited / hospMax) * 100}%`, background: C.green, transition: 'width 0.6s ease' }} />
                      <div style={{ width: `${(h.notVisited / hospMax) * 100}%`, background: C.red, transition: 'width 0.6s ease' }} />
                      <div style={{ width: `${(h.pending / hospMax) * 100}%`, background: C.yellow, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ═══ 4. MAP SECTION (Admin only) ═══ */}
      {!isHospital && <ThailandMapSection />}

      {/* ═══ 5. DISEASE + CRITICAL CASES ROW ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Disease Donut */}
        <div style={{ ...cardStyle, padding: 24 }}>
          <SectionHeader
            icon={<Stethoscope size={18} style={{ color: '#E84393' }} />}
            iconBg="rgba(232,67,147,0.1)"
            title="สัดส่วนกลุ่มโรค"
            subtitle="การเยี่ยมบ้านตามกลุ่มโรค"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Donut */}
            <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={diseaseData} cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3} dataKey="count" strokeWidth={0} cornerRadius={4}>
                    {diseaseData.map((dd, i) => <Cell key={i} fill={dd.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} ราย`, n]} contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: C.text, fontFamily: 'Inter, sans-serif' }}>{diseaseTotal}</span>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>ทั้งหมด</span>
              </div>
            </div>
            {/* Legend */}
            <div style={{ flex: 1, maxHeight: 210, overflowY: 'auto' }}>
              {diseaseData.map((dd, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 6px', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: dd.color, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: C.subtitle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dd.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: 'Inter, sans-serif' }}>{dd.count}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>({dd.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Critical Cases */}
        <div style={{ ...cardStyle, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <IconCircle bg="rgba(214,48,49,0.08)">
                <Bell size={18} style={{ color: C.red }} />
              </IconCircle>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>เคสที่ต้องดูแล</h3>
                <p style={{ fontSize: 12, color: C.subtitle, margin: 0, marginTop: 2 }}>แจ้งเตือนค่าผิดปกติ</p>
              </div>
            </div>
            <button style={{ fontSize: 12, fontWeight: 600, color: C.purple, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              ดูทั้งหมด <ChevronRight size={14} />
            </button>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {['ทั้งหมด', 'ค่าผิดปกติ', 'ยังไม่เยี่ยม'].map(f => (
              <button
                key={f}
                onClick={() => setCaseFilter(f)}
                style={{
                  padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                  background: caseFilter === f ? C.purple : 'rgba(0,0,0,0.04)',
                  color: caseFilter === f ? '#fff' : C.subtitle,
                }}
              >{f}</button>
            ))}
          </div>

          {/* Cases list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
            {criticalData.map(c => (
              <div key={c.id} style={{
                display: 'flex', gap: 12, padding: 14, borderRadius: 16,
                border: '1px solid rgba(214,48,49,0.06)',
                background: 'rgba(255,255,255,0.6)',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFE8E8, #FECACA)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <HeartPulse size={18} style={{ color: C.red }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                      background: c.severity === 'critical' ? 'rgba(214,48,49,0.1)' : 'rgba(225,112,85,0.1)',
                      color: c.severity === 'critical' ? C.red : C.orange,
                    }}>{c.severity === 'critical' ? 'วิกฤต' : 'เฝ้าระวัง'}</span>
                  </div>
                  <p style={{ fontSize: 12, color: C.subtitle, margin: '3px 0 0' }}>{c.condition}</p>
                  <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>{c.hospital} · {c.time}ที่แล้ว</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 6. CGM SECTION ═══ */}
      <div style={{ ...cardStyle, padding: 24 }}>
        <SectionHeader
          icon={<Zap size={18} style={{ color: 'white' }} />}
          iconBg="linear-gradient(135deg, #FDCB6E, #E17055)"
          title="ค่าน้ำตาลเฉลี่ย CGM"
          subtitle="Continuous Glucose Monitoring"
        />

        <div style={{ display: 'flex', gap: 24 }}>
          {/* Left: Semicircle gauge */}
          <div style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
            {(() => {
              const pct = Math.max(0, Math.min(1, (avgGlucose - 40) / (220 - 40)));
              const angle = 180 - pct * 180;
              const rad = (angle * Math.PI) / 180;
              const cx = 140, cy = 130, R = 100;
              const nx = cx + R * Math.cos(rad);
              const ny = cy - R * Math.sin(rad);
              const valColor = avgGlucose < 70 ? C.red : avgGlucose > 180 ? C.orange : C.green;

              return (
                <div style={{ position: 'relative', width: 310, height: 180, marginBottom: 8 }}>
                  <svg viewBox="0 0 280 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="gArc" x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor={C.orange} />
                        <stop offset="20%" stopColor={C.yellow} />
                        <stop offset="35%" stopColor={C.green} />
                        <stop offset="65%" stopColor={C.green} />
                        <stop offset="80%" stopColor={C.yellow} />
                        <stop offset="100%" stopColor={C.red} />
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
                    <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="#F0EFF5" strokeWidth="24" strokeLinecap="round" />

                    {/* Colored gradient arc */}
                    <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="url(#gArc)" strokeWidth="24" strokeLinecap="round" filter="url(#arcShadow)" />

                    {/* Tick marks at 70 and 180 */}
                    {[
                      { val: 70, label: '70', color: C.yellow },
                      { val: 180, label: '180', color: C.yellow },
                    ].map(({ val, label, color }) => {
                      const t = (val - 40) / (220 - 40);
                      const a = (180 - t * 180) * Math.PI / 180;
                      const x1 = cx + (R - 16) * Math.cos(a), y1 = cy - (R - 16) * Math.sin(a);
                      const x2 = cx + (R + 16) * Math.cos(a), y2 = cy - (R + 16) * Math.sin(a);
                      const lx = cx + (R + 28) * Math.cos(a), ly = cy - (R + 28) * Math.sin(a);
                      return (
                        <g key={val}>
                          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                          <text x={lx} y={ly + 4} fontSize="10" fontWeight="600" fill={color} textAnchor="middle" fontFamily="Inter,sans-serif">{label}</text>
                        </g>
                      );
                    })}

                    {/* Edge labels */}
                    <text x={cx - R - 18} y={cy + 5} fontSize="10" fontWeight="600" fill={C.orange} textAnchor="middle" fontFamily="Inter,sans-serif">Low</text>
                    <text x={cx + R + 18} y={cy + 5} fontSize="10" fontWeight="600" fill={C.red} textAnchor="middle" fontFamily="Inter,sans-serif">High</text>

                    {/* Indicator dot */}
                    <circle cx={nx} cy={ny} r="10" fill={valColor} stroke="white" strokeWidth="4" filter="url(#dotGlow)" />
                  </svg>

                  {/* Center value */}
                  <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <p style={{ fontSize: 48, fontWeight: 900, color: valColor, lineHeight: 1, margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: -2 }}>{avgGlucose}</p>
                    <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0', fontWeight: 500 }}>mg/dL</p>
                  </div>
                </div>
              );
            })()}

            {/* Stats below gauge */}
            <div style={{ display: 'flex', gap: 28, marginTop: 12 }}>
              {[
                { label: 'ผู้ป่วย', value: CGM_PATIENTS.length, unit: 'คน', color: '#D97706' },
                { label: 'Readings', value: totalReadings.toLocaleString(), unit: 'รายการ', color: C.purple },
                { label: 'TIR', value: Math.round(CGM_PATIENTS.reduce((s, p) => s + p.tirInRange, 0) / CGM_PATIENTS.length) + '%', unit: 'เฉลี่ย', color: C.green },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: s.color, margin: 0, fontFamily: 'Inter, sans-serif' }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Patient list */}
          <div style={{ flex: 1, borderLeft: '1px solid rgba(0,0,0,0.04)', paddingLeft: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>รายชื่อผู้ป่วย CGM</h4>
              <span style={{ fontSize: 12, color: C.muted }}>{CGM_PATIENTS.length} คน</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CGM_PATIENTS.map(p => {
                const avgColor = p.avg < 70 ? C.red : p.avg > 180 ? C.orange : C.green;
                return (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    borderRadius: 14, border: '1px solid rgba(0,0,0,0.03)',
                    background: 'rgba(0,0,0,0.01)', cursor: 'pointer', transition: 'all 0.2s ease',
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', background: p.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0,
                      boxShadow: `0 3px 10px ${p.color}30`,
                    }}>{p.initial}</div>
                    {/* Name + readings */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>{p.readings.toLocaleString()} readings</p>
                    </div>
                    {/* Avg glucose */}
                    <div style={{ textAlign: 'center', padding: '4px 10px', borderRadius: 10, background: `${avgColor}0A` }}>
                      <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>Avg</p>
                      <p style={{ fontSize: 16, fontWeight: 800, color: avgColor, margin: 0, fontFamily: 'Inter, sans-serif' }}>{p.avg}</p>
                    </div>
                    {/* Status dot */}
                    <span style={{
                      width: 10, height: 10, borderRadius: '50%', background: avgColor,
                      boxShadow: `0 0 0 3px white, 0 0 6px ${avgColor}40`, flexShrink: 0,
                    }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 7. FEATURE USAGE TABLE (Admin only) ═══ */}
      {!isHospital && (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px' }}>
            <SectionHeader
              icon={<Eye size={18} style={{ color: C.blue }} />}
              iconBg="rgba(9,132,227,0.1)"
              title="สถิติการใช้งานแยกฟีเจอร์แยก รพ."
              subtitle="สถิติการใช้งานแต่ละฟีเจอร์"
            />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(108,92,231,0.04)' }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 600, color: C.subtitle, fontSize: 12 }}>โรงพยาบาล</th>
                  {['Vital Signs', 'เยี่ยมบ้าน', 'นัดหมาย', 'แบบประเมิน', 'CGM'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: C.subtitle, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureSlice.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td style={{ padding: '12px 24px', fontWeight: 600, color: C.text, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.hospital}</td>
                    {[
                      { v: row.vitalsign, bg: 'rgba(214,48,49,0.08)', c: C.red },
                      { v: row.visit, bg: 'rgba(0,184,148,0.08)', c: C.green },
                      { v: row.appointment, bg: 'rgba(9,132,227,0.08)', c: C.blue },
                      { v: row.assessment, bg: 'rgba(108,92,231,0.08)', c: C.purple },
                      { v: row.cgm, bg: 'rgba(253,203,110,0.15)', c: '#D97706' },
                    ].map((cell, ci) => (
                      <td key={ci} style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex', minWidth: 40, justifyContent: 'center',
                          padding: '5px 12px', borderRadius: 10,
                          fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                          background: cell.v > 0 ? cell.bg : 'rgba(0,0,0,0.02)',
                          color: cell.v > 0 ? cell.c : '#DFE6E9',
                        }}>{cell.v}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {featurePages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
              {Array.from({ length: featurePages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setFeaturePage(i)}
                  style={{
                    width: 32, height: 32, borderRadius: 10, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 700,
                    background: featurePage === i ? C.purple : 'rgba(0,0,0,0.04)',
                    color: featurePage === i ? '#fff' : C.subtitle,
                  }}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
