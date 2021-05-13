import fs from 'fs'
import { CONFIG, TOTAL_DECK_DATA } from './constants'
import { WinrateData } from './types'

/*
  Formats data stored in TOTAL_DECK_DATA global object for export + logging

  Adds winrate + sample size
 */
export const formatDeckData = (): {
  formattedData: WinrateData[]
  totalSample: number
} => {
  const formattedData = TOTAL_DECK_DATA.map((deckData) => ({
    champions: deckData.champions,
    regions: deckData.regions,
    winrate: `${((deckData.wins / (deckData.wins + deckData.losses)) * 100).toFixed(1)}%`,
    sampleSize: deckData.wins + deckData.losses,
  })).sort((a, b) => b.sampleSize - a.sampleSize)

  const totalSample: number = formattedData.reduce((acc, curr) => {
    return acc + curr.sampleSize
  }, 0)

  return { formattedData, totalSample }
}

/*
  Logs formatted data + sample size in console

  @param {object} formattedData
  @param {string} formattedData.champions combined string of champions in deck
  @param {string} formattedData.regions combined string of regions in deck
  @param {string} formattedData.winrate total % winrate of deck stringifed
  @param {number} formattedData.sampleSize total sample size of matches played by deck

  @param {number} totalSample total sample size of all games played
 */
export const logData = (formattedData: WinrateData[], totalSample: number): void => {
  formattedData.forEach((data) => {
    console.log(
      `${data.champions} - ${data.regions} - WINRATE: ${data.winrate} - SAMPLE SIZE: ${data.sampleSize}`,
    )
  })

  console.log(`TOTAL SAMPLE SIZE: ${totalSample}`)
}

/*
  Dumps formatted data + sample size to JSON and timestamps it
  Dump location defaults to ./data but can be changed in config.yml

  JSON data structure:
  {
    "totalSample": ...,
    "decks": [
      {
        "champions: "...",
        "regions: "...",
        "winrate": "...",
        "sampleSize: ...,
      },
      ...
    ]
  }

  @param {object} formattedData
  @param {string} formattedData.champions combined string of champions in deck
  @param {string} formattedData.regions combined string of regions in deck
  @param {string} formattedData.winrate total % winrate of deck stringifed
  @param {number} formattedData.sampleSize total sample size of matches played by deck

  @param {number} totalSample total sample size of all games played
 */
export const writeDataToJson = (formattedData: WinrateData[], totalSample: number): void => {
  const output = JSON.stringify({
    totalSample,
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
