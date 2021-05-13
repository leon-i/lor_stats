import { CONFIG, SEEN_PLAYERS, SEEN_MATCHES } from './constants'
import { handler } from './request_handler'
import { generateDeckData } from './deck_data'
import {
  EU_MATCH_DATA_API_URL,
  EU_MATCHES_API_URL,
  NA_MATCH_DATA_API_URL,
  NA_MATCHES_API_URL,
} from './urls'

/*
  Generates queue of match ids by bouncing from opponents' match history to opponents' match history
  Match ids are then used to request match data which is in turn processed and logged TOTAL_DECK_DATA
  in global object

  Seen player ids and match ids are logged in SEEN_PLAYERS and SEEN_MATCHES to avoid duplicates

  Only ranked data is logged and queue length is roughly determined by sample size set in config.yml
 */
export const getMatches = async (): Promise<void> => {
  const { matchApiUrl, matchDataApiUrl } = getApiUrls()

  const { matches } = await handler.yep(
    'matchList',
    matchApiUrl,
    CONFIG.starting_puuid || '',
    '/ids',
  )

  let queue = [...matches]
  let queueFull = false

  while (queue.length) {
    const current = queue.shift()

    const { metadata, info } = await handler.yep('matchData', matchDataApiUrl, current || '')

    const opponentId = metadata.participants[1]

    if (
      !SEEN_PLAYERS[opponentId] &&
      !SEEN_MATCHES[metadata.match_id] &&
      info.game_type === 'Ranked'
    ) {
      SEEN_PLAYERS[opponentId] = true
      SEEN_MATCHES[metadata.match_id] = true

      info.players.forEach((player) => {
        generateDeckData(player)
      })

      if (!queueFull) {
        const opponentMatchList = await handler.yep('matchList', matchApiUrl, opponentId, '/ids')

        queue = [...queue, ...opponentMatchList.matches]

        if (CONFIG.log_progress) console.log(`queue length - ${queue.length}`)
        if (queue.length >= CONFIG.sample_size) queueFull = true
      }
    }
  }
}

/*
  Returns api urls based on region set in config.yml
 */
const getApiUrls = (): { matchApiUrl: string; matchDataApiUrl: string } => {
  switch (CONFIG.region) {
    case 'na':
      return {
        matchApiUrl: NA_MATCHES_API_URL,
        matchDataApiUrl: NA_MATCH_DATA_API_URL,
      }
    case 'eu':
      return {
        matchApiUrl: EU_MATCHES_API_URL,
        matchDataApiUrl: EU_MATCH_DATA_API_URL,
      }
    default:
      return {
        matchApiUrl: NA_MATCHES_API_URL,
        matchDataApiUrl: NA_MATCH_DATA_API_URL,
      }
  }
}
