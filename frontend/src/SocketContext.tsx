import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

interface context {
  call: calluser;
  callAccepted:boolean
  myvideo:React.RefObject<HTMLVideoElement>,
  userVideo:React.RefObject<HTMLVideoElement>,
  stream:MediaStream | undefined,
  name:string,
  setName:React.Dispatch<React.SetStateAction<string>>
  callEnded:boolean
  me:string,
  callUser:(id:string)=>void,
  leaveCall:()=>void,
  answerCall:()=>void
}

const SocketContext = createContext<context |null>(null);
const server=process.env.REACT_APP_SERVER || "http://localhost:8000"
const socket = io(server);

const ContextProvider = ({ children }: { children: JSX.Element }) => {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [me, setMe] = useState<string>("");
  const [call, setCall] = useState<calluser>({
    isReceivedCall: false,
    from: "",
    name: "",
    signal: "",
  });
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const myvideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      
        if (myvideo.current) {
          myvideo.current.srcObject = currentStream;
          if (myvideo.current.srcObject) {
          }
        }
        
      });
     
    socket.on("me", (me: string) => setMe(me));

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });
    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });
    peer.signal(call.signal);

    if (connectionRef.current) {
      connectionRef.current = peer;
    }
  };
  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });
    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });
    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);

    });
    
    connectionRef.current = peer;
  };
  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myvideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

type calluser = {
  isReceivedCall: boolean;
  from: string;
  name: string;
  signal: string | SignalData;
};
