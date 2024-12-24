import { useEffect } from "react"


export function Receiver(){
    
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080')
      const pc = new RTCPeerConnection();
            socket.onopen = () =>{
                socket.send(JSON.stringify({type : 'receiver'}))
            }

            
            socket.onmessage = (event)=>{
                const message = JSON.parse(event.data);
                if(message.type === 'createOffer'){
                    
                    pc.setRemoteDescription(message.sdp).then(() => {
                        pc.createAnswer().then((answer) => {
                            pc.setLocalDescription(answer);
                            socket.send(JSON.stringify({
                                type: 'createAnswer',
                                sdp: answer
                            }));
                        });
                    });
                    
                    
                    pc.onicecandidate = (event) =>{
                        console.log(event);
                        if(event.candidate){
                            socket?.send(JSON.stringify({type : 'iceCandidate' , candidate : event.candidate}))
                        }
                    }
                    
                    pc.ontrack =( event ) =>{
                        const video =document.createElement('video')
                        document.body.appendChild(video);
                        video.srcObject = new MediaStream([event.track])
                        video.play();

                          // Wait for user interaction to play
                          const playButton = document.createElement('button');
                          playButton.textContent = 'Play Video';
                          document.body.appendChild(playButton);
                    }
                    
                    
                } else if(message.type === 'iceCandidate' && pc){
                
                        pc.addIceCandidate(message.candidate);
                  
                 }
            }



    } ,[])

    

    return (
        <>
        <div>
            I am receiver   
        </div>
        
        </>
    )
}