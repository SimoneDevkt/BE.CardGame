/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket, WebSocketServer } from 'ws'
type payload = string | number | object | any[]

interface socketMessage {
  method: string
  payload: payload
}

export default class MySocket {
  messages = new Map<string, (data: any) => void>()
  constructor(
    private socket: WebSocket,
    private websocketServer: WebSocketServer
  ) {
    this.socket.on('message', message => {
      const { method, payload }: socketMessage = JSON.parse(message.toString())
      const cb = this.messages.get(method)
      if (cb) {
        cb(payload)
      }
    })
  }
  on<T extends payload>(str: string, cb: (payload: T) => void): void {
    this.messages.set(str, cb)
  }
  send<T>(method: string, payload: T): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ method, payload }))
    }
  }
  broadcast<T>(method: string, payload: T) {
    this.websocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ method, payload }))
      }
    })
  }
}
