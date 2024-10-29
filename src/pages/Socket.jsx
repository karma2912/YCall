import React, { useMemo } from "react"
import {io} from "socket.io-client"

const SocketContext = React.createContext()

export const useSocket =()=>{
    return React.useContext(SocketContext)
}
export const SocketProvider =(props)=>{
    const socket = useMemo(()=>
         io('https://ycall-backend.onrender.com', {
            transports: ['polling', 'websocket'], // Ensure both transports are available
            withCredentials: true // Optional, based on your needs
          })
    ,[])
   return(
    <SocketContext.Provider value={{socket}}>
        {props.children}
    </SocketContext.Provider>
   )
}