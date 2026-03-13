export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type StoredAuth = {
  token: string;
  username: string;
};

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";
