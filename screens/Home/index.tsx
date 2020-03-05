import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Movie, {MovieType} from './Movie';

import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamListType} from '../../App';
import axios from 'axios';
import {apiKey} from '../constants';

type HomeScreenNavigationProp = StackNavigationProp<
  AppStackParamListType,
  'Home'
>;

type HomeProps = {
  navigation: HomeScreenNavigationProp;
};

export type OnMoviePressType = ({
  id,
  title,
}: {
  id: string;
  title: string;
}) => void;

const {width} = Dimensions.get('window');

const Loader = () => (
  <View style={styles.loader}>
    <ActivityIndicator animating size="large" />
  </View>
);

function useDebounce(value: string, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called every time ...
    // ... useEffect is re-called. useEffect will only be re-called ...
    // ... if value changes (see the inputs array below).
    // This is how we prevent debouncedValue from changing if value is ...
    // ... changed within the delay period. Timeout gets cleared and restarted.
    // To put it in context, if the user is typing within our app's ...
    // ... search box, we don't want the debouncedValue to update until ...
    // ... they've stopped typing for more than 500ms.
    return () => {
      clearTimeout(handler);
    };
  }, [delay, value]);

  return debouncedValue;
}
// API search function
function searchCharacters(text: string, page: number) {
  return axios
    .get('http://www.omdbapi.com/', {
      params: {
        apiKey,
        s: text,
        page,
      },
    })
    .then(({data}) => data);
}

const Home: React.FC<HomeProps> = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults]: any = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [prevSearch, setPrevSearch] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [isRefetching, setIsRefetching] = useState(false);

  // Now we call our hook, passing in the current searchTerm value.
  // The hook will only return the latest value (what we passed in) ...
  // ... if it's been more than 500ms since it was last called.
  // Otherwise, it will return the previous value of searchTerm.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      if (prevSearch === debouncedSearchTerm) {
        return;
      }
      setIsSearching(true);
      setPrevSearch(debouncedSearchTerm);
      searchCharacters(debouncedSearchTerm, currentPage).then(result => {
        if (result.Error) {
          setErrorMsg(result.Error);
          setResults([]);
          setCurrentPage(1);
          setIsSearching(false);
        } else if (result.Search) {
          const filterResultDuplicate = result.Search.filter(
            (value: MovieType, index: number, self: MovieType[]) =>
              index === self.findIndex(t => t.imdbID === value.imdbID),
          );
          setResults([...results, ...filterResultDuplicate]);
          setErrorMsg('');
          setCurrentPage(currentPage + 1);
          setIsSearching(false);
          setTotalResults(Number(result.totalResults));
        }
      });
    }
  }, [currentPage, debouncedSearchTerm, prevSearch, results, totalResults]);
  const renderFooter = () => (!isRefetching ? null : <Loader />);
  const renderSeparator = () => <View style={styles.separator} />;
  const loadMore = () => {
    if (totalResults === results.length && totalResults) {
      return;
    }
    setIsRefetching(true);
    searchCharacters(debouncedSearchTerm, currentPage).then(result => {
      if (result.Error) {
        setErrorMsg(result.Error);
        setResults([]);
        setCurrentPage(1);
        setIsRefetching(false);
      } else if (result.Search) {
        const filterResultDuplicate = result.Search.filter(
          (value: MovieType, index: number, self: MovieType[]) =>
            index === self.findIndex(t => t.imdbID === value.imdbID),
        );
        setResults([...results, ...filterResultDuplicate]);
        setErrorMsg('');
        setTotalResults(Number(result.totalResults));
        setCurrentPage(currentPage + 1);
        setIsRefetching(false);
      }
    });
  };
  const onMoviePress: OnMoviePressType = ({id, title}) => {
    navigation.navigate('Movie', {id, title});
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listContainer}
        data={results}
        renderItem={({item}) => <Movie onPress={onMoviePress} movie={item} />}
        keyExtractor={({imdbID}: MovieType) => imdbID}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={
          <>
            <TextInput
              style={styles.search}
              onChangeText={newText => setSearchTerm(newText)}
              value={searchTerm}
              placeholder="Search..."
            />
            {!!errorMsg && <Text style={styles.errorMessage}>{errorMsg}</Text>}
            {!!isSearching && <Loader />}
          </>
        }
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.05}
        onEndReached={loadMore}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  errorMessage: {
    color: 'red',
    marginTop: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    width,
  },
  search: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
  },
  listContainer: {
    width: '100%',
    flex: 1,
    height: 300,
  },
  loader: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#CED0CE',
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
});
