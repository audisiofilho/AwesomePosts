import React, {useLayoutEffect, useState, useCallback, useContext} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import firestrore from '@react-native-firebase/firestore';

import {AuthContext} from '../../contexts/auth';

import PostsList from '../../components/PostsList';
import { Container, ListPosts } from './styles';

export default function PostsUser() {
  const route = useRoute();
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);

  const [tittle, setTittle] = useState(route.params?.tittle);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: tittle === '' ? '' : tittle,
    });
  }, [navigation, tittle]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      firestrore()
        .collection('posts')
        .where('userId', '==', route.params?.userId)
        .orderBy('created', 'desc')
        .get()
        .then(snapshot => {
          const postList = [];

          snapshot.docs.map(u => {
            postList.push({
              ...u.data(),
              id: u.id,
            });
          });
          if (isActive) {
            setPosts(postList);
            console.log(postList);
            setLoading(false);
          }
        });

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <Container>
      {loading ? (
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size={30} color="#e52246" />
        </View>
      ) : (
        <ListPosts showVerticalSrcollIndicator={false} data={posts} renderItem={({item})=> <PostsList data={item} userId={user.uid} />} />
      )}
    </Container>
  );
}
