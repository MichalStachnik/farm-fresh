'use client';
import { Crosshair } from 'react-feather';

export default function LocationButton() {
  const handleLocationClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position);
    });
  };
  return (
    <button onClick={handleLocationClick}>
      <Crosshair />
    </button>
  );
}
