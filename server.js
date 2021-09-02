let time
const webSocket = require('ws')
const server = new webSocket.Server({ port: 9999 })
console.log(server.clients)

server.on('open', function open() {
    console.log('connected');
});

server.on('close', function close() {
    clearInterval(time)
    console.log('disconnected');
});

server.on('connection' , (socket , req) =>{
    // socket.onmessage(() => {

    // })
    time = setInterval(() => {
        let arr = new Array(32).fill(0)
        for(let i = 0 ; i < 8 ; i ++ ){
            arr[i*4] = parseInt(Math.random()*255)
        }
        // if(webSocket.OPEN == ){
            socket.send(JSON.stringify({data :arr}) )
            console.log(arr.length)
        // }
        
    } , 20)
    socket.close=() => {
        console.log('断线')
    }
})
