import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);

  // Fetch pokemons with a limit
  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        const data = await response.json();
        setPokemons(data.results);
      } catch (error) {
        console.error('Error fetching pokemons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemons();
  }, [limit]);

  // Fetch pokemon types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        const data = await response.json();
        setTypes(data.results);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };
    fetchTypes();
  }, []);

  // Fetch pokemons by type when a type is selected
  useEffect(() => {
    if (selectedType) {
      const fetchPokemonsByType = async () => {
        setLoading(true);
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
          const data = await response.json();
          const filteredPokemons = data.pokemon.map(p => p.pokemon);
          setPokemons(filteredPokemons);
        } catch (error) {
          console.error('Error fetching pokemons by type:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPokemonsByType();
    }
  }, [selectedType]);

  // Render individual pokemon
  const renderPokemon = ({ item }) => (
    <View style={styles.pokemonItem}>
      <Text style={styles.pokemonName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémon List</Text>

      {/* Picker for Pokémon Types */}
      <Picker
        selectedValue={selectedType}
        onValueChange={(itemValue) => setSelectedType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a type" value="" />
        {types.map((type) => (
          <Picker.Item key={type.name} label={type.name} value={type.name} />
        ))}
      </Picker>

      {/* Limit Control */}
      <View style={styles.limitControl}>
        <TouchableOpacity onPress={() => setLimit(limit + 20)} style={styles.limitButton}>
          <Text style={styles.limitButtonText}>Load More (Limit: {limit})</Text>
        </TouchableOpacity>
      </View>

      {/* Pokémon List */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={pokemons}
          renderItem={renderPokemon}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.pokemonList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  limitControl: {
    marginBottom: 20,
    alignItems: 'center',
  },
  limitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  limitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pokemonList: {
    paddingBottom: 20,
  },
  pokemonItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#e2e6ea',
    borderRadius: 8,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default PokemonList;
