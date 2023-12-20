export type Phrases = string[]

export type Words = string

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

    const [ris] = deck.splice(n, 1) //get value
    return ris
  }
  getPhraseCard(): Phrases {
    return this.getCard(this.cardsPhrases)
  }
  getWordCards(n = 1): Words[] {
    return this.getCards(this.cardsWords, n)
  }
}
