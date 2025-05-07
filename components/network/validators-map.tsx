"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import type { Validator } from "@/lib/types/network";
import { validatorCoordinates } from "@/lib/mock/validator";

// World map GeoJSON
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface ValidatorsMapProps {
  validators?: Validator[];
}

export default function ValidatorsMap({ validators }: ValidatorsMapProps) {
  // State for position and zoom
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Handle position changes from ZoomableGroup
  const handleMoveEnd = useCallback((position: any) => {
    setPosition(position);
  }, []);

  // Wheel event handler to prevent scroll propagation to the page
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (mapRef.current?.contains(e.target as Node)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // Get only validators with assigned coordinates
  const validatorsWithCoordinates = validators?.filter(
    (v) => validatorCoordinates[v.bandersnatch] !== undefined
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <div className="flex justify-between items-center">
          <CardTitle>Validators World Map</CardTitle>
        </div>
        <div className="text-xs text-gray-500">
          {validators?.length} active validators
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          ref={mapRef}
          className="relative h-[400px] md:h-[500px] overflow-hidden"
          onWheel={handleWheel}
        >
          <ComposableMap
            projection="geoEqualEarth"
            width={1000}
            height={500}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates as [number, number]}
              onMoveEnd={handleMoveEnd}
              filterZoomEvent={(evt) => {
                // Allow wheel/trackpad zoom events but prevent them from scrolling the page
                // Return true = enable zoom, false = disable zoom
                return true;
              }}
              // Set reasonable zoom limits
              minZoom={1}
              maxZoom={4}
              // Limit translateExtent to avoid errors at the edges of the map
              translateExtent={[
                [-1000, -1000],
                [1000, 1000],
              ]}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey || Math.random().toString()}
                      geography={geo}
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {validatorsWithCoordinates?.map((validator) => {
                const coordinates =
                  validatorCoordinates[validator.bandersnatch];
                if (!coordinates) return null;

                const scale = 1 / Math.sqrt(position.zoom);
                return (
                  <Marker
                    key={validator.bandersnatch}
                    coordinates={coordinates}
                  >
                    <g>
                      <circle
                        r={5 * scale}
                        fill="#10b981"
                        stroke="#fff"
                        strokeWidth={1 * scale}
                        className="animate-pulse"
                      />
                      <text
                        textAnchor="middle"
                        y={-8 * scale}
                        style={{
                          fontFamily: "system-ui",
                          fill: "#fff",
                          fontSize: `${10 * scale}px`,
                          fontWeight: "bold",
                          textShadow: "0px 0px 3px #000",
                        }}
                      >
                        {validator.name || validator.bandersnatch}
                      </text>
                    </g>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </CardContent>
    </Card>
  );
}
