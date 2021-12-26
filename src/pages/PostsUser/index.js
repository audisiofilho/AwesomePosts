import React, {useLayoutEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

export default function PostsUser() {
  const route = useRoute();
  const navigation = useNavigation();

  const [tittle, setTittle] = useState(route.params?.tittle);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: tittle === '' ? '' : tittle,
    });
  }, [navigation, tittle]);

  return (
    <View>
      <Text>{route.params?.tittle}</Text>
    </View>
  );
}
