import fetch from 'node-fetch'
import { CHAMP_DATA } from './constants'
import { Card } from './types'

/*
  Gathers set data from data dragon then formats and assigns champion data
  to CHAMP_DATA global object
 */
export const getCardData = async (): Promise<void> => {
  let allCardData: Card[] = []
  const setNumbers: number[] = [1, 2, 3, 4]

  // collect card data from each set
  for (const setNumber of setNumbers) {
    const data = await fetch(
      `https://dd.b.pvp.net/latest/set${setNumber}/en_us/data/set${setNumber}-en_us.json`,
    )
    const cardData: Card[] = await data.json()

    allCardData = [...allCardData, ...cardData]
  }

  // get only champions from card data
  const allChamps = allCardData.filter((card) => card.rarityRef === 'Champion')
  allChamps.forEach((champ) => (CHAMP_DATA[champ.cardCode] = champ.name))
}
