import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestUserDto } from 'src/common/presentation/dtos/request-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async generateJwtToken(user: any): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.fullName,
      username: user.username,
      status: 'online',
      role: user.role,
      companies: user.companies,
      companySelected: user.companySelected,
    };

    return this.jwtService.sign(payload);
  }
}
