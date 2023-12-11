import { FastifyPluginAsync } from 'fastify'
import { SocketStream } from '@fastify/websocket'
import MySocket from '../game/mysocket'
import { game } from '../game/game'

const root: FastifyPluginAsync = async (fastify /*opts*/): Promise<void> => {
  fastify.get('/', { websocket: true }, (connection: SocketStream /*req: FastifyRequest*/) => {
    game(new MySocket(connection.socket, fastify.websocketServer))
  })
}

export default root
