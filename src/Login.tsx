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
  const logout = async () => {
    await AsyncStorage.removeItem('token'); // Remove the token from storage
    // Navigate to the login screen or another appropriate screen
    navigation.replace('Login'); // Use 'Login' or the route name you have for the login screen
  };

  useEffect(() => {
    async function verificarLogin() {
      const token = await AsyncStorage.getItem('token');
     // if (token) {
      //  navigation.replace('Tabs');
     // }
      setCarregando(false);
    }
    verificarLogin();
  }, [navigation]);

  async function getToken() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Tempo atual em segundos
  
        // Verificar se o token expirou
        if (decodedToken.exp < currentTime) {
          // Token expirou
          console.log('Token expirou');
          // Aqui você pode redirecionar o usuário para o login ou renovar o token
        } else {
          // Token ainda é válido
          console.log('Token válido:', token);
          // Aqui você pode configurar o token para ser usado em requisições subsequentes
        }
      } else {
        console.log('Nenhum token encontrado');
        // Redirecionar para o login
      }
    } catch (error) {
      console.log('Erro ao recuperar o token:', error);
    }
  }

  
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
      const resultado = await fazerLogin({ Email: trimmedEmail, Password: trimmedPassword });
      await AsyncStorage.setItem('token', resultado);
      const token = await AsyncStorage.getItem('token');
      let role; // Declarar role fora do if para que seja acessível fora do bloco
  
      if (token) {
        const decodedToken = jwtDecode(token);
        const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        role = decodedToken[roleClaim]; // Atribuir valor a role
        console.log('Role:', role);
      } else {
        console.log('Nenhum token encontrado. Usuário não está logado.');
        // Redirecionar para a tela de login ou lançar um erro
        toast.show({
          title: "Erro de autenticação",
          description: "Não foi possível autenticar o usuário.",
          backgroundColor: "red.500",
        });
        return; // Sair da função se não houver token
      }
  
      // Agora o switch pode acessar a variável role
      switch (role) {
        case 'admin':
          navigation.replace('AdminDashboard');
          break;
        case 'cliente':
          navigation.replace('Tabs');
          break;
        case 'veterinario':
          navigation.replace('VeterinarioPage');
          break;
        case 'secretario':
          navigation.replace('SecretarioPage');
          break;
        default:
          toast.show({
            title: "Erro de acesso",
            description: "Seu papel de usuário não permite acesso a esta área.",
            backgroundColor: "red.500",
          });
          break;
      }
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
          }}
        />
        <EntradaTexto
          label='Senha'
          placeholder='Insira sua senha'
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setSenha(text);
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
