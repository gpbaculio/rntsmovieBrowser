import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {AppStackParamListType} from 'App';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import axios from 'axios';
import {apiKey} from './constants';
import { ScrollView } from 'react-native-gesture-handler';

type MovieScreenNavigationProp = StackNavigationProp<
  AppStackParamListType,
  'Movie'
>;

type MovieScreenRouteProp = RouteProp<AppStackParamListType, 'Movie'>;

type MovieProps = {
  navigation: MovieScreenNavigationProp;
  route: MovieScreenRouteProp;
};


const { width } = Dimensions.get('window');
interface Rating {
  Source: string
  Value: string
}
export interface MovieScreenType {
  "Title": "She-Ra and the Princesses of Power",
  "Year": "2018–",
  "Rated": "TV-Y7-FV",
  "Runtime": "30 min",

  "Plot": "She-Ra, Princess of Power, leads a rebellion to free her land of Etheria from the monstrous invaders the Horde.",

  "Poster": "https://m.media-amazon.com/images/M/MV5BNzdiOTJiMWMtYTY0MS00NTUzLWE3OWUtZTc4YzE2YzVmMzdhXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
  "Ratings": Rating[],
}
const Movie: React.FC<MovieProps> = ({navigation, route}) => {
  const [error, setError] = useState('')
  const [{Ratings, Rated, Runtime, Plot, Poster, Year, Title}, setMovie] = useState({})
  useEffect(() => {
    const {id} = route.params;
    axios.get('http://www.omdbapi.com/', {
      params: {
        apiKey,
        i: id,
        plot: 'full',
      },
    }).then(movie => setMovie(movie)).catch(error => setError(error));
  }, [navigation, route.params]);
  return (
    <View style={styles.container}>
      <ScrollView>
        {!!error && <Text>{error}</Text>}
        {Poster === null ? (
          <View style={styles.loading}>
            <ActivityIndicator animating size="large" />
          </View>
        ) : (
          <React.Fragment>
            <Image
              source={{
                uri: `${Poster}`,
                cache: 'only-if-cached',,
              }}
              style={styles.poster}
            />
            <View style={styles.heading}>
              <Text style={styles.title}>{Title}</Text>
              <Text>{` (${Year})`}</Text>
            </View>
            <View style={styles.subHeading}>
              <Text>{`${Rated}, `}</Text>
              <Text>{Runtime}</Text>
            </View>
            <Text style={styles.plot}>{Plot}</Text>
            {Ratings.map(({Source, Value}, idx) => {
              let width;
              if (Value.includes('%')) {
                width = Number(Value.replace('%', ''));
              } else if (Value.includes('/')) {
                width = Number(eval(Value) * 100);
              }
              let backgroundColor;
              if (width > 70) {
                backgroundColor = 'green';
              } else if (width > 50) {
                backgroundColor = 'yellow';
              } else if (width < 50) {
                backgroundColor = 'red';
              }
              return (
                <View key={idx} style={styles.rating}>
                  <Text key={idx}>{`${Source} (${Value}):`}</Text>
                  <View
                    style={{
                      width: `${width}%`,
                      backgroundColor,
                      height: 30,,
                    }}
                  />
                </View>
              );
            })}
          </React.Fragment>
        )}
      </ScrollView>
    </View>
  );
};

export default Movie;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    overflow: 'visible'
  },
  poster: {
    width: '100%',
    height: width - 20, // get the width of phone then -20 padding = square of poster
    marginBottom: 10
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10
  },
  subHeading: {
    flexDirection: 'row',
    marginBottom: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  },
  plot: {
    fontStyle: 'italic',
    marginBottom: 10
  },
  rating: {
    marginBottom: 10
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

