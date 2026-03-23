import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export default function HeatLayer({ points, options = {} }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const heat = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 10,
      max: 1.0,
      gradient: {
        0.2: '#A29BFE',
        0.4: '#6C5CE7',
        0.6: '#E17055',
        0.8: '#D63031',
        1.0: '#FF7675',
      },
      ...options,
    });

    heat.addTo(map);
    return () => { map.removeLayer(heat); };
  }, [map, points, options]);

  return null;
}
