import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { SocketProvider } from "./pages/Socket";
import Room from "./components/Room";
import { PeerProvider } from "./pages/Peer";
function App() {
  return (
    <>
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                </>
              }
            />
            <Route
              path="/room/:room"
              element={
                <>
                  <Room />
                </>
              }
            />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </>
  );
}

export default App;
