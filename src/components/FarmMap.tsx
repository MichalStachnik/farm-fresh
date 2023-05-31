'use client';
import { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup, ViewStateChangeEvent } from 'react-map-gl';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Farm {
  _id: string;
  name: string;
  latitude: string;
  longitude: string;
  website: string;
}

const initialViewport = {
  latitude: 41.5,
  longitude: -73.5,
  zoom: 9,
};

const FarmMap = () => {
  const [viewport, setViewport] = useState(initialViewport);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  const fetchFarms = async () => {
    const res: Response = await fetch('/api');
    const data = await res.json();
    // console.log('data', data);
    // console.log('data.farms', data.farms);
    setFarms(data.farms);
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleViewportChange = (viewport: ViewStateChangeEvent) => {
    setViewport(viewport.viewState);
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      style={{ width: 1000, height: 1000 }}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onMove={handleViewportChange}
    >
      {farms.map((farm) => {
        return (
          <Marker
            key={farm._id}
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
            <a href={selectedFarm.website}>{selectedFarm.website}</a>
          </div>
        </Popup>
      ) : null}
    </ReactMapGL>
  );
};

export default FarmMap;
