import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const pulseIcon = (color, size = 12) => L.divIcon({
  className: '',
  iconSize: [size * 4, size * 4],
  iconAnchor: [size * 2, size * 2],
  html: `
    <div style="position:relative;width:${size * 4}px;height:${size * 4}px;display:flex;align-items:center;justify-content:center;">
      <div style="
        position:absolute;
        width:${size * 3}px;height:${size * 3}px;
        border-radius:50%;
        background:${color};
        opacity:0.15;
        animation:pulseRing 2s ease-out infinite;
      "></div>
      <div style="
        position:absolute;
        width:${size * 2.2}px;height:${size * 2.2}px;
        border-radius:50%;
        background:${color};
        opacity:0.25;
        animation:pulseRing 2s ease-out 0.4s infinite;
      "></div>
      <div style="
        position:relative;
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:${color};
        border:2.5px solid white;
        box-shadow:0 2px 8px ${color}80;
        z-index:2;
      "></div>
    </div>
    <style>
      @keyframes pulseRing {
        0% { transform:scale(0.5); opacity:0.4; }
        70% { transform:scale(1); opacity:0; }
        100% { transform:scale(1); opacity:0; }
      }
    </style>
  `,
});

const normalIcon = (color, size = 10) => L.divIcon({
  className: '',
  iconSize: [size * 2, size * 2],
  iconAnchor: [size, size],
  html: `
    <div style="
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:${color};
      border:2px solid white;
      box-shadow:0 2px 6px ${color}40;
      margin:${size / 2}px;
    "></div>
  `,
});

export function AbnormalMarker({ position, children }) {
  return (
    <Marker position={position} icon={pulseIcon('#D63031', 12)}>
      {children}
    </Marker>
  );
}

export function NormalMarker({ position, children, color = '#00B894' }) {
  return (
    <Marker position={position} icon={normalIcon(color, 10)}>
      {children}
    </Marker>
  );
}
