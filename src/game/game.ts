import MySocket from './mysocket'

export function game(x: MySocket) {
  /*const test = () => {
        console.log('Error')
    }
    /*x.onerror(test)

    x.onclose(test)

    //await x.onopen()

    x.onopen()*/

  x.send<number>('message1', 3222)

  x.on<string>('message2', string1 => {
    console.log(string1)
  })

  /*x.onclose((err) => {
        console.log(err)
    })*/
}
