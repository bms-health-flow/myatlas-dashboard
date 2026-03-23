import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Home, Clock, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight,
  User, MapPin, Heart, Activity, ClipboardList,
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { AbnormalMarker, NormalMarker } from '../components/PulseMarker';
import { HOME_VISIT_STATS, HOME_VISIT_PATIENTS, PATIENT_DETAIL, HOSPITAL_INFO, HOSPITAL_PATIENTS_MAP } from '../data/mockData';
import PatientDetail from './PatientDetail';

/* ── Generate fake coordinates ── */
const PATIENT_COORDS = HOME_VISIT_PATIENTS.map((p, i) => ({
  ...p,
  lat: 17.15 + Math.sin(i * 2.1) * 0.35,
  lng: 104.13 + Math.cos(i * 1.7) * 0.4,
}));

/* ── Pagination ── */
const Pagination = ({ current, total, onChange }) => {
  const pages = [];
  for (let i = 1; i <= Math.min(5, total); i++) pages.push(i);

  return (
    <div className="pag">
      <button
        className="pg"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`pg ${current === p ? 'active' : ''}`}
        >
          {p}
        </button>
      ))}

      {total > 5 && (
        <>
          <span style={{ color: '#B2BEC3', padding: '0 4px', fontSize: 12 }}>...</span>
          <button
            onClick={() => onChange(total)}
            className={`pg ${current === total ? 'active' : ''}`}
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

/* ── Status color helper ── */
const getMarkerColor = (status) =>
  status === 'visited' ? '#00B894' : status === 'pending' ? '#FDCB6E' : '#D63031';

/* ── Main Component ── */
export default function HomeVisit() {
  const { role } = useOutletContext();
  const isHospital = role === 'hospital';

  const [hospitalFilter, setHospitalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [listPage, setListPage] = useState(1);
  const [tablePage, setTablePage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const mapData = isHospital ? HOSPITAL_PATIENTS_MAP : PATIENT_COORDS;

  const visitedPatients = useMemo(
    () => (isHospital ? HOSPITAL_PATIENTS_MAP : PATIENT_COORDS).filter(p => p.status === 'visited'),
    [isHospital]
  );

  const filteredPatients = useMemo(
    () =>
      (isHospital ? HOSPITAL_PATIENTS_MAP : PATIENT_COORDS).filter(p => {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (hospitalFilter && p.hospital !== hospitalFilter) return false;
        return true;
      }),
    [statusFilter, hospitalFilter, isHospital]
  );

  const hospitals = useMemo(
    () => [...new Set(HOME_VISIT_PATIENTS.map(p => p.hospital))],
    []
  );

  const paginatedVisited = visitedPatients.slice((listPage - 1) * 5, listPage * 5);
  const totalVisitedPages = Math.ceil(visitedPatients.length / 5) || 1;
  const paginatedTable = filteredPatients.slice((tablePage - 1) * 6, tablePage * 6);
  const totalTablePages = Math.ceil(filteredPatients.length / 6) || 1;

  /* ── Stat card definitions ── */
  const statCards = [
    {
      label: 'ส่งเยี่ยมทั้งหมด',
      value: isHospital ? 132 : HOME_VISIT_STATS.total,
      icon: Home,
      gradient: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
      shadow: 'rgba(108,92,231,0.35)',
    },
    {
      label: 'ยังไม่ไปเยี่ยม',
      value: isHospital ? 12 : HOME_VISIT_STATS.notVisited,
      icon: Clock,
      gradient: 'linear-gradient(135deg, #FDCB6E, #E17055)',
      shadow: 'rgba(253,203,110,0.35)',
    },
    {
      label: 'เยี่ยมแล้ว',
      value: isHospital ? 110 : HOME_VISIT_STATS.visited,
      icon: CheckCircle,
      gradient: 'linear-gradient(135deg, #00B894, #55EFC4)',
      shadow: 'rgba(0,184,148,0.3)',
    },
    {
      label: 'ยังไม่รับงาน',
      value: isHospital ? 10 : HOME_VISIT_STATS.pending,
      icon: XCircle,
      gradient: 'linear-gradient(135deg, #D63031, #FF7675)',
      shadow: 'rgba(214,48,49,0.3)',
    },
  ];

  /* ── Decorative header icons ── */
  const headerIcons = [
    { icon: Home, bg: 'linear-gradient(135deg, #EDE9FE, #F5F3FF)', color: '#6C5CE7' },
    { icon: Activity, bg: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)', color: '#0984E3' },
    { icon: Heart, bg: 'linear-gradient(135deg, #FCE7F3, #FDF2F8)', color: '#E84393' },
    { icon: ClipboardList, bg: 'linear-gradient(135deg, #D1FAE5, #ECFDF5)', color: '#00B894' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ═══════════════════════════════════════════════════
          1. Hero Banner
          ═══════════════════════════════════════════════════ */}
      <div className="hero anim-up" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div>
            <h2>ติดตามการเยี่ยมบ้าน</h2>
            <p style={{ fontSize: 15, color: '#636E72', lineHeight: 1.7, maxWidth: 440, marginTop: 8 }}>
              ระบบจัดการและติดตามการเยี่ยมบ้านผู้ป่วย
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {headerIcons.map(({ icon: Icon, bg, color }, i) => (
              <div
                key={i}
                className="anim-float"
                style={{
                  animationDelay: `${i * 200}ms`,
                  background: bg,
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon style={{ width: 28, height: 28, color }} />
              </div>
            ))}
          </div>
        </div>

        {/* Floating gradient shapes */}
        <div
          className="anim-float"
          style={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,92,231,0.15), rgba(108,92,231,0.03))',
            top: -10,
            right: 30,
            zIndex: 0,
          }}
        />
        <div
          className="anim-float"
          style={{
            position: 'absolute',
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(116,185,255,0.18), rgba(116,185,255,0.03))',
            top: 70,
            right: 100,
            animationDelay: '1s',
            zIndex: 0,
          }}
        />
        <div
          className="anim-float"
          style={{
            position: 'absolute',
            width: 60,
            height: 60,
            borderRadius: 16,
            background: 'radial-gradient(circle, rgba(232,67,147,0.12), rgba(232,67,147,0.02))',
            top: 20,
            right: 180,
            animationDelay: '2s',
            zIndex: 0,
            transform: 'rotate(25deg)',
          }}
        />

        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(108,92,231,0.08)', filter: 'blur(48px)',
        }} />
        <div style={{
          position: 'absolute', bottom: -32, left: -32,
          width: 128, height: 128, borderRadius: '50%',
          background: 'rgba(116,185,255,0.08)', filter: 'blur(48px)',
        }} />
      </div>

      {/* ═══════════════════════════════════════════════════
          2. Filter Bar
          ═══════════════════════════════════════════════════ */}
      <div className="gc">
        <div className="gc-body">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="f-label">วันที่เริ่มต้น</label>
              <input type="date" defaultValue="2026-01-01" className="f-input" />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="f-label">วันที่สิ้นสุด</label>
              <input type="date" defaultValue="2026-03-23" className="f-input" />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label className="f-label">โรงพยาบาล</label>
              <select
                value={hospitalFilter}
                onChange={e => setHospitalFilter(e.target.value)}
                className="f-select"
              >
                <option value="">ทั้งหมด</option>
                {hospitals.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label className="f-label">สถานะ</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="f-select"
              >
                <option value="all">แสดงทั้งหมด</option>
                <option value="visited">เยี่ยมแล้ว</option>
                <option value="pending">รอรับงาน</option>
              </select>
            </div>
            <div>
              <button className="btn btn-primary">
                <Search style={{ width: 16, height: 16 }} /> ค้นหา
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          3. Stat Cards (4-column grid)
          ═══════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {statCards.map((s, i) => (
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
                  <s.icon style={{ width: 20, height: 20 }} />
                </div>
              </div>
              <div className="val num">{s.value}</div>
              <div className="lbl">{s.label}</div>
              <p style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>เคส</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
          4. Map + Visited List (grid 1fr 380px)
          ═══════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>

        {/* ── Map ── */}
        <div className="gc" style={{ overflow: 'hidden' }}>
          <div className="gc-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="gc-icon" style={{ background: '#E8E5FF' }}>
                <MapPin style={{ width: 18, height: 18, color: '#6C5CE7' }} />
              </div>
              <div className="gc-title">
                <h3>แผนที่การเยี่ยมบ้าน</h3>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#B2BEC3' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="dot" style={{ background: '#00B894' }} /> เยี่ยมแล้ว
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="dot" style={{ background: '#FDCB6E' }} /> รอรับงาน
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="dot" style={{ background: '#D63031' }} /> ยังไม่เยี่ยม
              </span>
            </div>
          </div>
          <div style={{ height: 420 }}>
            <MapContainer
              center={isHospital ? [HOSPITAL_INFO.lat, HOSPITAL_INFO.lng] : [17.15, 104.13]}
              zoom={isHospital ? 12 : 10}
              scrollWheelZoom
              style={{ height: '100%', width: '100%', borderRadius: 0 }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OSM &amp; CartoDB"
              />
              {mapData.map((p, idx) => {
                const popupContent = (
                  <Popup>
                    <div style={{ fontSize: 13, padding: 4 }}>
                      <p style={{ fontWeight: 700 }}>{p.name}</p>
                      <p
                        style={{
                          marginTop: 4,
                          fontWeight: 600,
                          color: p.status === 'visited' ? '#00B894' : p.status === 'pending' ? '#E17055' : '#D63031',
                        }}
                      >
                        {p.status === 'visited' ? 'เยี่ยมแล้ว' : p.status === 'pending' ? 'รอรับงาน' : 'ยังไม่เยี่ยม'}
                      </p>
                    </div>
                  </Popup>
                );

                if (p.status === 'visited') {
                  return (
                    <NormalMarker key={p.id || idx} position={[p.lat, p.lng]}>
                      {popupContent}
                    </NormalMarker>
                  );
                } else if (p.status === 'pending') {
                  return (
                    <NormalMarker key={p.id || idx} position={[p.lat, p.lng]} color="#FDCB6E">
                      {popupContent}
                    </NormalMarker>
                  );
                } else {
                  return (
                    <AbnormalMarker key={p.id || idx} position={[p.lat, p.lng]}>
                      {popupContent}
                    </AbnormalMarker>
                  );
                }
              })}
            </MapContainer>
          </div>
        </div>

        {/* ── Visited List ── */}
        <div className="gc" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="gc-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="gc-icon" style={{ background: '#E0FFF8' }}>
                <CheckCircle style={{ width: 18, height: 18, color: '#00B894' }} />
              </div>
              <div className="gc-title">
                <h3>เยี่ยมแล้ว</h3>
                <p>{isHospital ? 110 : HOME_VISIT_STATS.visited} ราย</p>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {paginatedVisited.map((p, idx) => (
              <div
                key={p.id || idx}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  padding: 14,
                  borderRadius: 14,
                  border: '1px solid rgba(0,184,148,0.1)',
                  background: 'linear-gradient(135deg, rgba(240,253,244,0.5), rgba(255,255,255,0.8))',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setSelectedPatient(p)}
              >
                <div style={{
                  padding: 8,
                  borderRadius: 14,
                  background: '#E0FFF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CheckCircle style={{ width: 16, height: 16, color: '#00B894' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p className="truncate" style={{ fontWeight: 600, fontSize: 13, color: '#2D3436' }}>{p.name}</p>
                    {p.age && <span className="badge b-purple" style={{ flexShrink: 0 }}>{p.age} ปี</span>}
                  </div>
                  <p className="truncate" style={{ fontSize: 12, color: '#636E72', marginTop: 4 }}>{p.disease}</p>
                  {p.hospital && <p style={{ fontSize: 11, color: '#B2BEC3', marginTop: 2 }}>{p.hospital}</p>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(108,92,231,0.05)' }}>
            <Pagination current={listPage} total={totalVisitedPages} onChange={setListPage} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          5. Patient Table
          ═══════════════════════════════════════════════════ */}
      <div className="gc" style={{ overflow: 'hidden' }}>
        <div className="gc-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="gc-icon" style={{ background: '#E8E5FF' }}>
              <User style={{ width: 18, height: 18, color: '#6C5CE7' }} />
            </div>
            <div className="gc-title">
              <h3>รายชื่อผู้ป่วยเยี่ยมบ้าน</h3>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="dt">
            <thead>
              <tr>
                <th>ชื่อ-สกุล</th>
                <th>อายุ</th>
                <th>เพศ</th>
                <th>กลุ่มโรค</th>
                <th>วันที่</th>
                <th>ผู้ส่ง</th>
                <th>รพ.</th>
                <th style={{ textAlign: 'center' }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTable.map((p, idx) => (
                <tr
                  key={`${p.id || idx}-${idx}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedPatient(p)}
                >
                  <td style={{ fontWeight: 600, color: '#2D3436' }}>{p.name}</td>
                  <td className="num">{p.age}</td>
                  <td>{p.gender}</td>
                  <td className="truncate" style={{ maxWidth: 180 }}>{p.disease}</td>
                  <td>{p.regDate}</td>
                  <td className="truncate" style={{ maxWidth: 140 }}>{p.registrar}</td>
                  <td className="truncate" style={{ maxWidth: 160 }}>{p.hospital}</td>
                  <td style={{ textAlign: 'center' }}>
                    {p.status === 'visited' ? (
                      <span className="badge b-green">
                        <CheckCircle style={{ width: 14, height: 14 }} /> เยี่ยมแล้ว
                      </span>
                    ) : (
                      <span className="badge b-orange">
                        <Clock style={{ width: 14, height: 14 }} /> รอรับงาน
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '0 24px', borderTop: '1px solid rgba(108,92,231,0.05)' }}>
          <Pagination current={tablePage} total={totalTablePages} onChange={setTablePage} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          6. Patient Detail Panel
          ═══════════════════════════════════════════════════ */}
      {selectedPatient && (
        <PatientDetail patient={PATIENT_DETAIL} onClose={() => setSelectedPatient(null)} />
      )}
    </div>
  );
}
