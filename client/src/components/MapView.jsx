import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons under Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const riskColor = { Low: "#22C55E", Medium: "#F59E0B", High: "#EF4444" };

export default function MapView({ surveyLat, surveyLng, drillSites = [], height = 420 }) {
  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-surface-border">
      <MapContainer center={[surveyLat, surveyLng]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <Marker position={[surveyLat, surveyLng]}>
          <Popup>Survey location</Popup>
        </Marker>

        {drillSites.map((s) => (
          <Circle
            key={s.rank}
            center={[s.latitude, s.longitude]}
            radius={800}
            pathOptions={{
              color: riskColor[s.risk] || "#2563EB",
              fillColor: riskColor[s.risk] || "#2563EB",
              fillOpacity: 0.35,
            }}
          >
            <Popup>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold">#{s.rank} — {s.mineralType}</p>
                <p>Probability: {(s.probability * 100).toFixed(0)}%</p>
                <p>Depth: {s.estimatedDepthM} m</p>
                <p>Risk: {s.risk}</p>
                <p>ROI: {s.roiPct}%</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
