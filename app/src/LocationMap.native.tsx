import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Props = { lat: number; lng: number; onChange: (lat: number, lng: number) => void };

// Tap the map or drag the pin to choose the exact spot.
export default function LocationMap({ lat, lng, onChange }: Props) {
  const ref = React.useRef<MapView>(null);
  React.useEffect(() => {
    ref.current?.animateToRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 400);
  }, [lat, lng]);
  return (
    <View style={{ height: 210, borderRadius: 20, overflow: 'hidden' }}>
      <MapView
        ref={ref}
        style={{ flex: 1 }}
        initialRegion={{ latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        onPress={(e) => onChange(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          draggable
          onDragEnd={(e) => onChange(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}
        />
      </MapView>
    </View>
  );
}
