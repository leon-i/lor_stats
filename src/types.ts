// config set in config.yml
export type Config = {
  api_key: string
  starting_puuid: string
  sample_size: number
  region: string
  log_progress: boolean
  output_directory: string | undefined
}

// match list returned from Riot match history api
export type MatchList = {
  matches: string[]
}

// player data returned from Riot match data api under players key
export type PlayerMatchData = {
  puuid: string
  deck_id: string
  deck_code: string
  factions: string[]
  game_outcome: string
  order_of_play: number
}

// match data returned from Riot match data api
export type MatchData = {
  metadata: {
    data_version: string
    match_id: string
    participants: string[]
  }
  info: {
    game_mode: string
    game_type: string
    game_start_time: string
    game_version: string
    players: PlayerMatchData[]
  }
}

// deck data object stored in TOTAL_DECK_DATA global object
export type DeckData = {
  champions: string
  regions: string
  wins: number
  losses: number
}

// formatted deck data that is exported and logged
export type WinrateData = {
  champions: string
  regions: string
  winrate: string
  sampleSize: number
}

// api endpoint types
export type API_TYPE = 'matchList' | 'matchData'

// api response types based on endpoint
export type APIResponse<T> = T extends 'matchList'
  ? MatchList
  : T extends 'matchData'
  ? MatchData
  : never

// card data structure returned from data dragon api
export type Card = {
  name: string
  cardCode: string
  rarityRef: string
  regionRef: string
}
