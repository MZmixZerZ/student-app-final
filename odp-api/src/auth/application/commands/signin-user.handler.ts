import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInUserCommand } from './signin-user.command';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/auth/domain/repositories/user.repository.interface';
import { AuthService } from 'src/auth/domain/services/auth.service';

@CommandHandler(SignInUserCommand)
export class SignInUserHandler implements ICommandHandler<SignInUserCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface,
    private readonly authService: AuthService,
  ) {}

  async execute(command: SignInUserCommand): Promise<string> {
    const { usernameOrEmail, password } = command;

    // ตรวจสอบ input
    if (!usernameOrEmail || !password) {
      throw new UnauthorizedException('Username or email and password are required');
    }

    // ค้นหา user ด้วย username หรือ email
    let user = await this.userRepository.findByUsername(usernameOrEmail);
    if (!user && this.userRepository.findByEmail) {
      user = await this.userRepository.findByEmail(usernameOrEmail);
    }

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    // ตรวจสอบรหัสผ่าน
    const passwordValid = await this.authService.comparePassword(
      password,
      user.password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    return this.authService.generateJwtToken(user);
  }
}
