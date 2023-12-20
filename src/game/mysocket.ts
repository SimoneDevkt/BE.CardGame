import { CloseEvent, ErrorEvent, WebSocket, WebSocketServer } from 'ws'
import { randomUUID } from 'crypto'

type payload = string | number | object | unknown[]

export interface SocketMessage {
  method: string
  payload: payload
}

export default class MySocket {
  private _id: string
  static websocketServer: WebSocketServer
  constructor(private socket: WebSocket) {
    this._id = randomUUID()
    this.socket.on('message', message => {
      const { method, payload }: SocketMessage = JSON.parse(message.toString())
      this.socket.emit(`my_${method}`, payload)
    })
  }
  get id() {
    return this._id
  }
  onerror<T>(cb: (ev: ErrorEvent) => T) {
    this.socket.onerror = cb
  }
  onclose(cb: (ev: CloseEvent) => void) {
    this.socket.onclose = cb
  }
  on<T extends payload>(method: string, cb: (payload: T) => void): void {
    this.socket.on(`my_${method}`, cb)
  }
  send<T extends payload>(method: string, payload: T): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ method, payload }))
    }
  }
  static broadcast<T extends payload>(method: string, payload: T) {
    this.websocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ method, payload }))
      }
    })
  }
}
