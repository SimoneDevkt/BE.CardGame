//TODO let deck chose to host
import deckJson from '../assets/deck1.json' assert { type: 'json' }
import Deck, { Phrases, Words } from './deck.js'
import MySocket from './mysocket.js'

interface hands {
  nickname: string
  points: number
  cards: Words[]
  ws: MySocket
}

const maxCardsInHands = 10
const maxPlayerInLobby = 4

function random32bit<T>(a: Array<T>): T {
  //https://coderwall.com/p/9b6ksa/is-faster-than-math-floor
  return a[~~(Math.random() * a.length)]
}

export default class Lobby {
  private chosenCards: Map<string, Words[]> = new Map()
  private numberToChose: number = 0
  private players: Map<string, hands> = new Map()
  private host: string = ''
  private master: string = ''
  private deck: Deck
  constructor() {
    this.players
    this.host
    this.master
    this.deck = new Deck(<Phrases[]>(<unknown>deckJson.phrases), <Words[]>(<unknown>deckJson.words))
  }
  nextManche() {
    this.chosenCards.clear()
    if (this.master === '') {
      //set random master
      this.master = random32bit([...this.players.keys()])
    }
    const phrase = this.deck.getPhraseCard()

    this.numberToChose = phrase.reduce((tot, x) => tot + (x === '' ? 1 : 0), 0)
    this.players.forEach((player, key) => {
      if (player.cards.length < maxCardsInHands) {
        player.cards.push(...this.deck.getWordCards(maxCardsInHands - player.cards.length))
      }
      const payload = {
        phrase,
        cards: player.cards
      }
      player.ws.send(this.isMaster(key) ? 'nextMancheMaster' : 'nextManche', payload)
    })
  }
  choseCard(id: string, n: number[]) {    
    if(this.chosenCards.has(id)){
      this.players.get(id)?.ws.send<string>('error', `cards already send`)
      return
    }
    if (n.length !== this.numberToChose) {
      this.players.get(id)?.ws.send<string>('error', `required ${this.numberToChose} cards`)
      return
    }
    const { cards } = this.players.get(id)!
    this.chosenCards.set(
      id,
      n.map(e => cards.splice(e, 1)[0])
    )
  }
  isChoseCardComplete() {
    return this.players.size - 1 <= this.chosenCards.size
  }
  choseWinnerStart() {
    const payload = [...this.chosenCards.values()]
    this.players.forEach((player, key) => {
      player.ws.send(!this.isMaster(key) ? 'waitChoseWinner' : 'choseWinner', payload)
    })
  }
  choseWinner(n: number) {
    const playerId = [...this.chosenCards.keys()][n]
    this.players.get(playerId)!.points++

    this.master = playerId

    this.sendPoints()
  }
  sendPoints() {
    const points = [...this.players.values()].map(e => {
      return {
        points: e.points,
        name: e.nickname
      }
    })
    MySocket.broadcast('points', points)
  }
  isGameFinished() {
    return false
  }
  get size() {
    return this.players.size
  }
  add(ws: MySocket, nickname: string) {
    const initial: hands = {
      nickname,
      points: 0,
      cards: [],
      ws
    }
    this.players.set(ws.id, initial)
    if (this.host === '') {
      this.host = ws.id
      ws.send('youAreHost', {})
    }
  }
  delete(id: string) {
    this.players.delete(id)
    if (this.host === id) {
      const [first] = this.players.keys()
      this.host = first ?? ''      
      this.players.get(first)?.ws.send('youAreHost', {})
    }
  }
  isHost(id: string) {
    return this.host === id
  }
  isMaster(id: string) {
    return this.master === id
  }
  maxPlayer() {
    // TODO let max player chose to host
    return maxPlayerInLobby
  }
}
