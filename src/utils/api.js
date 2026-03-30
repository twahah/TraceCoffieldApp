import { ofetch } from 'ofetch'

export const $api = ofetch.create({
  baseURL: "http://127.0.0.1:8080/api",
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
})
