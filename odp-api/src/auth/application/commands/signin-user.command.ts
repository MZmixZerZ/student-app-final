export class SignInUserCommand {
  constructor(
    public readonly usernameOrEmail: string, // เปลี่ยนชื่อให้สื่อความหมาย
    public readonly password: string,
  ) {}
}
