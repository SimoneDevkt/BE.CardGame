import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    connection.socket.on('message', message => {
      // message.toString() === 'hi from client'
      connection.socket.send(JSON.stringify({
        method: 'message1',
        payload: 'hi from server'
      }))
    })
  })
}

export default root;
