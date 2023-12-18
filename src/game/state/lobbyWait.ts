import { State } from 'fiume'
import Lobby from '../lobby.js'

const stateLobby: (lobby: Lobby) => State = () => {
  return {
    id: 'LOBBY',
    initial: true,
    transitionGuard: ({ event }) => event === 'start', // host start game
    transitionTo: () => 'CHOSECARD'
  }
}

export default stateLobby
