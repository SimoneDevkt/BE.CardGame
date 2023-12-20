import { State } from 'fiume'
import Lobby from '../lobby.js'

const stateChoseCard: (lobby: Lobby) => State = lobby => {
  return {
    id: 'CHOSECARD',
    onEntry: () => {
      lobby.nextManche()
    },
    transitionGuard: ({ event }) => {
      // TODO add timeout if some player didn't send a card
      if (lobby.isChoseCardComplete()) {
        return event === 'chose card'
      }
      return false
    }, // all player chose card
    transitionTo: () => 'CHOSEWINNER'
  }
}

export default stateChoseCard
