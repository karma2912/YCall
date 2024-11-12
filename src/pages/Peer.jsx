import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useSocket } from "../pages/Socket";

const PeerContext = React.createContext()

export const usePeer =() => React.useContext(PeerContext)

export const PeerProvider = (props) =>{
  const { socket } = useSocket();
  
    const [remoteStream,setRemoteStream] = useState()
   const [remoteTrack,setRemoteTrack] = useState()
   const peer = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

    console.log("Peer connection state:", peer.connectionState);
    console.log("Peer ice connection state:", peer.iceConnectionState);
   
    peer.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peer.iceConnectionState);
    };
     
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE Candidate:", event.candidate);
        socket.emit("ice-candidate", event.candidate);
      }
    };
   
    const handleIceCandidate =(data)=>{
      console.log("I am adding the candidates through addIceCandidate...........")
        peer.addIceCandidate(new RTCIceCandidate(data));  // Add received candidate

    }
    useEffect(()=>{
      socket.on('ice-candidate',handleIceCandidate)
      return()=>{
        socket.off('ice-candidate',handleIceCandidate)
      }
    },[socket])

    const createOffer= async ()=>{
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        return offer
    }
    
    const handleIncomingPeer =()=>{
      console.log("incoming peer from handlincomingpeer function")
    }
    const createAnswer = async(offer)=>{
       console.log("This offer is received",offer)
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer()
        console.log("This is the answer which is sent",answer)
        await peer.setLocalDescription(answer)

        return answer
    }

    const sendStream = async(stream)=>{
      const tracks = stream.getTracks()
      for(const track of tracks){
       peer.addTrack(track,stream)
       console.log("this is track",track)
       setRemoteTrack(track)
      }
    }


    peer.ontrack = (event) => {
      console.log("Received remote track", event);
      // Ensure the remote stream is correctly set in state
      const remoteStream = event.streams;
      setRemoteStream(remoteStream[0]);  // Store it in state for rendering
    };

    const setAnswer = async(ans)=>{
      console.log("this is the answer which is been set to remote description",ans)
      await peer.setRemoteDescription(ans)
    }
    

 return (
    <PeerContext.Provider value={{peer,createOffer,createAnswer,setAnswer,sendStream,remoteStream,handleIncomingPeer}}>
     {props.children}
   </PeerContext.Provider>
   )}