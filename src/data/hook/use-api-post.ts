import { baseApi, baseApiToken } from '@/data/consts/base-api'
import { GetPathProps, RestEndpoint } from '@/data/consts/rest-endpoint'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

export const useApiPost = <TRequest, TResponse>(
  endpoint: GetPathProps,
  options?: {
    useToken?: boolean
    onSuccess?: (data: AxiosResponse<TResponse>) => void
    onError?: (error: Error) => void
  },
) => {
  const { useToken = false, onSuccess, onError } = options || {}

  return useMutation<AxiosResponse<TResponse>, Error, TRequest>({
    mutationFn: async (data: TRequest) => {
      // Choose baseApi or baseApiToken by useToken
      const api = useToken ? baseApiToken : baseApi
      const response = await api.post<TResponse>(RestEndpoint.getPath(endpoint), data)
      return response
    },
    onSuccess,
    onError,
  })
}
