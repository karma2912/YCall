
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"

const PeerContext = React.createContext()

export const usePeer =() => React.useContext(PeerContext)

export const PeerProvider = (props) =>{
    const [remoteStream,setRemoteStream] = useState()
   const [remoteTrack,setRemoteTrack] = useState()
    const peer = useMemo(()=> new RTCPeerConnection(),[])

    const createOffer= async ()=>{
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        return offer
    }

    const createAnswer = async(offer)=>{
        console.log(offer)
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        return answer
    }

    const sendStream = async(stream)=>{
      const tracks = stream.getTracks()
      for(const track of tracks){
        console.log(track)
       console.log("peer addtrack",peer.addTrack(track,stream))
       setRemoteTrack(track)
      }
    }

    const handleTrackEvent = useCallback((ev)=>{
      console.log("inside track function")
        const streams = ev.streams
        console.log("these are streams under handletrackevent",streams)
        setRemoteStream(streams[0])
    },[])
 

   useEffect(()=>{
    peer.addEventListener('track',handleTrackEvent)
    console.log("inside handletrack useeffect")
    return()=>{
      peer.removeEventListener('track',handleTrackEvent)
    }
  },[remoteTrack])

    const setAnswer = async(ans)=>{
        await peer.setRemoteDescription(ans)
    }
 return (
    <PeerContext.Provider value={{peer,createOffer,createAnswer,setAnswer,sendStream,remoteStream}}>
     {props.children}
   </PeerContext.Provider>
   )}