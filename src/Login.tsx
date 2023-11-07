import React, { useState, useEffect } from 'react';
import {
  VStack,
  Image,
  Text,
  Box,
  FormControl,
  Input,
  Link,
  useToast,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
 
import { Titulo } from './componentes/Titulo';
import { EntradaTexto } from './componentes/EntradaTexto';
import { fazerLogin } from './servicos/AutenticacaoServico';
import { Botao } from './componentes/Botao';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

// Define the expected structure of your decoded token
interface DecodedToken {
  id: string;
  // ... (other properties from your token)
}

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [carregando, setCarregando] = useState(true);
  const toast = useToast();
  
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    async function verificarLogin() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.replace('Tabs');
      }
      setCarregando(false);
    }
    verificarLogin();
  }, [navigation]);

  async function login() {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedEmail || !trimmedPassword) {
      toast.show({
        title: "Erro no login",
        description: "Email e senha são obrigatórios",
        backgroundColor: "red.500",
      });
      return;
    }

    try {
      const resultado = await fazerLogin({ Email: email, Password: password });
       
        await AsyncStorage.setItem('token', resultado.token);
        const tokenDecodificado = jwtDecode<DecodedToken>(resultado.token);
      
        await AsyncStorage.setItem('id', tokenDecodificado.id);
       
        navigation.replace('Tabs');
   
    } catch (error) {
      toast.show({
        title: "Erro de conexão",
        description: error.message || "Um erro ocorreu durante o login.",
        backgroundColor: "red.500",
      });
    }
  }

  if (carregando) {
    return null;
  }

  return (
    <VStack flex={1} alignItems="center" p={5}>
      
      <Titulo color="blue.500">
        faça login em sua conta
      </Titulo>
      <Box>
        <EntradaTexto
          label='Email'
          placeholder='Insira seu endereço de email'
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            console.log("Email text:", text); // Log the email input
          }}
        />
        <EntradaTexto
          label='Senha'
          placeholder='Insira sua senha'
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setSenha(text);
            console.log("Password text:", text); // Log the password input
          }}
        />
      </Box>
      <Botao w="100%" bg="blue.800" mt={10} borderRadius="lg" onPress={login}>
        Entrar
      </Botao>
      <Link href="https://www.alura.com.br" mt={10}>
        Esqueceu sua senha?
      </Link>
      <Box w="100%" flexDirection="row" justifyContent="center">
        <Text>Ainda não tem cadastro?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text color="blue.500">Faça seu cadastro!</Text>
        </TouchableOpacity>
      </Box>
    </VStack>
  );
}
