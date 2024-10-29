import React, { useMemo } from "react"
import {io} from "socket.io-client"

const SocketContext = React.createContext()

export const useSocket =()=>{
    return React.useContext(SocketContext)
}
export const SocketProvider =(props)=>{
    const socket = useMemo(()=>
         io('https://ycall-backend.onrender.com')
    ,[])
   return(
    <SocketContext.Provider value={{socket}}>
        {props.children}
    </SocketContext.Provider>
   )
}