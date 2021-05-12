export type Config = {
  api_key: string
  starting_puuid: string
  sample_size: number
  region: string
  log_progress: boolean
  output_directory: string | undefined
}

export type MatchList = {
  matches: string[]
}

export type PlayerMatchData = {
  puuid: string
  deck_id: string
  deck_code: string
  factions: string[]
  game_outcome: string
  order_of_play: number
}

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

export type DeckData = {
  champions: string
  regions: string
  wins: number
  losses: number
}

export type WinrateData = {
  champions: string
  regions: string
  winrate: string
  sampleSize: number
}

export type API_TYPE = 'matchList' | 'matchData'

export type APIResponse<T> = T extends 'matchList'
  ? MatchList
  : T extends 'matchData'
  ? MatchData
  : never

export type Card = {
  name: string
  cardCode: string
  rarityRef: string
  regionRef: string
}
