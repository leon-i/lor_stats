import fetch from 'node-fetch'
import { RateLimiter } from 'limiter'
import { CONFIG } from './constants'
import { API_TYPE, APIResponse } from './types'

class RequestHandler {
  private apiKey: string
  totalRequests: number
  secondLimiter: RateLimiter
  minuteLimiter: RateLimiter
  methodLimiter: RateLimiter

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.totalRequests = 0
    this.secondLimiter = new RateLimiter({
      tokensPerInterval: 19,
      interval: 'second',
    })
    this.minuteLimiter = new RateLimiter({
      tokensPerInterval: 45,
      interval: 'minute'
    })
    this.methodLimiter = new RateLimiter({
      tokensPerInterval: 99,
      interval: 'hour',
    })
  }

  private async _makeRequest(request: string) {
    const data = await fetch(request, {
      headers: {
        'X-Riot-Token': this.apiKey || '',
      },
    })

    const res = await data.json()
    this.totalRequests += 1
    if (CONFIG.log_progress) console.log(this.totalRequests)

    if (res.status) {
      console.warn(data)
      console.warn(res)
      throw Error('Riot API error')
    }

    if (Array.isArray(res)) return { matches: res }
    return res
  }

  async yep<T extends API_TYPE>(
    type: T,
    url: string,
    id: string,
    urlCap = '',
  ): Promise<APIResponse<T>> {
    await this.secondLimiter.removeTokens(1)
    await this.minuteLimiter.removeTokens(1)
    await this.methodLimiter.removeTokens(1)

    const response = await this._makeRequest(`${url}/${id}${urlCap}`)

    return response as Promise<APIResponse<T>>
  }
}

export const handler = new RequestHandler(CONFIG.api_key)
