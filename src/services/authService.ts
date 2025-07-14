
import { LoginCredentials, SignupData, User } from '@/types';

// Mock user data
const mockUsers: Array<User & {password: string;}> = [
{
  id: '1',
  name: 'John Doe',
  email: 'user@example.com',
  password: 'password123',
  role: 'user'
},
{
  id: '2',
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
}];


// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate mock JWT token
const generateMockToken = (user: User): string => {
  const payload = { userId: user.id, email: user.email, role: user.role };
  return btoa(JSON.stringify(payload));
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<{user: User;token: string;}> {
    await delay(1000); // Simulate network delay

    const user = mockUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password, ...userWithoutPassword } = user;
    const token = generateMockToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  },

  async signup(signupData: SignupData): Promise<{user: User;token: string;}> {
    await delay(1000);

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === signupData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password
    if (signupData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create new user
    const newUser: User & {password: string;} = {
      id: (mockUsers.length + 1).toString(),
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      role: 'user'
    };

    mockUsers.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    const token = generateMockToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  },

  async adminLogin(credentials: LoginCredentials): Promise<{user: User;token: string;}> {
    await delay(1000);

    const adminUser = mockUsers.find(
      (u) => u.email === credentials.email &&
      u.password === credentials.password &&
      u.role === 'admin'
    );

    if (!adminUser) {
      throw new Error('Invalid admin credentials');
    }

    const { password, ...userWithoutPassword } = adminUser;
    const token = generateMockToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  },

  async verifyToken(token: string): Promise<User> {
    await delay(500);

    try {
      const payload = JSON.parse(atob(token));
      const user = mockUsers.find((u) => u.id === payload.userId);

      if (!user) {
        throw new Error('Invalid token');
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};