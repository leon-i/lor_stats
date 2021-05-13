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
  })
  .catch((e) => {
    console.error(`ERROR - ${e.message}`)
  })
  .finally(() => {
    const { formattedData, totalSample } = formatDeckData()

    logData(formattedData, totalSample)
    writeDataToJson(formattedData, totalSample)
  })
