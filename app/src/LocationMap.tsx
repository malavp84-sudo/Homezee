// Web / default map: an OpenStreetMap embed centred on the chosen point.
// (On phones, LocationMap.native.tsx is used instead and has a draggable pin.)
import React from 'react';
import { View } from 'react-native';

type Props = { lat: number; lng: number; onChange: (lat: number, lng: number) => void };

export default function LocationMap({ lat, lng }: Props) {
  const d = 0.008;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d},${lat - d},${lng + d},${lat + d}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <View style={{ height: 210, borderRadius: 20, overflow: 'hidden' }}>
      {React.createElement('iframe', { src, style: { border: 0, width: '100%', height: '100%' }, title: 'map' })}
    </View>
  );
}
