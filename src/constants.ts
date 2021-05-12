import yaml from 'js-yaml'
import fs from 'fs'
import { Config, DeckData } from './types'

export const CONFIG = yaml.load(fs.readFileSync('config.yml', 'utf8')) as Config

export const CHAMP_DATA: { [code: string]: string } = {}
export const TOTAL_DECK_DATA: DeckData[] = []
export const SEEN_PLAYERS: { [playerId: string]: boolean } = {}
export const SEEN_MATCHES: { [matchId: string]: boolean } = {}
