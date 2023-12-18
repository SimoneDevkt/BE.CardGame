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

export function joinLobby(mySocket: MySocket) {
  function exit() {
    lobby.delete(mySocket.id)
  }
  lobby.add(mySocket)
  mySocket.onclose(exit)
  mySocket.onerror(exit)

  /*mySocket.send<number>('message1', 3222)

  mySocket.on<string>('message2', string1 => {
    console.log(string1)
    MySocket.broadcast<number>('test', 34)
  })*/

  MySocket.broadcast<string>('newUser', `number of player: ${lobby.size}`)

  mySocket.on<string>('start', async () => {
    if (lobby.isHost(mySocket.id)) {
      await machine.send('start')
      // console.log(machine.currentStateId) // CHOSECARD
    }
  })

  mySocket.on<number[]>('cardChose', async (n) => {
    lobby.choseCard(mySocket.id, n)
    await machine.send('chose card')
  })
}
