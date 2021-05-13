import yaml from 'js-yaml'
import fs from 'fs'
import { Config, DeckData } from './types'

// config loaded from config.yml
export const CONFIG = yaml.load(fs.readFileSync('config.yml', 'utf8')) as Config

// contains champ data with card code mapped to champion name
export const CHAMP_DATA: { [code: string]: string } = {}

// contains data collected from match history
export const TOTAL_DECK_DATA: DeckData[] = []

// maps of seen ids to prevent duplicate data
export const SEEN_PLAYERS: { [playerId: string]: boolean } = {}
export const SEEN_MATCHES: { [matchId: string]: boolean } = {}
