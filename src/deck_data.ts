import { DeckEncoder } from 'runeterra'
import { CHAMP_DATA, TOTAL_DECK_DATA } from './constants'
import { DeckData, PlayerMatchData } from './types'

/*
  Accepts match data and formats it before passing to createOrUpdateDeckData

  @param {object} match match data returned from Riot api
  @param {string} match.puuid
  @param {string} match.deck_id
  @param {string} match.deck_code
  @param {string[]} match.factions
  @param {string} match.game_outcome
  @param {string} match.order_of_play
 */
export const generateDeckData = (match: PlayerMatchData): void => {
  const regionsFormatted = match.factions.map((region) => region.split('_')[1]).join('_')
  const deck = DeckEncoder.decode(match.deck_code)

  const champArr: string[] = []

  for (let i = 0; i < deck.length; i++) {
    const champName = CHAMP_DATA[deck[i].code]

    if (champName && !champArr.includes(champName)) {
      champArr.push(champName)
    }
  }

  const champsFormatted = champArr.length > 0 ? champArr.sort().join('_') : 'champless'
  return createOrUpdateDeckData(
    {
      regions: regionsFormatted,
      champions: champsFormatted,
      wins: match.game_outcome === 'win' ? 1 : 0,
      losses: match.game_outcome === 'loss' ? 1 : 0,
    },
    match.game_outcome,
  )
}

/*
  Accepts formatted deck data and match info then updates global deck data object

  @param {object} data
  @param {string} data.champions combined string of champions in deck
  @param {string} data.regions combined string of regions in deck
  @param {number} data.wins total wins
  @param {number} data.losses total losses

  @param {string} matchOutcome
 */
const createOrUpdateDeckData = (data: DeckData, matchOutcome: string): void => {
  // check to see if deck exists already in global object
  const existingDeckData = TOTAL_DECK_DATA.find((deck) => {
    return deck.champions === data.champions && deck.regions === data.regions
  })

  if (existingDeckData) {
    // only update counter on win or loss (ignore ties)
    if (matchOutcome === 'win') {
      existingDeckData.wins += 1
    } else if (matchOutcome === 'loss') {
      existingDeckData.losses += 1
    }
  } else {
    TOTAL_DECK_DATA.push(data)
  }
}
