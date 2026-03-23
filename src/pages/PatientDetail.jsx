import { useState } from 'react';
import {
  X, Phone, MessageCircle, AlertTriangle, Heart, MapPin, User,
  Activity, Home, FileText, Pill, ChevronDown, ChevronRight, Plus,
  Calendar, Clock, CheckCircle, XCircle, ArrowLeft, HeartPulse,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

/* ─── Custom chart tooltip ─── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        borderRadius: 12,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        padding: '8px 12px',
        boxShadow: '0 4px 32px rgba(108,92,231,0.07)',
        border: '1px solid rgba(108,92,231,0.06)',
        fontSize: 12,
      }}
    >
      <p style={{ fontWeight: 700, color: '#B2BEC3', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontWeight: 700, color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function PatientDetail({ patient, onClose }) {
  const [activeTab, setActiveTab] = useState('vitalSign');
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [expandedAssessment, setExpandedAssessment] = useState(null);
  const [medView, setMedView] = useState('plan');

  const tabs = [
    { key: 'vitalSign', label: 'Vital Sign', icon: Activity },
    { key: 'homeVisit', label: 'การเยี่ยมบ้าน', icon: Home },
    { key: 'assessment', label: 'แบบประเมิน', icon: FileText },
    { key: 'medication', label: 'ติดตามการทานยา', icon: Pill },
  ];

  const activeTabStyle = {
    background: '#6C5CE7',
    color: 'white',
    borderRadius: '14px 14px 0 0',
    padding: '12px 20px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontFamily: 'inherit',
    boxShadow: '0 6px 24px rgba(108,92,231,0.25)',
  };

  const inactiveTabStyle = {
    color: '#B2BEC3',
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'inherit',
    borderRadius: '14px 14px 0 0',
  };

  return (
    <>
      {/* Backdrop */}
      <div className="overlay" onClick={onClose} />

      {/* Panel */}
      <div className="panel">
        {/* ═══ PANEL HEAD ═══ */}
        <div className="panel-head">
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={onClose}
                className="btn btn-ghost"
                style={{ width: 36, height: 36, padding: 0 }}
              >
                <ArrowLeft style={{ width: 20, height: 20 }} />
              </button>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2D3436' }}>
                ข้อมูลผู้ป่วย
              </h2>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ width: 36, height: 36, padding: 0 }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '0 24px' }}>
            {tabs.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => { setActiveTab(t.key); setSelectedVisit(null); }}
                  style={isActive ? activeTabStyle : inactiveTabStyle}
                >
                  <t.icon style={{ width: 16, height: 16 }} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ PANEL BODY ═══ */}
        <div className="panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>

            {/* ──────────────── LEFT SIDEBAR ──────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Profile card */}
              <div className="gc">
                <div className="gc-body" style={{ textAlign: 'center' }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 12px' }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 9999,
                        background: 'linear-gradient(135deg, #6C5CE7, #0984E3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 24,
                        fontWeight: 900,
                        boxShadow: '0 6px 24px rgba(108,92,231,0.25)',
                      }}
                    >
                      {patient.name?.charAt(0) || '?'}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        width: 28,
                        height: 28,
                        borderRadius: 9999,
                        background: '#74B9FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 12,
                        border: '3px solid #fff',
                      }}
                    >
                      {patient.gender === 'ชาย' ? '♂' : '♀'}
                    </div>
                  </div>

                  <h3 style={{ fontWeight: 700, color: '#2D3436' }}>
                    {patient.name || 'ไม่มีข้อมูล'}
                  </h3>
                  <p style={{ fontSize: 12, color: '#B2BEC3', marginTop: 2 }}>
                    HN: {patient.hn}
                  </p>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                    {[
                      { icon: Phone, bg: '#74B9FF' },
                      { icon: MessageCircle, bg: '#0984E3' },
                      { icon: AlertTriangle, bg: '#D63031' },
                    ].map(({ icon: Icon, bg }, i) => (
                      <button
                        key={i}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 9999,
                          background: bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 12px rgba(108,92,231,0.05)',
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        <Icon style={{ width: 16, height: 16 }} />
                      </button>
                    ))}
                  </div>

                  {/* Quick info 2x2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16, fontSize: 12 }}>
                    {[
                      { label: 'อายุ', value: patient.age ? `${patient.age} ปี` : '-', bg: '#E8E5FF' },
                      { label: 'เพศ', value: patient.gender || '-', bg: 'rgba(116,185,255,0.1)' },
                      { label: 'วันเกิด', value: patient.dob || '-', bg: '#E0FFF8' },
                      { label: 'หมู่เลือด', value: patient.bloodType || '-', bg: '#FFE8E8' },
                    ].map(({ label, value, bg }) => (
                      <div key={label} style={{ background: bg, borderRadius: 12, padding: 10 }}>
                        <p style={{ color: '#B2BEC3' }}>{label}</p>
                        <p style={{ fontWeight: 700, color: '#636E72', marginTop: 2 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info cards */}
              {[
                { icon: AlertTriangle, iconColor: '#D63031', bgIcon: '#FFE8E8', title: 'แพ้ยา', value: patient.allergies },
                { icon: Heart, iconColor: '#E84393', bgIcon: 'rgba(232,67,147,0.1)', title: 'โรคประจำตัว', value: patient.conditions },
                { icon: MapPin, iconColor: '#0984E3', bgIcon: 'rgba(116,185,255,0.15)', title: 'ที่อยู่', value: patient.address },
                { icon: User, iconColor: '#6C5CE7', bgIcon: '#E8E5FF', title: 'ผู้ติดต่อฉุกเฉิน', value: patient.emergencyContact },
              ].map(({ icon: Icon, iconColor, bgIcon, title, value }) => (
                <div key={title} className="gc" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div
                      className="gc-icon"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: bgIcon,
                      }}
                    >
                      <Icon style={{ width: 14, height: 14, color: iconColor }} />
                    </div>
                    <h4 style={{ fontWeight: 700, fontSize: 12, color: '#636E72' }}>{title}</h4>
                  </div>
                  <p style={{ fontSize: 14, color: '#636E72' }}>{value || '-'}</p>
                </div>
              ))}
            </div>

            {/* ──────────────── RIGHT CONTENT ──────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* ═══ TAB 1: VITAL SIGN ═══ */}
              {activeTab === 'vitalSign' && (
                <>
                  {/* Latest vitals 2x2 */}
                  <div className="gc">
                    <div className="gc-body">
                      <div className="gc-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <HeartPulse style={{ width: 16, height: 16, color: '#6C5CE7' }} />
                        <h3>ค่า Vital Sign ล่าสุด</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {[
                          {
                            label: 'ความดันโลหิต',
                            value: `${patient.vitalsign.bloodPressure.systolic}/${patient.vitalsign.bloodPressure.diastolic}`,
                            unit: 'mmHg',
                            status: patient.vitalsign.bloodPressure.status,
                            bgFrom: '#fef2f2',
                            borderColor: '#fecaca',
                          },
                          {
                            label: 'ออกซิเจนในเลือด',
                            value: patient.vitalsign.oxygenSaturation.value || '-',
                            unit: '%',
                            status: patient.vitalsign.oxygenSaturation.status,
                            bgFrom: '#eff6ff',
                            borderColor: '#bfdbfe',
                          },
                          {
                            label: 'อุณหภูมิ',
                            value: patient.vitalsign.temperature.value || '-',
                            unit: '°C',
                            status: patient.vitalsign.temperature.status,
                            bgFrom: '#fffbeb',
                            borderColor: '#fed7aa',
                          },
                          {
                            label: 'น้ำตาลในเลือด',
                            value: patient.vitalsign.bloodSugar.value || '-',
                            unit: 'mg/dL',
                            status: patient.vitalsign.bloodSugar.status,
                            bgFrom: '#f0fdf4',
                            borderColor: '#bbf7d0',
                          },
                        ].map((vs) => (
                          <div
                            key={vs.label}
                            style={{
                              padding: 16,
                              borderRadius: 12,
                              border: `1px solid ${vs.borderColor}`,
                              background: `linear-gradient(135deg, ${vs.bgFrom}, white)`,
                              transition: 'box-shadow 0.2s ease',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#636E72' }}>
                                {vs.label}
                              </span>
                              <span
                                className={`badge ${vs.status === 'normal' ? 'b-green' : 'b-red'}`}
                                style={{ fontSize: 10, padding: '2px 8px' }}
                              >
                                {vs.status === 'normal' ? 'ปกติ' : 'ผิดปกติ'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className="num" style={{ fontSize: 24, fontWeight: 900, color: '#2D3436' }}>
                                {vs.value}
                              </span>
                              <span style={{ fontSize: 12, color: '#B2BEC3' }}>
                                {vs.unit}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 7-day trend chart */}
                  <div className="gc">
                    <div className="gc-body">
                      <div className="gc-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Activity style={{ width: 16, height: 16, color: '#6C5CE7' }} />
                        <h3>แนวโน้ม 7 วัน - ความดันโลหิต</h3>
                      </div>
                      <div style={{ height: 192 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={patient.vitalsignTrend}
                            margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                              dataKey="day"
                              tick={{ fontSize: 11, fill: '#94a3b8' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{ fontSize: 11, fill: '#94a3b8' }}
                              axisLine={false}
                              tickLine={false}
                              domain={[60, 180]}
                            />
                            <Tooltip content={<ChartTooltip />} />
                            <ReferenceLine y={120} stroke="#00B894" strokeDasharray="4 4" strokeWidth={1} />
                            <ReferenceLine y={80} stroke="#74B9FF" strokeDasharray="4 4" strokeWidth={1} />
                            <Line
                              type="monotone"
                              dataKey="systolic"
                              name="Systolic"
                              stroke="#D63031"
                              strokeWidth={2}
                              strokeDasharray="6 3"
                              dot={{ r: 3, fill: '#D63031', stroke: '#fff', strokeWidth: 2 }}
                              connectNulls
                            />
                            <Line
                              type="monotone"
                              dataKey="diastolic"
                              name="Diastolic"
                              stroke="#74B9FF"
                              strokeWidth={2}
                              strokeDasharray="6 3"
                              dot={{ r: 3, fill: '#74B9FF', stroke: '#fff', strokeWidth: 2 }}
                              connectNulls
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8, fontSize: 12, color: '#636E72' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 16, height: 0, borderTop: '2px dashed #D63031', display: 'inline-block' }} />
                          Systolic
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 16, height: 0, borderTop: '2px dashed #74B9FF', display: 'inline-block' }} />
                          Diastolic
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ═══ TAB 2: HOME VISIT - LIST ═══ */}
              {activeTab === 'homeVisit' && !selectedVisit && (
                <div className="gc">
                  <div className="gc-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div className="gc-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock style={{ width: 16, height: 16, color: '#6C5CE7' }} />
                        <h3>ประวัติการเยี่ยมบ้าน</h3>
                      </div>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 12, fontWeight: 700, color: '#6C5CE7', background: '#E8E5FF', padding: '6px 12px', height: 'auto', borderRadius: 8 }}
                      >
                        <Calendar style={{ width: 14, height: 14 }} /> 2569
                      </button>
                    </div>

                    <p style={{ fontSize: 12, fontWeight: 700, color: '#B2BEC3', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                      มีนาคม 2569
                    </p>

                    {patient.homeVisits.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVisit(v)}
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          padding: 16,
                          borderRadius: 12,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: '1px solid #E8E5FF',
                          background: 'linear-gradient(135deg, rgba(108,92,231,0.06), white)',
                          marginBottom: 8,
                        }}
                      >
                        {/* Timeline dot */}
                        <div
                          style={{
                            marginTop: 4,
                            width: 12,
                            height: 12,
                            borderRadius: 9999,
                            background: '#A29BFE',
                            boxShadow: '0 0 0 4px rgba(162,155,254,0.2)',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#2D3436' }}>{v.date}</p>
                          <p style={{ fontSize: 12, color: '#636E72', marginTop: 2 }}>
                            ประเภท: {v.type} &middot; ผู้เยี่ยม: {v.visitor}
                          </p>
                          <p
                            className="truncate"
                            style={{
                              fontSize: 12,
                              color: '#B2BEC3',
                              marginTop: 4,
                            }}
                          >
                            {v.objectives}
                          </p>
                        </div>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 12,
                            background: '#E8E5FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            cursor: 'pointer',
                            transition: 'background 0.2s ease',
                          }}
                        >
                          <Plus style={{ width: 16, height: 16, color: '#6C5CE7' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ TAB 2: HOME VISIT - DETAIL ═══ */}
              {activeTab === 'homeVisit' && selectedVisit && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <button
                    onClick={() => setSelectedVisit(null)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#6C5CE7',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    <ArrowLeft style={{ width: 16, height: 16 }} /> กลับ
                  </button>

                  <div className="gc">
                    <div className="gc-body">
                      <div className="gc-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <FileText style={{ width: 16, height: 16, color: '#6C5CE7' }} />
                        <h3>รายละเอียดการเยี่ยมบ้าน</h3>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        {[
                          { label: 'วัน-เวลาเยี่ยม', value: selectedVisit.date },
                          { label: 'ประเภทการเยี่ยม', value: selectedVisit.type },
                          { label: 'HN', value: selectedVisit.hn },
                          { label: 'ผู้เยี่ยม', value: selectedVisit.visitor },
                        ].map((f) => (
                          <div
                            key={f.label}
                            style={{ background: '#FAFAFF', borderRadius: 12, padding: 12 }}
                          >
                            <p style={{ fontSize: 11, fontWeight: 600, color: '#B2BEC3', textTransform: 'uppercase' }}>
                              {f.label}
                            </p>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#636E72', marginTop: 4 }}>
                              {f.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Objectives */}
                      <div
                        style={{
                          borderRadius: 12,
                          padding: 16,
                          marginBottom: 16,
                          background: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
                          border: '1px solid rgba(251,191,36,0.2)',
                        }}
                      >
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                          วัตถุประสงค์การเยี่ยม
                        </p>
                        <p style={{ fontSize: 14, color: '#78350f', fontWeight: 500 }}>
                          {selectedVisit.objectives}
                        </p>
                      </div>

                      {selectedVisit.medicalInfo && (
                        <div style={{ marginBottom: 12 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#B2BEC3', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                            ข้อมูลทางการแพทย์
                          </p>
                          <p style={{ fontSize: 14, color: '#636E72' }}>
                            {selectedVisit.medicalInfo}
                          </p>
                        </div>
                      )}

                      {selectedVisit.reason && (
                        <div style={{ marginBottom: 12 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#B2BEC3', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                            สาเหตุการส่งเยี่ยม
                          </p>
                          <p style={{ fontSize: 14, color: '#636E72' }}>
                            {selectedVisit.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ TAB 3: ASSESSMENT ═══ */}
              {activeTab === 'assessment' && (
                <div className="gc">
                  <div className="gc-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div className="gc-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText style={{ width: 16, height: 16, color: '#6C5CE7' }} />
                        <h3>ประวัติการประเมิน</h3>
                      </div>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 12, fontWeight: 700, color: '#6C5CE7', background: '#E8E5FF', padding: '6px 12px', height: 'auto', borderRadius: 8 }}
                      >
                        <Calendar style={{ width: 14, height: 14 }} /> 2026
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {patient.assessments.map((a) => (
                        <div key={a.id}>
                          <div
                            onClick={() => setExpandedAssessment(expandedAssessment === a.id ? null : a.id)}
                            style={{
                              display: 'flex',
                              gap: 12,
                              alignItems: 'flex-start',
                              padding: 16,
                              borderRadius: 12,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              border: '1px solid rgba(108,92,231,0.06)',
                              background: expandedAssessment === a.id
                                ? 'linear-gradient(135deg, rgba(108,92,231,0.06), white)'
                                : 'white',
                            }}
                          >
                            <div
                              className="gc-icon"
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 12,
                                background: a.status === 'done' ? '#E0FFF8' : '#FFE8E8',
                              }}
                            >
                              {a.status === 'done' ? (
                                <CheckCircle style={{ width: 16, height: 16, color: '#00B894' }} />
                              ) : (
                                <XCircle style={{ width: 16, height: 16, color: '#D63031' }} />
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, color: '#2D3436' }}>{a.name}</p>
                              <p style={{ fontSize: 12, color: '#636E72', marginTop: 2 }}>
                                {a.date} &middot; {a.assessor}
                              </p>
                              <span
                                className={`badge ${a.status === 'done' ? 'b-green' : 'b-red'}`}
                                style={{ marginTop: 6, fontSize: 11 }}
                              >
                                {a.status === 'done' ? 'ประเมินแล้ว' : 'ไม่ได้ประเมิน'}
                              </span>
                            </div>
                            <ChevronDown
                              style={{
                                width: 16,
                                height: 16,
                                color: '#B2BEC3',
                                flexShrink: 0,
                                transition: 'transform 0.2s ease',
                                transform: expandedAssessment === a.id ? 'rotate(180deg)' : 'rotate(0)',
                              }}
                            />
                          </div>

                          {/* Expanded score */}
                          {expandedAssessment === a.id && a.score != null && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginLeft: 48,
                                marginTop: 8,
                                padding: 16,
                                borderRadius: 12,
                                background: '#E8E5FF',
                                border: '1px solid rgba(162,155,254,0.3)',
                              }}
                            >
                              <div className="num" style={{ fontSize: 28, fontWeight: 900, color: '#6C5CE7' }}>
                                {a.score}
                              </div>
                              <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: '#636E72' }}>คะแนน</p>
                                {a.summary && (
                                  <p style={{ fontSize: 14, color: '#636E72', marginTop: 2 }}>{a.summary}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ TAB 4: MEDICATION ═══ */}
              {activeTab === 'medication' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Sub-toggle */}
                  <div className="seg">
                    {[
                      { k: 'plan', l: 'แผนการทานยา' },
                      { k: 'data', l: 'ข้อมูลการทานยา' },
                    ].map((t) => (
                      <button
                        key={t.k}
                        onClick={() => setMedView(t.k)}
                        className={`seg-btn ${medView === t.k ? 'active' : ''}`}
                      >
                        {t.l}
                      </button>
                    ))}
                  </div>

                  {/* Plan view */}
                  {medView === 'plan' && (
                    <div className="gc">
                      <div className="gc-body">
                        <div className="gc-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                          <Calendar style={{ width: 16, height: 16, color: '#6C5CE7' }} />
                          <h3>แผนการทานยา</h3>
                        </div>

                        {/* Mini calendar */}
                        <div
                          style={{
                            borderRadius: 12,
                            padding: 16,
                            background: '#FAFAFF',
                            border: '1px solid rgba(108,92,231,0.06)',
                            marginBottom: 20,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <button
                              className="btn btn-ghost"
                              style={{ width: 28, height: 28, padding: 0, borderRadius: 6 }}
                            >
                              <ChevronRight style={{ width: 16, height: 16, transform: 'rotate(180deg)' }} />
                            </button>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#636E72' }}>
                              1 มกราคม 2568
                            </p>
                            <button
                              className="btn btn-ghost"
                              style={{ width: 28, height: 28, padding: 0, borderRadius: 6 }}
                            >
                              <ChevronRight style={{ width: 16, height: 16 }} />
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontSize: 12, textAlign: 'center' }}>
                            {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d) => (
                              <div key={d} style={{ padding: '6px 0', color: '#B2BEC3', fontWeight: 700 }}>
                                {d}
                              </div>
                            ))}
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <div
                                key={d}
                                style={{
                                  padding: '8px 0',
                                  borderRadius: 8,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  background: d === 1 ? '#6C5CE7' : 'transparent',
                                  color: d === 1 ? '#fff' : '#636E72',
                                  fontWeight: d === 1 ? 700 : 400,
                                }}
                              >
                                {d}
                                {d <= 2 && (
                                  <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 2 }}>
                                    {[1, 2, 3].map((x) => (
                                      <span
                                        key={x}
                                        className="dot"
                                        style={{
                                          width: 4,
                                          height: 4,
                                          background: x <= 2 ? '#00B894' : '#D63031',
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Daily drug list */}
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#B2BEC3', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                          รายการยาประจำวัน
                        </p>
                        {patient.medications[0]?.drugs.map((drug) => (
                          <div
                            key={drug.name}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: 12,
                              borderRadius: 12,
                              marginBottom: 8,
                              border: '1px solid rgba(108,92,231,0.06)',
                              transition: 'box-shadow 0.2s ease',
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 9999,
                                background: 'linear-gradient(135deg, rgba(116,185,255,0.15), #E8E5FF)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Pill style={{ width: 16, height: 16, color: '#6C5CE7' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p className="truncate" style={{ fontSize: 14, fontWeight: 700, color: '#2D3436' }}>
                                {drug.name}
                              </p>
                              <p style={{ fontSize: 12, color: '#B2BEC3' }}>{drug.dosage}</p>
                            </div>
                            <span
                              className="badge b-purple"
                              style={{ flexShrink: 0, fontSize: 11, fontWeight: 700 }}
                            >
                              {drug.total} เม็ด
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data view */}
                  {medView === 'data' && (
                    <div className="gc">
                      <div className="gc-body">
                        <div className="gc-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                          <Pill style={{ width: 16, height: 16, color: '#6C5CE7' }} />
                          <h3>ข้อมูลการทานยา</h3>
                        </div>

                        {patient.medications.map((med) => (
                          <div
                            key={med.vn}
                            style={{
                              padding: 16,
                              borderRadius: 12,
                              marginBottom: 12,
                              border: '1px solid #E8E5FF',
                              background: 'linear-gradient(135deg, rgba(108,92,231,0.06), white)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, color: '#2D3436' }}>
                                VN: {med.vn}
                              </p>
                              <span style={{ fontSize: 11, color: '#B2BEC3' }}>
                                {med.serviceDate}
                              </span>
                            </div>
                            <p style={{ fontSize: 12, color: '#636E72', marginBottom: 12 }}>
                              ผู้ส่ง: {med.sender}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {med.drugs.map((d) => (
                                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                  <span
                                    className="dot"
                                    style={{ background: '#A29BFE' }}
                                  />
                                  <span style={{ color: '#636E72', fontWeight: 500 }}>{d.name}</span>
                                  <span style={{ color: '#B2BEC3' }}>({d.dosage})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
