import { FastifyPluginAsync } from 'fastify'
import { SocketStream } from '@fastify/websocket'
import MySocket from '../game/mysocket.js'
import { joinLobby, maxPlayer, isGameStarted } from '../game/game.js'

import { S } from 'fluent-json-schema'

const root: FastifyPluginAsync = async (fastify /*opts*/): Promise<void> => {
  const { httpErrors, websocketServer } = fastify

  MySocket.websocketServer = websocketServer

  fastify.addHook('preValidation', async (/*request, /*reply*/) => {
    // check if the request is authenticated
    if (isGameStarted() || websocketServer.clients.size > maxPlayer() - 1) {
      throw httpErrors.gone()
    }
  })

  const schema = {
    querystring: S.object().prop('nick', S.string())
  }
  fastify.get<{
    Querystring: {
      nick: string
    }
  }>('/', { schema, websocket: true }, (connection: SocketStream, req) => {
    joinLobby(new MySocket(connection.socket), req.query.nick)
  })
}

export default root
