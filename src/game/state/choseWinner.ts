import { State } from 'fiume'
import Lobby from '../lobby.js'

const stateChoseWinner: (lobby: Lobby) => State = lobby => {
  return {
    id: 'CHOSEWINNER',
    onEntry: () => {
      lobby.choseWinnerStart()
    },
    transitionGuard: ({ event }) => event === 'chose winner', // master chose card winner
    transitionTo: () => {
      return lobby.isGameFinished() ? 'FINISH' : 'CHOSECARD'
    }
  }
}

export default stateChoseWinner
