// src/interfaces/Cliente.ts

import { Animal } from './Animal';

export interface Cliente {
    iD_Cliente:number;
    nome: string;
    endereco: string;
    email: string;
    telefone: string;
    animais?: Animal[]; // Use 'Animal' do arquivo Animal.ts
  }
  