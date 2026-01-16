import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '../lib/jwt';
import { AppError } from '../middleware/error.middleware';
import { RegisterInput, LoginInput, UpdateProfileInput } from '../schemas/auth.schema';

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(409, 'Email already registered', 'Conflict');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const tokens = await this.createTokens(user.id, user.email, user.role);

    return { user, ...tokens };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials', 'Unauthorized');
    }

    if (user.status === 'suspended') {
      throw new AppError(403, 'Account suspended', 'Forbidden');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials', 'Unauthorized');
    }

    const tokens = await this.createTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);

      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: payload.userId,
          expiresAt: { gt: new Date() },
        },
      });

      if (!storedToken) {
        throw new AppError(401, 'Invalid refresh token', 'Unauthorized');
      }

      // Delete old token
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });

      // Get user for new tokens
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true, status: true },
      });

      if (!user || user.status === 'suspended') {
        throw new AppError(401, 'User not found or suspended', 'Unauthorized');
      }

      return this.createTokens(user.id, user.email, user.role);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(401, 'Invalid refresh token', 'Unauthorized');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { userId, token: refreshToken },
      });
    } else {
      // Logout from all devices
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found', 'Not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError(404, 'User not found', 'Not found');
    }

    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;

    if (data.newPassword && data.currentPassword) {
      const isValidPassword = await bcrypt.compare(data.currentPassword, user.passwordHash);
      if (!isValidPassword) {
        throw new AppError(401, 'Current password is incorrect', 'Unauthorized');
      }
      updateData.passwordHash = await bcrypt.hash(data.newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }

  private async createTokens(userId: string, email: string, role: string) {
    const payload = { userId, email, role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
