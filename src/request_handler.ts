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
    Rate limits Riot api calls

    @param {string} type matchList, matchData
   */
  private async _rateLimit(type: API_TYPE): Promise<void> {
    await this.secondLimiter.removeTokens(1)
    await this.minuteLimiter.removeTokens(1)

    if (type === 'matchData') {
      // matchList api method limit is twice that of matchData, so we always hit matchData limit first
      await this.methodLimiter.removeTokens(1)
    }
  }

  /*
  @param {string} request full request string to Riot api
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

    if (Array.isArray(res)) return { matches: res }
    return res
  }

  /*
  Stalls requests via rate limiters

  @param {string} type matchList, matchData - determines type of api response
  @param {string} url api url
  @param {string} id puuid or match id string
  @param {string} urlCap portion of api endpoint url that comes after the puuid/match id
  @param {number} tries number of retries if non-rate limit error is encountered
   */
  async yep<T extends API_TYPE>(
    type: T,
    url: string,
    id: string,
    urlCap = '',
    tries = 3,
  ): Promise<APIResponse<T>> {
    await this._rateLimit(type)

    const response = await this._makeRequest(`${url}/${id}${urlCap}`)

    if (response.status) {
      if (tries === 0 || response.status.status_code === 429) {
        console.warn(response)
        throw Error(`Riot API error - ${new Date().toLocaleString()}`)
      } else {
        await this._rateLimit(type)
        return await this.yep(type, url, id, urlCap, tries - 1)
      }
    }

    return response as Promise<APIResponse<T>>
  }
}

export const handler = new RequestHandler(CONFIG.api_key)
