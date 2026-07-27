import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Grid } from "@react-three/drei";
import { FiRotateCcw } from "react-icons/fi";

function RockLayer({ layer, opacity, visible }) {
  if (!visible) return null;
  const height = Math.abs(layer.y_top - layer.y_bottom);
  const yCenter = (layer.y_top + layer.y_bottom) / 2;
  return (
    <mesh position={[0, yCenter, 0]}>
      <boxGeometry args={[380, height, 380]} />
      <meshStandardMaterial color={layer.color} transparent opacity={opacity} />
    </mesh>
  );
}

function MineralBody({ body, visible }) {
  if (!visible) return null;
  return (
    <group position={[body.center.x, body.center.y, body.center.z]}>
      <mesh>
        <cylinderGeometry args={[body.radius, body.radius * 0.7, body.height, 24]} />
        <meshStandardMaterial color={body.color} emissive={body.color} emissiveIntensity={0.35} />
      </mesh>
      <Text position={[0, body.height / 2 + 18, 0]} fontSize={12} color={body.color} anchorX="center">
        {body.mineral}
      </Text>
    </group>
  );
}

function FaultLine({ fault, bounds, visible }) {
  if (!visible) return null;
  const rad = (fault.angle_deg * Math.PI) / 180;
  return (
    <mesh position={[fault.x, -bounds.height / 2, 0]} rotation={[0, 0, rad]}>
      <planeGeometry args={[bounds.height * 1.3, 4]} />
      <meshBasicMaterial color="#F87171" transparent opacity={0.4} side={2} />
    </mesh>
  );
}

function WaterTable({ y, bounds, visible }) {
  if (!visible) return null;
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[bounds.width, bounds.depth]} />
      <meshStandardMaterial color="#38BDF8" transparent opacity={0.25} side={2} />
    </mesh>
  );
}

export default function ThreeDModel({ data }) {
  const [opacity, setOpacity] = useState(0.85);
  const [layersOn, setLayersOn] = useState(true);
  const [mineralOn, setMineralOn] = useState(true);
  const [faultsOn, setFaultsOn] = useState(true);
  const [waterOn, setWaterOn] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const { bounds, rock_layers, mineral_body, fault_lines, water_table_y } = data;

  const controls = useMemo(
    () => [
      { label: "Rock Layers", value: layersOn, set: setLayersOn },
      { label: "Mineral Body", value: mineralOn, set: setMineralOn },
      { label: "Fault Lines", value: faultsOn, set: setFaultsOn },
      { label: "Water Table", value: waterOn, set: setWaterOn },
    ],
    [layersOn, mineralOn, faultsOn, waterOn]
  );

  return (
    <div className="relative rounded-xl overflow-hidden border border-surface-border bg-[#060b18]" style={{ height: 460 }}>
      <Canvas key={resetKey} camera={{ position: [420, 220, 420], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[200, 300, 200]} intensity={1.1} />
        <pointLight position={[-200, -100, -200]} intensity={0.3} color="#2563EB" />

        {rock_layers.map((l, i) => (
          <RockLayer key={i} layer={l} opacity={opacity} visible={layersOn} />
        ))}
        <MineralBody body={mineral_body} visible={mineralOn} />
        {fault_lines.map((f, i) => (
          <FaultLine key={i} fault={f} bounds={bounds} visible={faultsOn} />
        ))}
        <WaterTable y={water_table_y} bounds={bounds} visible={waterOn} />

        <Grid args={[400, 400]} position={[0, 2, 0]} cellColor="#1F2A44" sectionColor="#2563EB" fadeDistance={500} />
        <OrbitControls enablePan enableZoom enableRotate minDistance={100} maxDistance={900} />
      </Canvas>

      <div className="absolute top-3 left-3 glass-card p-3 space-y-2 text-xs w-48">
        {controls.map((c) => (
          <label key={c.label} className="flex items-center justify-between gap-2 text-slate-300 cursor-pointer">
            {c.label}
            <input type="checkbox" checked={c.value} onChange={() => c.set((v) => !v)} className="accent-primary-600" />
          </label>
        ))}
        <div>
          <p className="text-slate-400 mb-1">Layer transparency</p>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full accent-primary-600"
          />
        </div>
      </div>

      <button
        onClick={() => setResetKey((k) => k + 1)}
        className="absolute top-3 right-3 glass-card px-3 py-2 flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
      >
        <FiRotateCcw size={13} /> Reset view
      </button>

      <p className="absolute bottom-3 left-3 text-[11px] text-slate-500">Drag to rotate · Scroll to zoom · Right-click to pan</p>
    </div>
  );
}
