import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import {AppStackParamListType} from 'App';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import axios from 'axios';
import {apiKey} from './constants';
import {ScrollView} from 'react-native-gesture-handler';

type MovieScreenNavigationProp = StackNavigationProp<
  AppStackParamListType,
  'Movie'
>;

type MovieScreenRouteProp = RouteProp<AppStackParamListType, 'Movie'>;

type MovieProps = {
  navigation: MovieScreenNavigationProp;
  route: MovieScreenRouteProp;
};

const {width} = Dimensions.get('window');
interface Rating {
  Source: string;
  Value: string;
}
export interface MovieScreenType {
  Title: string;
  Year: string;
  Rated: string;
  Runtime: string;
  Plot: string;
  Poster: string;
  Ratings: Rating[];
}
const Movie: React.FC<MovieProps> = ({navigation, route}) => {
  const [error, setError] = useState('');
  const [movie, setMovie] = useState<MovieScreenType | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const {id} = route.params;
    setLoading(true);
    axios
      .get('http://www.omdbapi.com/', {
        params: {
          apiKey,
          i: id,
          plot: 'full',
        },
      })
      .then(res => {
        setMovie({
          Ratings: res.data.Ratings,
          Rated: res.data.Rated,
          Runtime: res.data.Runtime,
          Plot: res.data.Plot,
          Poster: res.data.Poster,
          Year: res.data.Year,
          Title: res.data.Title,
        });
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, [navigation, route.params]);
  if (!movie) {
    return null;
  }
  const {Ratings, Rated, Runtime, Plot, Poster, Year, Title} = movie;
  return (
    <View style={styles.container}>
      <ScrollView>
        {!!error && <Text>{error}</Text>}
        {!!loading && (
          <View style={styles.loading}>
            <ActivityIndicator animating size="large" />
          </View>
        )}
        <Image
          source={{
            uri: Poster,
            cache: 'only-if-cached',
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
          let ratingWidth;
          if (Value.includes('%')) {
            ratingWidth = Number(Value.replace('%', ''));
          } else {
            ratingWidth = Number(Value) * 100;
          }
          let backgroundColor;
          if (ratingWidth > 70) {
            backgroundColor = 'green';
          } else if (ratingWidth > 50) {
            backgroundColor = 'yellow';
          } else if (ratingWidth < 50) {
            backgroundColor = 'red';
          }
          return (
            <View key={idx} style={styles.rating}>
              <Text key={idx}>{`${Source} (${Value}):`}</Text>
              <View
                style={[
                  styles.ratingStyle,
                  {width: `${ratingWidth}%`, backgroundColor},
                ]}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Movie;

const styles = StyleSheet.create({
  ratingStyle: {height: 30},
  container: {
    flex: 1,
    padding: 10,
    overflow: 'visible',
  },
  poster: {
    width: '100%',
    height: width - 20, // get the width of phone then -20 padding = square of poster
    marginBottom: 10,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  subHeading: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  plot: {
    fontStyle: 'italic',
    marginBottom: 10,
  },
  rating: {
    marginBottom: 10,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
