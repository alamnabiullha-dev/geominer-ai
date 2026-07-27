import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({ lat, lng, onPick }) {
  const center = lat && lng ? [lat, lng] : [20, 0];
  return (
    <div className="rounded-xl overflow-hidden border border-surface-border" style={{ height: 260 }}>
      <MapContainer center={center} zoom={lat && lng ? 9 : 2} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <ClickHandler onPick={onPick} />
        {lat && lng && <Marker position={[lat, lng]} />}
      </MapContainer>
    </div>
  );
}
