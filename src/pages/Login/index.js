import React, {useState, useContext} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';

import {AuthContext} from '../../contexts/auth';

import {
  Container,
  Title,
  Input,
  Button,
  ButtonText,
  SignUpButton,
  SignUpText,
} from './styles';

import * as Animatable from 'react-native-animatable';

const TitleAnimated = Animatable.createAnimatableComponent(Title);

export default function Login() {
  const {signUp, signIn, loadingAuth} = useContext(AuthContext);

  const [login, setLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function toggleLogin() {
    setLogin(!login);
    setName('');
    setEmail('');
    setPassword('');
  }

  function handleLogin() {
    if (email === '' || password === '') {
      console.log('preencha todos os campos');
      return;
    }
    signIn(email, password);
  }

  function handleSignUp() {
    if (name === '' || email === '' || password === '') {
      console.log('preencha todos os campos');
      return;
    }
    //Cadastrando Usuario.
    signUp(email, password, name);
  }

  if (login) {
    return (
      <Container>
        <TitleAnimated animation="flipInX">
          Awesome<Text style={{color: '#e52246'}}>Posts</Text>
        </TitleAnimated>

        <Input
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="email@email.com"
        />
        <Input
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="*********"
          secureTextEntry={true}
        />

        <Button onPress={handleLogin}>
          {loadingAuth ? (
            <ActivityIndicator size={20} color="#FFF" />
          ) : (
            <ButtonText>Acessar</ButtonText>
          )}
        </Button>

        <SignUpButton onPress={() => toggleLogin()}>
          <SignUpText>Criar uma conta.</SignUpText>
        </SignUpButton>
      </Container>
    );
  }

  return (
    <Container>
      <TitleAnimated animation="pulse">
        Awesome<Text style={{color: '#e52246'}}>Posts</Text>
      </TitleAnimated>

      <Input
        value={name}
        onChangeText={text => setName(text)}
        placeholder="Usuario"
      />
      <Input
        value={email}
        onChangeText={text => setEmail(text)}
        placeholder="email@email.com"
      />
      <Input
        value={password}
        onChangeText={text => setPassword(text)}
        placeholder="*********"
        secureTextEntry={true}
      />

      <Button onPress={handleSignUp}>
        {loadingAuth ? (
          <ActivityIndicator size={20} color="#FFF" />
        ) : (
          <ButtonText>Cadastrar</ButtonText>
        )}
      </Button>

      <SignUpButton onPress={() => toggleLogin()}>
        <SignUpText>Já tenho uma conta.</SignUpText>
      </SignUpButton>
    </Container>
  );
}
