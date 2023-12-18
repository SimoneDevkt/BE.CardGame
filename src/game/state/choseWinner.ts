import { State } from 'fiume'
import Lobby from '../lobby.js'

const stateChoseWinner: (lobby: Lobby) => State = () => {
  return {
    id: 'CHOSEWINNER',
    transitionGuard: ({ event }) => event === 'chose winner' || event === 'finish', // master chose card winner
    transitionTo: ({ event }) => {
      if (event === 'chose winner') {
        return 'NEXTMANCHE'
      }
      return 'FINISH'
    }
  }
}

export default stateChoseWinner
