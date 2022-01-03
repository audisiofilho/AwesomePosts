import React, {useState} from 'react';
import {Text, View} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

import {Container, AreaInput, Input} from './styles';

export default function Search() {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);

  return (
    <Container>
      <AreaInput>
        <Feather name="search" size={20} color="#e52246" />
        <Input
          placeholder="Procurando alguem?"
          value={input}
          onChangeText={text => setInput(text)}
          placeholderTextColor="#353840"
        />
      </AreaInput>
    </Container>
  );
}
