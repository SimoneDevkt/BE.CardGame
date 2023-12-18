export interface Phrases {
  phrase: string[]
}

export interface Words {
  word: string
}

export default class Deck {
  constructor(
    private cardsPhrases: Phrases[],
    private cardsWords: Words[]
  ) {}
  private getCards<T extends Phrases | Words>(deck: T[], n: number = 1): T[] {
    const cards = []
    for (let i = 0; i < n; i++) {
      cards.push(this.getCard(deck))
    }
    return cards
  }
  private getCard<T extends Phrases | Words>(deck: T[]): T {
    const l = deck.length
    if (l < 1) {
      throw new Error('deckEmpty')
    }
    const n = Math.floor(Math.random() * l) //chose random card

    const ris = deck[n] //salvo il valore
    deck.splice(n, 1) //elimino il valore
    return ris
  }
  getPhraseCards(n = 1): Phrases[] {
    return this.getCards(this.cardsPhrases, n)
  }
  getWordCards(n = 1): Words[] {
    return this.getCards(this.cardsWords, n)
  }
}
