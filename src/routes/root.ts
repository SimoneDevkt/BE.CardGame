import { FastifyPluginAsync } from 'fastify'
import { SocketStream } from '@fastify/websocket'
import MySocket from '../game/mysocket.js'
import { joinLobby, maxPlayer } from '../game/game.js'

const root: FastifyPluginAsync = async (fastify /*opts*/): Promise<void> => {
  const { httpErrors, websocketServer } = fastify

  MySocket.websocketServer = websocketServer

  fastify.addHook('preValidation', async (/*request, /*reply*/) => {
    // check if the request is authenticated
    if (websocketServer.clients.size > maxPlayer() - 1) {
      throw httpErrors.gone()
    }
  })

  fastify.get('/', { websocket: true }, (connection: SocketStream /*req: FastifyRequest*/) => {
    joinLobby(new MySocket(connection.socket))
  })
}

export default root
