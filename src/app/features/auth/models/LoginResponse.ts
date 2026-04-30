export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    username: string;
    rol: string;
    permisos: string[];
  };
  timestamp: string;
}