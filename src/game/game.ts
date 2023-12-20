import MySocket from './mysocket.js'
import Lobby from './lobby.js'

const lobby = new Lobby()

import { StateMachine, State } from 'fiume'
import stateLobby from './state/lobbyWait.js'
import stateChoseCard from './state/choseCard.js'
import stateChoseWinner from './state/choseWinner.js'
import stateFinish from './state/finish.js'
const states: Array<State> = [
  stateLobby(lobby),
  stateChoseCard(lobby),
  stateChoseWinner(lobby),
  stateFinish(lobby)
]

// Create a state machine instance
const machine = StateMachine.from(states)

// Start the state machine
await machine.start()

export function maxPlayer() {
  return lobby.maxPlayer()
}

export function isGameStarted(){
  return machine.currentStateId !== 'LOBBY'
}

export function joinLobby(mySocket: MySocket, nickname: string) {
  const { id } = mySocket
  function exit() {
    lobby.delete(id)
  }
  lobby.add(mySocket, nickname)
  mySocket.onclose(exit)
  mySocket.onerror(exit)

  lobby.sendPoints()

  mySocket.on<string>('start', async () => {
    if (lobby.isHost(id)) {
      await machine.send('start')
    }
  })

  mySocket.on<number[]>('choseCards', async n => {
    if (!lobby.isMaster(id)) {
      lobby.choseCard(id, n)
      await machine.send('chose card')
    }
  })

  mySocket.on<number>('choseWinner', async n => {
    if (lobby.isMaster(id)) {
      lobby.choseWinner(n)
      await machine.send('chose winner')
    }
  })
}
