import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../pages/Socket";
import { usePeer } from "../pages/Peer";
import ReactPlayer from "react-player";
const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer,createAnswer,setAnswer,sendStream,remoteStream } = usePeer();
  const [offerr,setOfferr] = useState("")
  const [myStream,setMyStream] = useState()
  const [remoteEmail,setRemoteEmail] = useState()
  const offerRef = useRef(offerr)
  const handleUserjoin = useCallback(async (data) => {
    const { emailId } = data;
    const offer = await createOffer();
    setOfferr(offer)
    socket.emit("call-user", { emailId, offer });
    setRemoteEmail(emailId)
  }, []);
 
  const handleIncomingCall = useCallback(async (data) => {
    const { fromEmail, offer } = data;
    const ans = await createAnswer(offer)
    socket.emit("call-acceptedd",{fromEmail,ans})
    setRemoteEmail(fromEmail)
  }, []);
   
  const handleCallAccepted = useCallback(async(data)=>{
    const {ans} = data
    await setAnswer(ans)
  },[])
  
  const handleNegosiation =useCallback(()=>{
    const offer = offerRef.current
      socket.emit("call-user", { remoteEmail, offer });
  },[]) 

  const getUserMediaStream=useCallback(async()=>{
   const stream = await navigator.mediaDevices.getUserMedia({video:true})
   setMyStream(stream)
   console.log("this is my stream",stream)
   console.log("this is remote stream",remoteStream)
  },[])
  
  useEffect(()=>{
   offerRef.current = offerr
  },[offerr])
  useEffect(()=>{
    peer.addEventListener("negotiationneeded",handleNegosiation)
   return ()=>{
      peer.removeEventListener("negotiationneeded",handleNegosiation)
    }
  },[handleNegosiation,peer])

  useEffect(()=>{
   getUserMediaStream()
  },[getUserMediaStream])
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
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-slate-400">
      You Entered In Room
      <div>A new user has joined {remoteEmail}</div>
     <button onClick={()=>sendStream(myStream)} className="border-2 border-black p-2 bg-blue-400 text-white">Send My Video</button>
      <ReactPlayer url={myStream} playing muted></ReactPlayer>
      <ReactPlayer url={remoteStream} playing></ReactPlayer>
    </div>
  );
};

export default Room;
