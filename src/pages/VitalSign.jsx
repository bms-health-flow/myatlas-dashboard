import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import { AbnormalMarker, NormalMarker } from '../components/PulseMarker';
import {
  HeartPulse, Activity, AlertTriangle, Search,
  ChevronLeft, ChevronRight, MapPin, Info, ChevronDown,
} from 'lucide-react';
import { VITALSIGN_PATIENTS, ABNORMAL_CASES, HOSPITAL_INFO, HOSPITAL_ABNORMAL_CASES } from '../data/mockData';

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

  const stats = [
    {
      label: 'ผู้ป่วยทั้งหมด',
      value: 268,
      unit: 'คน',
      icon: HeartPulse,
      gradient: 'linear-gradient(135deg, #E17055, #FAB1A0)',
      shadow: 'rgba(225,112,85,0.35)',
    },
    {
      label: 'การวัดวันนี้',
      value: 0,
      unit: 'คน',
      icon: Activity,
      gradient: 'linear-gradient(135deg, #0984E3, #74B9FF)',
      shadow: 'rgba(9,132,227,0.35)',
    },
    {
      label: 'เคสผิดปกติวันนี้',
      value: 4,
      unit: 'เคส',
      icon: AlertTriangle,
      gradient: 'linear-gradient(135deg, #D63031, #FF7675)',
      shadow: 'rgba(214,48,49,0.35)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* ── 1. Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
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

      {/* ── 2. Map + Abnormal List ── */}
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
