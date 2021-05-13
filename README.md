# lor_stats

Utilizes Riot's match history api for Legends of Runeterra to collect deck winrate data of a set sample size by chaining opponents' match history.

Due to Riot development api key method rate limit constraints this tool will only be able to collect ~99 matches/hr (can be increased in `request_handler.ts`).

## Installation

```
git clone https://github.com/leon-i/lor_stats.git

cd lor_stats

yarn install
```

create `config.yml` or rename `config.sample.yml` to `config.yml` and fill out settings to your liking

Riot api keys can be found [here](https://developer.riotgames.com/)  
Starting puuid can be found by querying Riot's account api with your game name + tagline [here](https://developer.riotgames.com/apis#account-v1)

## Usage

Run:

```
yarn start
```

Data will be logged in console upon completion + dumped as JSON in `./data` by default or wherever you specify in `config.yml`

## Notes

Rate limiter values can be changes in `request_handler.ts`. Currently set for development/personal api key values. Method rate limit should stay at 99 or 1 below your api key's method rate limit to avoid 429 errors.
