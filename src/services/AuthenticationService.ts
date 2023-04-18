import http from "@/utils/http";
import jwtDecode from "jwt-decode";
import secureLocalStorage  from  "react-secure-storage";

export async function SignIn(email: string, password: string) {
  try {
    const request = await http.post<LoginResponse>('/auth/signin', {
      email, password
    })
    secureLocalStorage.setItem('access_token', request.data.access_token)
    secureLocalStorage.setItem('refresh_token', request.data.refresh_token)
    secureLocalStorage.setItem('expires_in', request.data.expires_in)
    return request.data;
  } catch (error) {
    return null;
  }
}

export function SignOut() {
  secureLocalStorage.clear();
}

export function getUser() {
  const accessToken = getAccessToken()
  if (accessToken) {
    const decodedJwt = jwtDecode<JwtPayload>(accessToken)
    return decodedJwt.user
  }
  return null;
}

export function getAccessToken() {
  return secureLocalStorage.getItem('access_token') as string|null
}

export function getRefreshToken() {
  return secureLocalStorage.getItem('refresh_token') as string|null
}
