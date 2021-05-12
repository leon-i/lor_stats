import fetch from 'node-fetch'
import { CHAMP_DATA } from './constants'
import { Card } from './types'

/*

 CHAMP_DATA
 card code mapped to card name

 {
    "234323": "champ_name"
 }
*/
export const getCardData = async (): Promise<void> => {
  const data = await fetch('https://lorassets.switchblade.xyz/en_us/data/cards.json')
  const cardData: Card[] = await data.json()

  const data2 = await fetch('https://dd.b.pvp.net/latest/set4/en_us/data/set4-en_us.json')
  const cardData2: Card[] = await data2.json()

  const allCardData: Card[] = [...cardData, ...cardData2]

  const allChamps = allCardData.filter((card) => card.rarityRef === 'Champion')
  allChamps.forEach((champ) => (CHAMP_DATA[champ.cardCode] = champ.name))
}
