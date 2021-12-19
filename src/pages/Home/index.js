import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {Text, View} from 'react-native';
import {Container, ButtonPost, ListPosts} from './styles';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../components/Header';

export default function Home() {
  const navigation = useNavigation();

  const [posts, setPosts] = useState([
    {id: '1', name: 'Alan'},
    {id: '2', name: 'Audisio'},
    {id: '3', name: 'Rayna'},
  ])

  return (
    <Container>
      <Header/>
      
      <ListPosts 
      data={posts}
      renderItem={({item}) => (<Text>TESTE</Text>)}
      />

      <ButtonPost onPress={() => navigation.navigate('NewPost')}>
        <Feather name="edit-2" color="#fff" size={25} />
      </ButtonPost>
    </Container>
  );
}
