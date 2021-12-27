import React, {useLayoutEffect, useState, useCallback} from 'react';
import {Text, View} from 'react-native';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import firestrore from '@react-native-firebase/firestore';

export default function PostsUser() {
  const route = useRoute();
  const navigation = useNavigation();

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
    <View>
      <Text>{route.params?.tittle}</Text>
    </View>
  );
}
