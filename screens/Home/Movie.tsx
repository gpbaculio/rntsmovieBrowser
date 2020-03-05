import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {OnMoviePressType} from '.';

export interface MovieType {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

type MovieProps = {
  movie: MovieType;
  onPress: OnMoviePressType;
};

const Movie: React.FC<MovieProps> = ({movie, onPress}) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => onPress({id: movie.imdbID, title: movie.Title})}>
    <Image
      source={{
        uri: `${movie.Poster}`,
        cache: 'only-if-cached',
      }}
      style={styles.movieImg}
    />
    <View style={styles.dataContainer}>
      <Text style={styles.movieTitle}>{movie.Title}</Text>
      <Text>{`${movie.Year} (${movie.Type})`}</Text>
    </View>
  </TouchableOpacity>
);

export default Movie;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
    width: '100%',
  },
  movieImg: {width: 50, height: 50},
  dataContainer: {
    marginLeft: 5,
    flex: 1,
    alignItems: 'flex-start',
  },
  movieTitle: {
    width: '100%',
    flexGrow: 1,
    flex: 1,
    fontWeight: 'bold',
  },
});
