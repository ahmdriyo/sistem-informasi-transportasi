'use server'
import { cookies } from 'next/headers'
// token
export async function getToken() {
  return (await cookies()).get('token')?.value
}
export async function setToken(token: string) {
  (await cookies()).set('token', token)
}
export async function deleteToken() {
  (await cookies()).delete('token')
}

// role
export async function getRole() {
  return (await cookies()).get('role')?.value
}
export async function deleteRole() {
  (await cookies()).delete('role')
}
export async function setRole(value: string) {
  (await cookies()).set('role', value)
}
// idUSer
export async function setIdUser(value: string) {
  (await cookies()).set('idUser', value)
}
export async function getIdUser() {
  return (await cookies()).get('idUser')?.value || null
}
export async function deleteIdUser() {
  (await cookies()).delete('idUser')
}

export async function getPhoneNumberStatus() {
  return (await cookies()).get('phoneNumberStatus')?.value
}

export async function deletePhoneNumberStatus() {
  (await cookies()).delete('phoneNumberStatus')
}

export async function updateFolders(value: string) {
  (await cookies()).set('folder', value)
}
