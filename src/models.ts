interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

interface Role {
  id: string
  name: string
  created_at: Date
  updated_at: Date
}
type Authority = "ROLE_ADMIN" | "ROLE_USER"

interface Authorities {
  authorities: Authority
}

interface User {
  id: string
  name: string
  position: string
  email: string
  phone: string
  is_active: boolean,
  created_at: Date,
  updated_at: Date,
  roles: Role[]
  username: string
  account_non_expired: boolean
  account_non_locked: boolean
  credentials_non_expired: boolean
  authorities: Authorities
  enabled: boolean
}

interface JwtPayload {
  jti: string
  sub: string
  iat: Date
  exp: Date
  user: User
}
