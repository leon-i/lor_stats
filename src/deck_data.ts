import { DeckEncoder } from 'runeterra'
import { CHAMP_DATA, TOTAL_DECK_DATA } from './constants'
import { DeckData, PlayerMatchData } from './types'

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
    match,
  )
}

const createOrUpdateDeckData = (data: DeckData, match: PlayerMatchData): void => {
  const existingDeckData = TOTAL_DECK_DATA.find((deck) => {
    return deck.champions === data.champions && deck.regions === data.regions
  })

  if (existingDeckData) {
    if (match.game_outcome === 'win') {
      existingDeckData.wins += 1
    } else if (match.game_outcome === 'loss') {
      existingDeckData.losses += 1
    }
  } else {
    TOTAL_DECK_DATA.push(data)
  }
}
