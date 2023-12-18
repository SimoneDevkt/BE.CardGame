import { State } from 'fiume'
import Lobby from '../lobby.js'

const stateFinish: (lobby: Lobby) => State = () => {
  return {
    id: 'FINISH',
    final: true
  }
}

export default stateFinish
