import { CONFIG, SEEN_PLAYERS, SEEN_MATCHES } from './constants'
import { handler } from './request_handler'
import { generateDeckData } from './deck_data'
import {
  EU_MATCH_DATA_API_URL,
  EU_MATCHES_API_URL,
  NA_MATCH_DATA_API_URL,
  NA_MATCHES_API_URL,
} from './urls'

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
