import React, {useContext, useState, useEffect} from 'react';
import {Text, View, Modal, Platform} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {launchImageLibrary} from 'react-native-image-picker';

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
  ModalContainer,
  ButtonBack,
  Input,
} from './styles';

import Feather from 'react-native-vector-icons/Feather';

export default function Profile() {
  const {signOut, user, setUser, storageUser} = useContext(AuthContext);

  const [name, setName] = useState(user?.name);
  const [url, setUrl] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadAvatar() {
      try {
        if (isActive) {
          let response = await storage()
            .ref('users')
            .child(user?.uid)
            .getDownloadURL();
          setUrl(response);
        }
      } catch (err) {
        console.log('Não encontramos nenhuma foto');
      }
    }

    loadAvatar();

    return () => (isActive = false);
  }, []);

  async function handleSignOut() {
    await signOut();
  }

  async function updateProfile() {
    if (name === '') {
      return;
    }

    await firestore().collection('users').doc(user?.uid).update({
      name: name,
    });

    const postsDocs = await firestore()
      .collection('posts')
      .where('userId', '==', user?.uid)
      .get();

    postsDocs.forEach(async doc => {
      await firestore().collection('posts').doc(doc.id).update({
        autor: name,
      });
    });

    let data = {
      uid: user.uid,
      name: name,
      email: user.email,
    };

    setUser(data);
    storageUser(data);
    setOpen(false);
  }

  const uploadFile = () => {
    const options = {
      noData: true,
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('cancelou');
      } else if (response.error) {
        console.log('Ops parece que deu algo errado');
      } else {
        uploadFileFirebase(response).then(() => {
          uploadAvatarPosts();
        });

        setUrl(response.assets[0].uri);
      }
    });
  };

  const getFileLocalPath = response => {
    return response.assets[0].uri;
  };

  const uploadFileFirebase = async response => {
    const fileSource = getFileLocalPath(response);

    const storageRef = storage().ref('users').child(user?.uid);

    return await storageRef.putFile(fileSource);
  };

  const uploadAvatarPosts = async () => {
    const storageRef = storage().ref('users').child(user?.uid);
    const url = await storageRef
      .getDownloadURL()
      .then(async image => {
        const postsDocs = await firestore()
          .collection('posts')
          .where('userId', '==', user.uid)
          .get();

        postsDocs.forEach(async doc => {
          await firestore().collection('posts').doc(doc.id).update({
            avatarUrl: image,
          });
        });
      })
      .catch(error => {
        console.log('ERROR AO ATUALIZAR FOTO DOS POSTS ', error);
      });
  };

  return (
    <Container>
      <Header />

      {url ? (
        <UploadButton onPress={() => uploadFile()}>
          <UploadText>+</UploadText>
          <Avatar source={{uri: url}} />
        </UploadButton>
      ) : (
        <UploadButton onPress={() => uploadFile()}>
          <UploadText>+</UploadText>
        </UploadButton>
      )}

      <Name>{user?.name}</Name>
      <Email>{user?.email}</Email>

      <Button bg="#428cfd" onPress={() => setOpen(true)}>
        <ButtonText color="#fff">Atualizar Perfil</ButtonText>
      </Button>
      <Button bg="#ddd" onPress={handleSignOut}>
        <ButtonText color="#353840">Sair Perfil</ButtonText>
      </Button>

      <Modal visible={open} animationType="slide" transparent={true}>
        <ModalContainer behavior={Platform.OS === 'android' ? '' : 'padding'}>
          <ButtonBack onPress={() => setOpen(false)}>
            <Feather name="arrow-left" size={22} color="#121212" />
            <ButtonText color="#121212">Voltar</ButtonText>
          </ButtonBack>

          <Input
            placeholder={user?.name}
            value={name}
            onChangeText={text => setName(text)}
          />
          <Button bg="#428cfd" onPress={updateProfile}>
            <ButtonText color="#fff">Salvar</ButtonText>
          </Button>
        </ModalContainer>
      </Modal>
    </Container>
  );
}
