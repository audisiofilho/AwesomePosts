import React, {useState, useContext, useEffect, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../contexts/auth';

import {ActivityIndicator, Text, View} from 'react-native';
import {Container, ButtonPost, ListPosts} from './styles';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../components/Header';
import PostsList from '../../components/PostsList';

export default function Home() {
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [lastItem, setLastItem] = useState('');
  const [emptyList, setEmptyList] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      function fetchPosts() {
        firestore()
          .collection('posts')
          .orderBy('created', 'desc')
          .limit(5)
          .get()
          .then(snapshot => {
            if (isActive) {
              setPosts([]);
              const postList = [];

              snapshot.docs.map(u => {
                postList.push({
                  ...u.data(),
                  id: u.uid,
                });
              });
              setEmptyList(!!snapshot.empty);
              setPosts(postList);
              setLastItem(snapshot.docs[snapshot.docs.length - 1]);
              setLoading(false);
            }
          });
      }

      fetchPosts();

      return () => {
        isActive = false;
      };
    }, []),
  );

  async function handleRefreshPosts() {
    setLoadingRefresh(true);

    firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .limit(5)
      .get()
      .then(snapshot => {
        setPosts([]);
        const postList = [];

        snapshot.docs.map(u => {
          postList.push({
            ...u.data(),
            id: u.uid,
          });
        });
        setEmptyList(false);
        setPosts(postList);
        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
      });
    setLoadingRefresh(false);
  }

  async function getListPosts() {
    if (emptyList) {
      setLoading(false);
      return null;
    }

    if (loading) return;

    firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .limit(5)
      .startAfter(lastItem)
      .get()
      .then(snapshot => {
        const postList = [];

        snapshot.docs.map(u => {
          postList.push({
            ...u.data(),
            id: u.id,
          });
        });

        setEmptyList(!!snapshot.empty);
        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
        setPosts(oldPosts => [...oldPosts, ...postList]);
        setLoading(false);
      });
  }

  return (
    <Container>
      <Header />

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={50} color="#e52246" />
        </View>
      ) : (
        <ListPosts
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={({item}) => <PostsList data={item} userId={user?.uid} />}
          refreshing={loadingRefresh}
          onRefresh={handleRefreshPosts}
          onEndReached={()=>getListPosts()}
          onEndReachedThreshold={0.1}
        />
      )}

      <ButtonPost onPress={() => navigation.navigate('NewPost')}>
        <Feather name="edit-2" color="#fff" size={25} />
      </ButtonPost>
    </Container>
  );
}

{
  /*
  useEffect(() => {
  const subscriber = firestore()
    .collection('posts')
    .orderBy('created', 'desc')
    .onSnapshot(snapshot => {
      const postList = [];

      snapshot.forEach(doc => {
        postList.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      setPosts(postList);
      console.log(snapshot.doc[snapshot.docs.length -1]);
      setLoading(false);
    });

  return () => subscriber();
}, []);
*/
}
