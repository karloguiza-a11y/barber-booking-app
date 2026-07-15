import { useMutation } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { AuthResponse, User } from '@/lib/types'
import { RegisterFormData, LoginFormData } from '@/lib/schemas/auth'

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await apiClient.post<AuthResponse>('/auth/register', data)
      return response.data.data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post<AuthResponse>('/auth/login', data)
      return response.data.data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
  })
}

export const useMe = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get<User>('/auth/me')
      return response.data.data
    },
  })
}
