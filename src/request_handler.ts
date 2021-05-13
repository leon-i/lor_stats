import fetch from 'node-fetch'
import { RateLimiter } from 'limiter'
import { CONFIG } from './constants'
import { API_TYPE, APIResponse } from './types'

/*
  Request handler that rate limits requests to Riot's api

  @param {string} apiKey api key for making requests to riot's api, set in config.yml
 */
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
      interval: 'minute',
    })
    this.methodLimiter = new RateLimiter({
      tokensPerInterval: 99,
      interval: 'hour',
    })
  }

  /*
  @param {string} request
   */
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
      throw Error(`Riot API error - ${new Date().toDateString()}`)
    }

    if (Array.isArray(res)) return { matches: res }
    return res
  }

  /*
  Stalls requests via rate limiters

  @param {string} type matchList, matchData - determines type of api response
  @param {string} url api url
  @param {string} id puuid or match id string
  @param {string} urlCap portion of api endpoint url that comes after the puuid/match id
   */
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
