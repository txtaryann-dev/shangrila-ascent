import { MapContainer, GeoJSON, CircleMarker, Tooltip, ZoomControl } from "react-leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Layer, PathOptions } from "leaflet";
import { useMemo } from "react";
import provincesData from "@/lib/nepal-provinces.json";
import "leaflet/dist/leaflet.css";

export type Hub = {
  city: string;
  code: string;
  lat: number;
  lng: number;
  eta: string;
};

const PROVINCE_COLORS: Record<string, string> = {
  Koshi:         "hsl(150 35% 70%)",
  Madhesh:       "hsl(20 60% 65%)",
  Bagmati:       "hsl(10 75% 75%)",
  Gandaki:       "hsl(215 45% 70%)",
  Lumbini:       "hsl(45 70% 65%)",
  Karnali:       "hsl(280 35% 75%)",
  Sudurpashchim: "hsl(170 35% 70%)",
};

type Props = {
  hubs: Hub[];
  active: number;
  onSelect: (i: number) => void;
};

export const NepalMap = ({ hubs, active, onSelect }: Props) => {
  const data = provincesData as unknown as FeatureCollection<Geometry, { name: string; id: string }>;

  const styleFn = useMemo(
    () =>
      (feature?: Feature<Geometry, { name: string }>): PathOptions => ({
        fillColor: PROVINCE_COLORS[feature?.properties.name ?? ""] ?? "hsl(210 20% 80%)",
        weight: 0.8,
        color: "hsl(0 0% 25%)",
        fillOpacity: 0.55,
      }),
    []
  );

  const onEachFeature = (feature: Feature<Geometry, { name: string }>, layer: Layer) => {
    layer.bindTooltip(feature.properties.name, { sticky: true, className: "!bg-background !text-foreground !border-border" });
  };

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={[28.3, 84.1]}
        zoom={6}
        minZoom={6}
        maxZoom={9}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%", background: "transparent" }}
      >
        <ZoomControl position="bottomright" />
        <GeoJSON data={data} style={styleFn} onEachFeature={onEachFeature} />
        {hubs.map((h, i) => (
          <CircleMarker
            key={h.code}
            center={[h.lat, h.lng]}
            radius={i === active ? 9 : 6}
            pathOptions={{
              color: i === active ? "hsl(var(--accent))" : "hsl(var(--foreground))",
              fillColor: h.eta === "Same day" ? "hsl(150 70% 50%)" : "hsl(var(--accent))",
              fillOpacity: 1,
              weight: i === active ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect(i) }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1} permanent={i === active}>
              <span className="text-xs font-semibold">{h.city}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="pointer-events-none absolute top-3 left-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground z-[400]">
        Network · Nepal (2020 boundary)
      </div>
    </div>
  );
};
