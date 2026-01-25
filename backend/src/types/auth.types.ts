export interface LoginInput {
  username: string,
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface getUserByLoginCredentialsResponse {
  id: string
}