import { useEffect, useState } from "react"


export function Sender(){
    const [socket , setSocket] = useState<WebSocket | null>(null);
   const [pc, setPC] = useState<RTCPeerConnection | null>(null);
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080')
        setSocket(socket);
        socket.onopen = () => {
            socket.send(JSON.stringify({type : 'sender'}))
        }

    } , [])

    async function startSendingVideo()  {
        if(!socket) return;
       
        const pc = new RTCPeerConnection();
        setPC(pc);

        socket.onmessage = async(event) =>{
            const message = JSON.parse(event.data)
            if(message.type === 'createAnswer'){
               await pc.setRemoteDescription(message.sdp);
            }else if(message.type === 'iceCandidate'){
                pc.addIceCandidate(message.candidate);
            }
        }
        pc.onicecandidate = (event) =>{
            console.log(event);
            if(event.candidate){
                socket?.send(JSON.stringify({type : 'iceCandidate' , candidate : event.candidate}))
            }
        }
            pc.onnegotiationneeded = async()=>{
            console.log("negotiotion done")
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({
                type : 'createOffer' ,
                sdp : pc.localDescription}))

        }

        const stream = await navigator.mediaDevices.getUserMedia({video:true , audio : false })
        pc.addTrack(stream.getVideoTracks()[0]);
    }

    return (
        <>
      <button onClick={startSendingVideo}>Send Video</button>
        
        </>
    )
}