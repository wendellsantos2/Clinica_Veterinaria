import React, { useState } from 'react';
import { Box, ScrollView, Image, Input, Button, VStack, FormControl, Text } from 'native-base';
import Logo from '../src/assets/Logo.png';
import { useNavigation } from '@react-navigation/native';
import { Botao } from './componentes/Botao';

export default function Cadastro() {
   
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [role, setRole] = useState('');
  const [nome, setNome] = useState('');

  function voltarParaMenu() {
    navigation.goBack();
  }

  function handleCadastro() {
    const registro = {
      email,
      senha,
      cpf,
      role,
      nome
    };
   // URL of the API endpoint
  const apiURL = 'http://192.168.0.145:7131/api/AdicionaUsuario';

  fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registro),
  })
  .then(response => {
    // You should check for response.ok or response.status here
    // to ensure the request was successful.
    return response.json();
  })
  .then(data => {
    // Handle the response data
    console.log('Success:', data);
    // Navigate to another screen or show success message
  })
  .catch((error) => {
    // Handle any errors
    console.error('Error:', error);
    // Show error message or handle error state
  });
}

  return (
    <ScrollView flex={1} p={5}>
      <Image source={Logo} alt="Logo Voll" alignSelf="center" />

      <VStack space={4}>
        <Text fontSize="xl" bold textAlign="center">
          Cadastro
        </Text>
        <FormControl>
          <FormControl.Label>Nome Completo</FormControl.Label>
          <Input placeholder="Digite seu nome completo" onChangeText={setNome} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <Input placeholder="Digite seu email" onChangeText={setEmail} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Senha</FormControl.Label>
          <Input type="password" placeholder="Crie uma senha" onChangeText={setSenha} />
        </FormControl>
        <FormControl>
          <FormControl.Label>CPF</FormControl.Label>
          <Input placeholder="Digite seu CPF" onChangeText={setCpf} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Role</FormControl.Label>
          <Input placeholder="Digite seu role" onChangeText={setRole} />
        </FormControl>

        <Botao onPress={handleCadastro} mt={4} mb={20}>
          Cadastrar
        </Botao>  
      </VStack>
    </ScrollView>
  );
}
