'use client';
import { useContext, useState } from 'react';
import ReactMapGL, {
  NavigationControl,
  Marker,
  Popup,
  ViewStateChangeEvent,
} from 'react-map-gl';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ViewportContext } from '@/contexts/ViewportContext';
import { Farm } from '@prisma/client';

interface FarmMapProps {
  farms: Farm[];
  filters: Set<string>;
}

const FarmMap = ({ farms, filters }: FarmMapProps) => {
  const { viewport, setViewport } = useContext(ViewportContext);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  const handleViewportChange = (viewport: ViewStateChangeEvent) => {
    setViewport(viewport.viewState);
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      style={{ width: '100%', height: 1000 }}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onMove={handleViewportChange}
    >
      {farms
        .filter((farm) => {
          if (!filters.size) return true;
          else {
            let contains = false;
            for (const product of farm.products) {
              if (product.analysis && filters.has(product.analysis.type)) {
                contains = true;
              }
            }
            return contains;
          }
        })
        .map((farm) => {
          return (
            <Marker
              key={farm.id}
              longitude={Number(farm.longitude)}
              latitude={Number(farm.latitude)}
              style={{
                cursor: 'pointer',
                color: 'green',
              }}
              onClick={() => setSelectedFarm(farm)}
            >
              <Image
                src="/seedling-solid.svg"
                alt="seedling"
                width={20}
                height={20}
              />
            </Marker>
          );
        })}
      {selectedFarm ? (
        <Popup
          longitude={Number(selectedFarm.longitude)}
          latitude={Number(selectedFarm.latitude)}
          onClose={() => setSelectedFarm(null)}
          closeOnClick={false}
          anchor="left"
        >
          <div style={{ background: 'green' }}>
            <h2>{selectedFarm.name}</h2>
            {/* <a href={selectedFarm.website}>{selectedFarm.website}</a> */}
          </div>
        </Popup>
      ) : null}
      <NavigationControl />
    </ReactMapGL>
  );
};

export default FarmMap;
