import {WebSocketServer , WebSocket} from 'ws';

const wss = new WebSocketServer({port : 8080});

let senderSocket: null | WebSocket = null;
let receiverSocket : null | WebSocket = null;

wss.on('connection' , function connection(ws){
    ws.on('message' , function message(data : any){
        const message = JSON.parse(data);
        console.log(message);

        if(message.type === 'sender'){
            senderSocket = ws;
            console.log("sender set")
        }else if(message.type==='receiver'){
            receiverSocket = ws;
            console.log("receiver set")
        }else if(message.type==='createOffer'){
            console.log("offer received")
            receiverSocket?.send(JSON.stringify({type : 'createOffer' , sdp : message.sdp}))
        }else if(message.type==='createAnswer'){
            console.log("Answer received")
            senderSocket?.send(JSON.stringify({type : 'createAnswer' , sdp : message.sdp}))
        }else if(message.type === 'iceCandidate'){
            if(ws === senderSocket){
                receiverSocket?.send(JSON.stringify({type: 'iceCandidate' , candidate: message.candidate}))
            }else if(ws === receiverSocket){
                senderSocket?.send(JSON.stringify({type : 'iceCandidate' , candidate : message.candidate}))
            }
        }


    })
})