import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import { AbnormalMarker, NormalMarker } from '../components/PulseMarker';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  HeartPulse, Activity, AlertTriangle, Search,
  ChevronLeft, ChevronRight, MapPin, Info, ChevronDown, Zap, TrendingUp, Shield,
} from 'lucide-react';
import { VITALSIGN_PATIENTS, ABNORMAL_CASES, HOSPITAL_INFO, HOSPITAL_ABNORMAL_CASES, VS_BY_TYPE, VS_DAILY_TREND, VS_SEVERITY } from '../data/mockData';

const CASES_PER_PAGE = 2;
const PATIENTS_PER_PAGE = 7;

/* ─── Reusable Pagination ─── */
const Pagination = ({ current, total, onChange }) => {
  const pages = [];
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pag">
      <button
        className="pg"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
      </button>

      {pages[0] > 1 && (
        <>
          <button className="pg" onClick={() => onChange(1)}>1</button>
          {pages[0] > 2 && (
            <span style={{ color: '#B2BEC3', padding: '0 4px' }}>...</span>
          )}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`pg${current === p ? ' active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < total && (
        <>
          {pages[pages.length - 1] < total - 1 && (
            <span style={{ color: '#B2BEC3', padding: '0 4px' }}>...</span>
          )}
          <button
            className={`pg${current === total ? ' active' : ''}`}
            onClick={() => onChange(total)}
          >
            {total}
          </button>
        </>
      )}

      <button
        className="pg"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
      >
        <ChevronRight style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
};

/* ─── Main Component ─── */
export default function VitalSign() {
  const { role } = useOutletContext();
  const isHospital = role === 'hospital';
  const mapCenter = isHospital ? [HOSPITAL_INFO.lat, HOSPITAL_INFO.lng] : [13.7, 100.5];
  const mapZoom = isHospital ? 12 : 10;
  const abnormalData = isHospital ? HOSPITAL_ABNORMAL_CASES : ABNORMAL_CASES;
  const [casePage, setCasePage] = useState(1);
  const [patientPage, setPatientPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-03-23');
  const [vitalType, setVitalType] = useState('all');

  const totalCasePages = Math.ceil(abnormalData.length / CASES_PER_PAGE);
  const pagedCases = useMemo(
    () => abnormalData.slice((casePage - 1) * CASES_PER_PAGE, casePage * CASES_PER_PAGE),
    [casePage],
  );

  const totalPatientPages = Math.ceil(VITALSIGN_PATIENTS.length / PATIENTS_PER_PAGE);
  const pagedPatients = useMemo(
    () => VITALSIGN_PATIENTS.slice((patientPage - 1) * PATIENTS_PER_PAGE, patientPage * PATIENTS_PER_PAGE),
    [patientPage],
  );

  const complianceRate = Math.round((VS_DAILY_TREND.reduce((s, d) => s + d.total, 0) / (268 * 7)) * 100);

  const stats = [
    { label: 'ผู้ป่วยทั้งหมด', value: 268, unit: 'คน', icon: HeartPulse, gradient: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', shadow: 'rgba(108,92,231,0.35)' },
    { label: 'การวัดวันนี้', value: VS_DAILY_TREND[VS_DAILY_TREND.length - 1].total, unit: 'ครั้ง', icon: Activity, gradient: 'linear-gradient(135deg, #0984E3, #74B9FF)', shadow: 'rgba(9,132,227,0.35)' },
    { label: 'เคสผิดปกติ', value: abnormalData.length, unit: 'เคส', icon: AlertTriangle, gradient: 'linear-gradient(135deg, #D63031, #FF7675)', shadow: 'rgba(214,48,49,0.35)' },
    { label: 'วิกฤต', value: VS_SEVERITY.critical, unit: 'เคส', icon: Shield, gradient: 'linear-gradient(135deg, #E17055, #FAB1A0)', shadow: 'rgba(225,112,85,0.35)' },
    { label: 'อัตราการวัด', value: complianceRate + '%', unit: 'compliance', icon: TrendingUp, gradient: 'linear-gradient(135deg, #00B894, #55EFC4)', shadow: 'rgba(0,184,148,0.3)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* ── 1. Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="sc anim-up"
            style={{
              animationDelay: `${i * 60}ms`,
              background: s.gradient,
              boxShadow: `0 8px 24px -4px ${s.shadow}`,
            }}
          >
            <div className="sc-in">
              <div className="sc-top">
                <div className="ic">
                  <s.icon style={{ width: 22, height: 22 }} />
                </div>
                <div className="tr">
                  {s.unit}
                </div>
              </div>
              <div className="val num">{s.value}</div>
              <div className="lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 2. VS by Type + Severity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 22 }}>
        {/* VS breakdown by type */}
        <div className="gc anim-up" style={{ animationDelay: '200ms' }}>
          <div className="gc-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div className="gc-icon" style={{ background: 'rgba(108,92,231,0.08)' }}><Zap size={20} style={{ color: '#6C5CE7' }} /></div>
              <div className="gc-title"><h3>สรุป Vital Signs แยกประเภท</h3><p>จำนวนการวัดและค่าผิดปกติ</p></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {VS_BY_TYPE.map(v => {
                const abnPct = Math.round((v.abnormal / v.total) * 100);
                return (
                <div key={v.type} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ fontSize: 24 }}>{v.icon}</span>
                  <div style={{ width: 100, flexShrink: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#2D3436' }}>{v.type}</p>
                    <p style={{ fontSize: 11, color: '#B2BEC3' }}>{v.total} ครั้ง</p>
                  </div>
                  {/* Bar: normal vs abnormal */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', background: 'rgba(0,0,0,0.03)' }}>
                      <div style={{ width: `${100 - abnPct}%`, background: '#00B894', borderRadius: '99px 0 0 99px', transition: 'width 0.6s ease' }} />
                      <div style={{ width: `${abnPct}%`, background: v.color, transition: 'width 0.6s ease', borderRadius: '0 99px 99px 0' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 10, color: '#00B894', fontWeight: 600 }}>ปกติ</p>
                      <p className="num" style={{ fontSize: 16, fontWeight: 800, color: '#00B894' }}>{v.normal}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 10, color: v.color, fontWeight: 600 }}>ผิดปกติ</p>
                      <p className="num" style={{ fontSize: 16, fontWeight: 800, color: v.color }}>{v.abnormal}</p>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Severity + Daily Trend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Severity breakdown */}
          <div className="gc anim-up" style={{ animationDelay: '250ms' }}>
            <div className="gc-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div className="gc-icon" style={{ background: 'rgba(214,48,49,0.08)' }}><Shield size={20} style={{ color: '#D63031' }} /></div>
                <div className="gc-title"><h3>ระดับความรุนแรง</h3><p>แบ่งตามความเร่งด่วน</p></div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { label: 'วิกฤต', value: VS_SEVERITY.critical, color: '#D63031', bg: '#FFF0F0', desc: 'ต้องดูแลทันที' },
                  { label: 'เฝ้าระวัง', value: VS_SEVERITY.warning, color: '#E17055', bg: '#FFF0EB', desc: 'ติดตามใกล้ชิด' },
                  { label: 'ปกติ', value: VS_SEVERITY.normal, color: '#00B894', bg: '#F0FFF8', desc: 'ค่าอยู่ในเกณฑ์' },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, padding: 16, borderRadius: 18, background: s.bg, textAlign: 'center', border: `1px solid ${s.color}10` }}>
                    <p className="num" style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.value}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.label}</p>
                    <p style={{ fontSize: 10, color: '#B2BEC3', marginTop: 2 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily trend chart */}
          <div className="gc anim-up" style={{ animationDelay: '300ms', flex: 1 }}>
            <div className="gc-body" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div className="gc-icon" style={{ background: 'rgba(9,132,227,0.08)' }}><TrendingUp size={20} style={{ color: '#0984E3' }} /></div>
                <div className="gc-title"><h3>แนวโน้มการวัด 7 วัน</h3><p>จำนวนการวัดรายวัน</p></div>
              </div>
              <div style={{ flex: 1, minHeight: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={VS_DAILY_TREND} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,92,231,0.05)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#B2BEC3' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#B2BEC3' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 14, fontSize: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }} />
                    <Bar dataKey="total" name="วัดทั้งหมด" fill="#6C5CE7" radius={[6, 6, 0, 0]} opacity={0.2} />
                    <Bar dataKey="abnormal" name="ผิดปกติ" fill="#D63031" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8, fontSize: 11, color: '#636E72' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#6C5CE730', display: 'inline-block' }} /> วัดทั้งหมด</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#D63031', display: 'inline-block' }} /> ผิดปกติ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Map + Abnormal List ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 22 }}>
        {/* Map card */}
        <div
          className="gc anim-up"
          style={{ animationDelay: '200ms', overflow: 'hidden' }}
        >
          <div className="gc-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                className="gc-icon"
                style={{ background: '#E8E5FF', color: '#6C5CE7' }}
              >
                <MapPin style={{ width: 18, height: 18 }} />
              </div>
              <div className="gc-title">
                <h3>แผนที่เคสผิดปกติ</h3>
              </div>
            </div>
          </div>
          <div style={{ height: 400 }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom
              style={{ height: '100%', width: '100%', borderRadius: 0 }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OSM"
              />
              {/* Abnormal cases - PULSING markers */}
              {abnormalData.map((c) => (
                <AbnormalMarker key={c.id} position={[c.lat, c.lng]}>
                  <Popup>
                    <div style={{ fontFamily: 'Sarabun, Inter, sans-serif', fontSize: 13, padding: 4, minWidth: 160 }}>
                      <p style={{ fontWeight: 700, color: '#2D3436', fontSize: 14 }}>{c.name}</p>
                      <p style={{ color: '#636E72', marginTop: 4 }}>อายุ {c.age} ปี</p>
                      <p style={{ color: '#D63031', fontWeight: 700, marginTop: 6, fontSize: 14 }}>
                        {c.condition}: {c.value} {c.unit}
                      </p>
                      <span className="badge b-red" style={{ marginTop: 8 }}>
                        {c.tag}
                      </span>
                    </div>
                  </Popup>
                </AbnormalMarker>
              ))}
              {/* Normal cases - static markers */}
              {VITALSIGN_PATIENTS.filter((p) => p.status === 'normal').map((p, i) => (
                <NormalMarker
                  key={`n-${p.id}`}
                  position={isHospital
                    ? [HOSPITAL_INFO.lat + (Math.sin(i * 1.8) * 0.03), HOSPITAL_INFO.lng + (Math.cos(i * 2.1) * 0.04)]
                    : [13.72 + i * 0.02, 100.5 + i * 0.015]
                  }
                >
                  <Popup>
                    <p style={{ fontFamily: 'Sarabun, Inter, sans-serif', fontSize: 13, fontWeight: 600 }}>
                      {p.name} - <span style={{ color: '#00B894' }}>ปกติ</span>
                    </p>
                  </Popup>
                </NormalMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Abnormal list card */}
        <div
          className="gc anim-up"
          style={{ animationDelay: '250ms', display: 'flex', flexDirection: 'column' }}
        >
          <div className="gc-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                className="gc-icon"
                style={{ background: '#FFE8E8', color: '#D63031' }}
              >
                <AlertTriangle style={{ width: 18, height: 18 }} />
              </div>
              <div className="gc-title">
                <h3>เคสผิดปกติ</h3>
              </div>
            </div>
            <span className="badge b-red">
              {abnormalData.length} เคส
            </span>
          </div>

          <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pagedCases.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: 'linear-gradient(135deg, #fef2f2, #fff1f2)',
                    border: '1px solid rgba(214,48,49,0.1)',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div
                      style={{
                        padding: 8,
                        background: '#FFE8E8',
                        borderRadius: 14,
                        color: '#D63031',
                        alignSelf: 'flex-start',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <AlertTriangle style={{ width: 16, height: 16 }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <p style={{ fontWeight: 700, color: '#2D3436', fontSize: 13 }}>{c.name}</p>
                        <span
                          className="badge"
                          style={{
                            background: 'rgba(108, 92, 231, 0.05)',
                            color: '#B2BEC3',
                            fontSize: 11,
                          }}
                        >
                          {c.age} ปี
                        </span>
                      </div>
                      <p style={{ fontSize: 13, marginTop: 6, color: '#636E72' }}>
                        {c.condition}:{' '}
                        <span style={{ fontWeight: 700, color: '#D63031' }}>
                          {c.value} {c.unit}
                        </span>
                      </p>
                      <span
                        className="badge b-red"
                        style={{ marginTop: 8 }}
                      >
                        {c.tag}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(108, 92, 231, 0.05)' }}>
            <Pagination current={casePage} total={totalCasePages} onChange={setCasePage} />
          </div>
        </div>
      </div>

      {/* ── 3. Filter Bar ── */}
      <div
        className="gc anim-up"
        style={{ animationDelay: '300ms' }}
      >
        <div className="gc-body">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <label className="f-label">วันที่เริ่มต้น</label>
              <input
                type="date"
                className="f-input"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{ width: 180 }}
              />
            </div>

            <div>
              <label className="f-label">วันที่สิ้นสุด</label>
              <input
                type="date"
                className="f-input"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{ width: 180 }}
              />
            </div>

            <div>
              <label className="f-label">ประเภท</label>
              <select
                className="f-select"
                value={vitalType}
                onChange={(e) => setVitalType(e.target.value)}
                style={{ width: 200 }}
              >
                <option value="all">ทั้งหมด</option>
                <option value="temperature">อุณหภูมิ</option>
                <option value="bloodPressure">ความดันโลหิต</option>
                <option value="heartRate">อัตราการเต้นหัวใจ</option>
                <option value="oxygenSaturation">ออกซิเจนในเลือด</option>
                <option value="bloodSugar">น้ำตาลในเลือด</option>
              </select>
            </div>

            <div>
              <button className="btn btn-primary">
                <Search style={{ width: 16, height: 16 }} />
                ค้นหา
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Patient Table ── */}
      <div
        className="gc anim-up"
        style={{ animationDelay: '350ms', overflow: 'hidden' }}
      >
        <div className="gc-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className="gc-icon"
              style={{ background: '#E8E5FF', color: '#6C5CE7' }}
            >
              <Info style={{ width: 18, height: 18 }} />
            </div>
            <div className="gc-title">
              <h3>รายชื่อผู้ป่วยวัด Vital Sign</h3>
            </div>
          </div>
          <span className="badge b-purple">
            {VITALSIGN_PATIENTS.length} คน
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="dt">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>ชื่อ-สกุล</th>
                <th style={{ textAlign: 'center' }}>อายุ</th>
                <th style={{ textAlign: 'center' }}>เพศ</th>
                <th style={{ textAlign: 'left' }}>วัดล่าสุด</th>
                <th style={{ width: 48 }} />
              </tr>
            </thead>
            <tbody>
              {pagedPatients.map((p, idx) => (
                <tr
                  key={p.id}
                  onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                  style={{
                    cursor: 'pointer',
                    background: idx % 2 === 1 ? 'rgba(0,0,0,0.015)' : 'transparent',
                  }}
                >
                  <td style={{ fontWeight: 600, color: '#2D3436' }}>
                    {p.name}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.age ?? '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.gender ?? '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span>{p.lastDate}</span>
                      <span className={`badge ${p.status === 'normal' ? 'b-green' : 'b-red'}`}>
                        <span
                          className="dot"
                          style={{
                            background: p.status === 'normal' ? '#00B894' : '#D63031',
                          }}
                        />
                        {p.status === 'normal' ? 'ปกติ' : 'ผิดปกติ'}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <ChevronDown
                      style={{
                        width: 16,
                        height: 16,
                        color: '#B2BEC3',
                        transition: 'transform 0.2s ease',
                        transform: expandedRow === p.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 24px',
            borderTop: '1px solid rgba(108, 92, 231, 0.05)',
          }}
        >
          <p style={{ fontSize: 12, color: '#B2BEC3' }}>
            แสดง {(patientPage - 1) * PATIENTS_PER_PAGE + 1}-
            {Math.min(patientPage * PATIENTS_PER_PAGE, VITALSIGN_PATIENTS.length)}{' '}
            จาก {VITALSIGN_PATIENTS.length} รายการ
          </p>
          <Pagination
            current={patientPage}
            total={totalPatientPages}
            onChange={setPatientPage}
          />
        </div>
      </div>
    </div>
  );
}
