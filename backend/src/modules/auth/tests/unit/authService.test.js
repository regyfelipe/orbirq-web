import { loginUsuario } from '../../services/authService.js';
import { findUserByEmail, findUserByUsername } from '../../repositories/authRepository.js';
import { comparePassword } from '../../../../shared/utils/hashUtils.js';

jest.mock('../../repositories/authRepository.js');
jest.mock('../../../../shared/utils/hashUtils.js');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUsuario', () => {
    it('should login user with valid email and password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        senha_hash: 'hashedpassword',
        role: 'aluno'
      };

      findUserByEmail.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(true);

      const result = await loginUsuario('test@example.com', 'password');

      expect(findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(comparePassword).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(result).toHaveProperty('token');
      expect(result.usuario).toEqual({
        id: 1,
        nome: mockUser.nome_completo,
        role: 'aluno'
      });
    });

    it('should throw error for non-existent user', async () => {
      findUserByEmail.mockResolvedValue(null);
      findUserByUsername.mockResolvedValue(null);

      await expect(loginUsuario('nonexistent@example.com', 'password'))
        .rejects
        .toThrow('Usuário não encontrado');
    });

    it('should throw error for incorrect password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        senha_hash: 'hashedpassword'
      };

      findUserByEmail.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(false);

      await expect(loginUsuario('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow('Senha incorreta');
    });
  });
});