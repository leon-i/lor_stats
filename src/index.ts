import { getMatches } from './get_matches'
import { getCardData } from './card_data'
import { formatDeckData, logData, writeDataToJson } from './util'

const main = async () => {
  await getCardData()
  await getMatches()
}

main()
  .then(() => {
    console.log('done - no errors :)')
    const { formatted, totalSample } = formatDeckData()

    logData(formatted, totalSample)
    writeDataToJson(formatted, totalSample)
  })
  .catch((e) => {
    console.error(`ERROR - ${e.message}`)
    const { formatted, totalSample } = formatDeckData()

    logData(formatted, totalSample)
    writeDataToJson(formatted, totalSample)
  })
