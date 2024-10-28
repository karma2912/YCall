import React, { useEffect, useState } from 'react'
import { useSocket } from '../pages/Socket'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const {socket} = useSocket()
    const navigate = useNavigate()
    useEffect(()=>{
      socket.on('joined-room',(roomId)=>{
        navigate(`/room/${roomId}`)
      })
    },[])
    const [emailId,setEmailId] = useState("")
    const [roomId,setRoomId] = useState("")
    const handleEnter =()=>{
      socket.emit("join-team",{roomId,emailId})
      setEmailId("")
      setRoomId("")
    }
  return (
    <div className='h-[100vh] w-[100vw] flex justify-center items-center bg-gray-300'>
      <div className='h-96 w-96 flex flex-col rounded-lg justify-center items-center bg-red-200' style={{backgroundColor:"#133E87"}}>
        <input type='email' value={emailId} onChange={e=>{setEmailId(e.target.value)}} placeholder='Enter Email' className='h-10 w-60 rounded-md border-2 border-gray-400 p-2 mb-6 text-black placeholder-black'  style={{backgroundColor:"#608BC1"}}/>
        <input type='text' value={roomId} onChange={e=>{setRoomId(e.target.value)}} placeholder='Enter Room Id' className='h-10 w-60 mb-6 rounded-md border-gray-400 border-2 p-2 placeholder-black' style={{backgroundColor:"#608BC1"}}/>
        <button className=' p-3 rounded-md border-blue-500 bg-slate-400 hover:bg-slate-500' onClick={handleEnter}>Enter Room</button>
      </div>
    </div>
  )
}

export default Home
