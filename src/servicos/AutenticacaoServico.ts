import api from './api';

// Define a type for the function parameters
type LoginCredentials = {
    Email: string;
    Password: string;
  };
  
  export async function fazerLogin({ Email, Password }: any) {
    try {
      const resultado = await api.post('/CreateToken', {
        Email,
        Password,
      });
  
      return resultado.data;
    
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error; // Re-throw the error so the login function can catch it and display a toast.
    }
  }
  