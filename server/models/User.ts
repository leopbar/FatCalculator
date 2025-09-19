
import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 símbolo')
});

export const UserLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;

export interface UserDocument {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
}
