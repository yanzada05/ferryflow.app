import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MiniMap({ latitude = -12.98, longitude = -38.51 }: { latitude?: number, longitude?: number }) {
  return (
    <View style={{height:140, borderRadius:12, overflow:'hidden', marginTop:8}}>
      <MapView style={{flex:1}} initialRegion={{latitude, longitude, latitudeDelta:0.05, longitudeDelta:0.05}}>
        <Marker coordinate={{latitude, longitude}} />
      </MapView>
    </View>
  );
}
