import React from 'react';

import {
  Container,
  Name,
  Header,
  Avatar,
  ContentView,
  Content,
  Actions,
  LikeButton,
  Like,
  TimePost,
} from './styles';

import MaterialCommnityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PostsList() {
  return (
    <Container>
      <Header>
        <Avatar source={require('../../assets/avatar.png')} />
        <Name numberOfLines={1}>Audisio</Name>
      </Header>

      <ContentView>
        <Content>Todo conteudo do post</Content>
      </ContentView>

      <Actions>
        <LikeButton>
          <Like>12</Like>
          <MaterialCommnityIcons
            name="heart-plus-outline"
            size={20}
            color="#e52246"
          />
        </LikeButton>

        <TimePost>há um minuto atrás</TimePost>
      </Actions>
    </Container>
  );
}
