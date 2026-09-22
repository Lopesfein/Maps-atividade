import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const INICIAL = {
  latitude: -30.0346,
  longitude: -51.2177,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

const PONTOS = [
  {
    id: '1',
    nome: 'Hotel',
    descricao: 'Hotel localizado na Av. Unisinos, próximo à escola.',
    latitude: -29.7924,
    longitude: -51.1500,
  },
  {
    id: '2',
    nome: 'Pizzaria',
    descricao: 'Pizzaria localizada na Av. Unisinos.',
    latitude: -29.7928,
    longitude: -51.1497,
  },
  {
    id: '3',
    nome: 'Livraria',
    descricao: 'Livraria localizada no campus da Unisinos.',
    latitude: -29.7928,
    longitude: -51.1510,
  },
];

export default function Mapa() {
  const [regiao, setRegiao] = useState(INICIAL);
  const [localAtual, setLocalAtual] = useState(null);
  const [aviso, setAviso] = useState('Obtendo localização...');

  useEffect(() => {
    let ativo = true;

    async function localizar() {
      try {
        const permissao =
          await Location.requestForegroundPermissionsAsync();

        if (permissao.status !== 'granted') {
          if (ativo) {
            setAviso('Permissão negada. Mapa padrão.');
          }
          return;
        }

        const pos = await Location.getCurrentPositionAsync({});

        if (!ativo) return;

        const coord = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        setLocalAtual(coord);

        setRegiao({
          ...coord,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        setAviso('Localização encontrada');
      } catch (erro) {
        if (ativo) {
          setAviso('GPS indisponível. Mapa padrão.');
        }
      }
    }

    localizar();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <View style={styles.tela}>
      <Text style={styles.aviso}>{aviso}</Text>

      <MapView
        style={styles.mapa}
        region={regiao}
        onRegionChangeComplete={setRegiao}
      >
        {/* Localização atual */}
        {localAtual && (
          <Marker
            coordinate={localAtual}
            title="Você está aqui"
          />
        )}

        {/* Lugares cadastrados */}
        {PONTOS.map((p) => (
          <Marker
            key={p.id}
            coordinate={{
              latitude: p.latitude,
              longitude: p.longitude,
            }}
            title={p.nome}
            description={p.descricao}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },

  mapa: {
    flex: 1,
  },

  aviso: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    fontSize: 16,
  },
});