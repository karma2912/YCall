import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../pages/Socket";
import { usePeer } from "../pages/Peer";
import ReactPlayer from "react-player";
const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer,createAnswer,setAnswer,sendStream,remoteStream ,handleIncomingPeer} = usePeer();
  const [offerr,setOfferr] = useState("")
  const [myStream,setMyStream] = useState()
  const [remoteEmail,setRemoteEmail] = useState()
  const offerRef = useRef(offerr)

console.log("this is remote stream",remoteStream)
  const handleUserjoin = useCallback(async (data) => {
    const { emailId } = data;
    const offer = await createOffer();
    console.log("This is offer ",offer)
    setOfferr(offer)
    socket.emit("call-user", { emailId, offer });
    setRemoteEmail(emailId)
  }, []);
 
  const handleIncomingCall = useCallback(async (data) => {

    const { fromEmail, offer } = data; 
    const ans = await createAnswer(offer)
    socket.emit("call-accepted",{fromEmail,ans})
    setRemoteEmail(fromEmail)
  }, []);

  const handleCallAccepted = useCallback(async(data)=>{
    const {ans} = data
    console.log("This is the answer which is received",ans)
    await setAnswer(ans)
  },[])
  
  const handleNegosiation =useCallback(()=>{
    const offer = offerRef.current
      socket.emit("call-user", { remoteEmail, offer });
  },[]) 

  const getUserMediaStream=useCallback(async()=>{
    console.log("byeeeeeeeeeeeeeeeeee")
   const stream = await navigator.mediaDevices.getUserMedia({video:true})
   console.log("this is my streammmm",stream)
   console.log("function after get user media")
   sendStream(stream)
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
   console.log("hoooooooooooo",myStream)
  },[getUserMediaStream])
  useEffect(() => {
    socket.on("user-joined", handleUserjoin);
    console.log("Function after user join")
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted",handleCallAccepted)
    return ()=>{
        socket.off("user-joined", handleUserjoin);
        socket.off("incoming-call", handleIncomingCall);
        socket.off("call-accepted",handleCallAccepted)
    }
  }, [socket]);
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-slate-400 overflow-x-hidden">
      <p className="h-1/4  w-full flex justify-center items-center"> You Entered In Room</p>
      <div className="h-full w-full flex md:flex-row flex-col justify-center items-start">
        <div className="h-full w-full flex flex-col justify-center items-center">
      <p className="text-center pb-5">This is main user</p><ReactPlayer url={myStream} playing muted></ReactPlayer>
      </div>
      <div className="h-full w-full flex flex-col justify-center items-center"> 
      <p className="text-center pb-5">{`{This is ${remoteEmail} }`}</p><ReactPlayer url={remoteStream} playing muted></ReactPlayer>
      </div>
      </div>
    </div>
  );
};

export default Room;
