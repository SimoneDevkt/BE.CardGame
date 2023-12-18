//TODO let deck chose to host
import deckJson from '../assets/deck1.json'
import Deck, { Phrases, Words } from './deck.js'
import MySocket from './mysocket.js'

interface hands {
  points: number
  cards: Words[]
  ws: MySocket
}

const maxCardsInHands = 10
const maxPlayerInLobby = 4

export default class Lobby {
  nextManche() {
    //MySocket.broadcast<number>('NEXTMANCHE', 34)
    this.chosenCards.clear()
    if (this.master === '') {
      //set random master
    }
    const phrase = this.deck.getPhraseCards()
    this.players.forEach((player, key) => {
      if(player.cards.length < maxCardsInHands){        
        player.cards.push(...this.deck.getWordCards(maxCardsInHands - player.cards.length))
      }
      const payload = {
        phrase,
        cards: player.cards
      }
      if (this.master === key) {
        player.ws.send('nextManche', payload)
      } else {
        player.ws.send('nextMancheMaster', payload)
      }
    })
  }
  choseCard(id: string, n: number[]) {
    if(this.master !== id){      
      this.chosenCards.set(id, n)
    }
  }
  isChoseCardComplete(){
    return this.players.size >= this.chosenCards.size - 1
  }
  private chosenCards: Map<string, number[]> = new Map()
  private players: Map<string, hands>
  private host: string
  private master: string
  private deck: Deck
  constructor() {
    this.players = new Map()
    this.host = ''
    this.master = ''
    this.deck = new Deck(<Phrases[]>(<unknown>deckJson.phrases), <Words[]>(<unknown>deckJson.words))
    console.log(this.deck, this.master)
  }
  get size() {
    return this.players.size
  }
  add(ws: MySocket) {
    const initial: hands = {
      points: 0,
      cards: [],
      ws
    }
    this.players.set(ws.id, initial)
    if (this.host === '') {
      this.host = ws.id
    }
  }
  delete(id: string) {
    this.players.delete(id)
    if (this.host === id) {
      const [first] = this.players.keys()
      this.host = first ?? ''
    }
  }
  isHost(id: string) {
    return this.host === id
  }
  maxPlayer() {
    // TODO let max player chose to host
    return maxPlayerInLobby
  }
}
