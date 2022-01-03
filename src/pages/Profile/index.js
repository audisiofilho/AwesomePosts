import React, {useContext, useState} from 'react';
import {Text, View} from 'react-native';

import {AuthContext} from '../../contexts/auth';

import Header from '../../components/Header';

import {
  Container,
  Name,
  Email,
  Button,
  ButtonText,
  UploadButton,
  UploadText,
  Avatar,
} from './styles';

export default function Profile() {
  const {signOut, user} = useContext(AuthContext);

  const [name, setName] = useState(user?.name);
  const [url, setUrl] = useState(null);

  async function handleSignOut() {
    await signOut();
  }

  return (
    <Container>
      <Header />

      {url ? (
        <UploadButton onPress={() => alert("clicou1")}>
          <UploadText>+</UploadText>
          <Avatar source={{uri: url}} />
        </UploadButton>
      ) : (
        <UploadButton onPress={() => alert("clicou2")}>
          <UploadText>+</UploadText>
        </UploadButton>
      )}

      <Name>{user?.name}</Name>
      <Email>{user?.email}</Email>

      <Button bg="#428cfd">
        <ButtonText color="#fff">Atualizar Perfil</ButtonText>
      </Button>
      <Button bg="#ddd" onPress={handleSignOut}>
        <ButtonText color="#353840">Sair Perfil</ButtonText>
      </Button>
    </Container>
  );
}
