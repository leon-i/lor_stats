import fs from 'fs'
import { CONFIG, TOTAL_DECK_DATA } from './constants'
import { WinrateData } from './types'

export const formatDeckData = (): {
  formatted: WinrateData[]
  totalSample: number
} => {
  const formatted = TOTAL_DECK_DATA.map((deckData) => ({
    champions: deckData.champions,
    regions: deckData.regions,
    winrate: `${((deckData.wins / (deckData.wins + deckData.losses)) * 100).toFixed(1)}%`,
    sampleSize: deckData.wins + deckData.losses,
  })).sort((a, b) => b.sampleSize - a.sampleSize)

  const totalSample: number = formatted.reduce((acc, curr) => {
    return acc + curr.sampleSize
  }, 0)

  return { formatted, totalSample }
}

export const logData = (formattedData: WinrateData[], totalSample: number): void => {
  formattedData.forEach((data) => {
    console.log(
      `${data.champions} - ${data.regions} - WINRATE: ${data.winrate} - SAMPLE SIZE: ${data.sampleSize}`,
    )
  })

  console.log(`TOTAL SAMPLE SIZE: ${totalSample}`)
}

export const writeDataToJson = (formattedData: WinrateData[], totalSample: number): void => {
  const output = JSON.stringify({
    total_sample: totalSample,
    decks: formattedData,
  })
  const outputDirectory = CONFIG.output_directory || './data'

  if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory)

  fs.writeFile(`${outputDirectory}/deck_data_${Date.now()}.json`, output, (e) => {
    if (e) {
      console.log(e.message)
      throw Error('Error parsing to json')
    }
  })
}
