import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../pages/Socket";
import { usePeer } from "../pages/Peer";
import ReactPlayer from "react-player";
const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer,createAnswer,setAnswer } = usePeer();
  const [myStream,setMyStream] = useState()
  const handleUserjoin = useCallback(async (data) => {
    const { emailId } = data;
    console.log("A new user joined with email Id", emailId);
    const offer = await createOffer();
    socket.emit("call-user", { emailId, offer });
  }, []);
 
  const handleIncomingCall = useCallback(async (data) => {
    const { fromEmail, offer } = data;
    const ans = await createAnswer(offer)
    socket.emit("call-acceptedd",{fromEmail,ans})
  }, []);
   
  const handleCallAccepted = useCallback(async(data)=>{
    const {ans} = data
    console.log("call got accepted",ans)
    await setAnswer(ans)
  },[])
  
  const getUserMediaStream=useCallback(async()=>{
   const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true})
   setMyStream(stream)
  })
  useEffect(()=>{
   getUserMediaStream()
  },[])
  useEffect(() => {
    socket.on("user-joined", handleUserjoin);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted",handleCallAccepted)
    return ()=>{
        socket.off("user-joined", handleUserjoin);
        socket.off("incoming-call", handleIncomingCall);
        socket.off("call-accepted",handleCallAccepted)
    }
  }, [socket]);
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center bg-slate-400">
      You Entered In Room
      <ReactPlayer url={myStream} playing></ReactPlayer>
    </div>
  );
};

export default Room;
