import React,{createContext,useState,useRef,useEffect} from "react"
import {io} from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

const SocketContext =createContext("");

const socket =io("http://localhost:5000");


const ContextProvider= ({children}:{children:JSX.Element})=>{
        const [stream, setStream] = useState<MediaStream | undefined>(undefined)
        const [me, setMe] = useState<string>("")
        const [call,setCall]=useState<calluser>({isReceivedCall:false,from:"",name:"",signal:""})
        const [callAccepted,setCallAccepted]=useState<boolean>(false);
        const [callEnded,setCallEnded]=useState<boolean>(false);
        const [name, setName] = useState<string>("")
        
        const myvideo=useRef<HTMLVideoElement>(null);
        const userVideo=useRef<HTMLVideoElement>(null);
        const connectionRef=useRef(null);

        useEffect(()=>{
            navigator.mediaDevices.getUserMedia({video:true,audio:true})
            .then((currentStream)=>{
                setStream(currentStream)
                if(myvideo.current){
                    myvideo.current.srcObject=currentStream
                    if(myvideo.current.srcObject){
                    }
                }
            })

            socket.on("me",(me:string)=>setMe(me))
          
            socket.on("calluser",({from ,name:callerName,signal})=>{
                setCall({isReceivedCall:true,from,name:callerName,signal})
            })
        },[])
        const answerCall=()=>{
            setCallAccepted(true) 
            const peer = new Peer({initiator:false,trickle:false,stream});
            peer.on("signal",(data)=>{
                socket.emit("answercall",{signal:data,to:call.from})
            })
            peer.on("stream",(currentStream)=>{
                if(userVideo.current){
                    userVideo.current.srcObject=currentStream
                }
            })
            peer.signal(call.signal)
            if(connectionRef.current){
                connectionRef.current=peer
            }
        }
        const callUser=(id:string)=>{
            const peer = new Peer({initiator:true,trickle:false,stream});
            peer.on("signal",(data)=>{
                socket.emit("calluser",{userToCall:id,signalData:data,from:me,name})
            })
            peer.on("stream",(currentStream)=>{
                if(userVideo.current){
                    userVideo.current.srcObject=currentStream
                }
            })
            socket.on("callaccepted",(signal)=>{
                setCallAccepted(true)
                peer.signal(signal)
            })
            connectionRef.current=peer
        }
        const leaveCall=()=>{
            setCallEnded(true)
            connectionRef.current.destroy();
            window.location.reload();
        }
}


type calluser={
    isReceivedCall:boolean,
    from:string,
    name:string,
    signal:string | SignalData
}