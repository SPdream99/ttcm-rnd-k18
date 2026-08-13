import { AuthPort } from "../ports/AuthPort";
import { LoginCredentials, RegisterCredentials, UserProfile } from "../entities/User";

export class LoginUserUseCase {
  constructor(private authPort: AuthPort) {}

  async execute(credentials: LoginCredentials) {
    if (!credentials.email || !credentials.pass) {
      return { success: false, error: "Vui lòng điền đầy đủ email và mật khẩu." };
    }
    return this.authPort.login(credentials);
  }
}

export class RegisterUserUseCase {
  constructor(private authPort: AuthPort) {}

  async execute(credentials: RegisterCredentials) {
    if (!credentials.email || !credentials.pass || !credentials.fullName) {
      return { success: false, error: "Vui lòng nhập đầy đủ thông tin đăng ký." };
    }
    if (credentials.pass !== credentials.confirmPass) {
      return { success: false, error: "Mật khẩu xác nhận không trùng khớp." };
    }
    return this.authPort.register(credentials);
  }
}

export class GetUserProfileUseCase {
  constructor(private authPort: AuthPort) {}

  async execute(userId: string): Promise<UserProfile> {
    return this.authPort.getUserProfile(userId);
  }
}

export class UpdateUserProfileUseCase {
  constructor(private authPort: AuthPort) {}

  async execute(profile: UserProfile) {
    return this.authPort.updateUserProfile(profile);
  }
}
