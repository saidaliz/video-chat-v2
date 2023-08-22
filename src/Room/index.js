import {useParams} from 'react-router';
import useWebRTC, {LOCAL_VIDEO} from '../hooks/useWebRTC';
import socket from '../socket';
import ACTIONS from '../socket/actions';
import React, { useEffect,useState } from "react";

export default function Room() {
  const {id: roomID} = useParams();
  const {
    clients,
    provideMediaRef,
    isCameraOn,
    isAudioOn,
    isScreenSharing,
    toggleCamera,
    toggleAudio,
    toggleScreenSharing,
  } = useWebRTC(roomID);
  const [messages, setMessages] = useState([]);

const handleMessageSend = (event) => {
  event.preventDefault();
  const input = event.target.elements.message;
  const message = input.value.trim();
  if (message) {
    socket.emit(ACTIONS.SEND_MESSAGE, { roomID, message });
    input.value = '';
  }
};
useEffect(() => {
  const handleMessageReceive = ({ senderID, message }) => {
    setMessages((messages) => [...messages, { senderID, message }]);
  };
  const handleMessageHistoryReceive = (history) => {
    setMessages(history);
  };
  socket.on(ACTIONS.RECEIVE_MESSAGE, handleMessageReceive);
  socket.on(ACTIONS.RECEIVE_MESSAGE_HISTORY, handleMessageHistoryReceive);
  return () => {
    socket.off(ACTIONS.RECEIVE_MESSAGE);
    socket.off(ACTIONS.RECEIVE_MESSAGE_HISTORY);
  };
}, []);
// useEffect(() => {
//   const handleMessageReceive = ({ senderID, message }) => {
//     setMessages((messages) => [...messages, { senderID, message }]);
//   };
//   socket.on(ACTIONS.RECEIVE_MESSAGE, handleMessageReceive);
//   return () => {
//     socket.off(ACTIONS.RECEIVE_MESSAGE);
//   };
// }, []);

  // const videoLayout = layout(clients.length);
function LEAVE(params) {
  socket.emit(ACTIONS.LEAVE);
  window.location="/"
}
return (
  <div className='Main_room'>
    <p>{clients.length}</p>
    <div className="fd">
    {clients.map((client)=>{
      return<p>{client}</p>
    })}
    </div>

    <button onClick={() => LEAVE()}>Leave</button>
    <ul>
      {messages.map((message, index) => (
        <li key={index}>
          <strong>{message.senderID === socket.id ? 'You' : message.senderID}:</strong> {message.message}
        </li>
      ))}
    </ul>
    <form onSubmit={handleMessageSend}>
      <input type='text' name='message' />
      <button type='submit'>Send</button>
    </form>
    {clients.map((clientID, index) => {
      return (
        <div className='room' key={clientID} id={clientID}>
          <p>{clientID}</p>
          <video
            width='100%'
            height='100%'
            ref={instance => {
              provideMediaRef(clientID, instance);
            }}
            autoPlay
            playsInline
            muted={clientID === LOCAL_VIDEO}
          />
                           {(() => {
if (clientID === LOCAL_VIDEO) {
  return<div><button onClick={() => LEAVE()}>Leave</button>
  <button onClick={toggleCamera}>{isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}</button>
  <button onClick={toggleAudio}>{isAudioOn ? 'Mute' : 'Unmute'}</button>
  <button onClick={toggleScreenSharing}>{isScreenSharing ? 'Stop Sharing Screen' : 'Share Screen'}</button></div>
}
})()}
          <p>{clientID}</p>
        </div>
      );
    })}
  </div>
);




}