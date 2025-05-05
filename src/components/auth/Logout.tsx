import { deleteIdUser, deleteRole, deleteToken } from "@/app/auth/action"

export const logout = async () => {
  await deleteIdUser()
  await deleteToken()
  await deleteRole()
}