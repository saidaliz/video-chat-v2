import {useParams} from 'react-router';
import useWebRTC, {LOCAL_VIDEO} from '../hooks/useWebRTC';
import socket from '../socket';
import ACTIONS from '../socket/actions';
import React, { useEffect,useState } from "react";
import "./Hooter.css"
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
function LEAVE(params) {
  socket.emit(ACTIONS.LEAVE);
  window.location="/"
}
return (
  <div className='Main'>
    <p>{clients.length}</p>
    {/* <div className="fd">
    {clients.map((client)=>{
      return<p>{client}</p>
    })}
    </div> */}
    {/* <ul>
      {messages.map((message, index) => (
        <li key={index}>
          <strong>{message.senderID === socket.id ? 'You' : message.senderID}:</strong> {message.message}
        </li>
      ))}
    </ul>
    <form onSubmit={handleMessageSend}>
      <input type='text' name='message' />
      <button type='submit'>Send</button>
    </form> */}
    <div className='rooms'>

    {clients.map((clientID, index) => {
      return (
        <div className='room' key={clientID} id={clientID}>
          <p>{clientID}</p>
          <video
  className='video'
            ref={instance => {
              provideMediaRef(clientID, instance);
            }}
            autoPlay
            playsInline
            muted={clientID === LOCAL_VIDEO}
          />
                           {/* {(() => {
if (clientID === LOCAL_VIDEO) {
  return<div><button onClick={() => LEAVE()}>Leave</button>
  <button onClick={toggleCamera}>{isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}</button>
  <button onClick={toggleAudio}>{isAudioOn ? 'Mute' : 'Unmute'}</button>
  <button onClick={toggleScreenSharing}>{isScreenSharing ? 'Stop Sharing Screen' : 'Share Screen'}</button></div>
}
})()} */}
        </div>
      );
    })}
        </div>
    <div className="Hooter_main">
      <div className="Hooter_cotroler">
        <div className="Hooter_audio_control">
        {(() => {
   if (isAudioOn===true) {
    return<div className="control_div"> <svg onClick={toggleAudio}
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="45"
    viewBox="0 0 24 25"
    fill="none"
  >
    <rect
      x="8"
      y="2.99805"
      width="8"
      height="14"
      rx="4"
      fill="#ACACAC"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.80298 13.7458C6.7445 13.3358 6.41434 12.998 6.00013 12.998C5.58591 12.998 5.24575 13.3351 5.29119 13.7468C5.63655 16.8761 8.12101 19.3609 11.2501 19.7069V22.248H9.00013C8.58591 22.248 8.25013 22.5838 8.25013 22.998C8.25013 23.4123 8.58591 23.748 9.00013 23.748H15.0001C15.4143 23.748 15.7501 23.4123 15.7501 22.998C15.7501 22.5838 15.4143 22.248 15.0001 22.248H12.7501V19.7069C15.8792 19.3609 18.3637 16.8761 18.7091 13.7468C18.7545 13.3351 18.4143 12.998 18.0001 12.998C17.5859 12.998 17.2558 13.3358 17.1973 13.7458C16.8343 16.2911 14.6458 18.248 12.0001 18.248C9.3545 18.248 7.16594 16.2911 6.80298 13.7458Z"
      fill="#ACACAC"
    />
  </svg>
  <p>аудио включён</p></div>
   }else{
    return <div className="control_div"> <svg onClick={toggleAudio} width="44" height="45" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16 11.1194L10.4379 16.6815C10.9178 16.8853 11.4457 16.998 12 16.998C14.2091 16.998 16 15.2072 16 12.998V11.1194ZM8.31653 14.5602C8.11274 14.0803 8 13.5523 8 12.998V6.99805C8 4.78891 9.79086 2.99805 12 2.99805C14.1691 2.99805 15.935 4.72465 15.9982 6.87848L8.31653 14.5602Z" fill="#ACACAC"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.38112 15.4956C7.09167 14.9614 6.89218 14.3714 6.80298 13.7458C6.7445 13.3358 6.41434 12.998 6.00013 12.998C5.58591 12.998 5.24575 13.3351 5.29119 13.7468C5.40566 14.784 5.75512 15.7504 6.28515 16.5916L7.38112 15.4956ZM8.40644 18.7129C9.24732 19.2428 10.2133 19.5922 11.2501 19.7069V22.248H9.00013C8.58591 22.248 8.25013 22.5838 8.25013 22.998C8.25013 23.4123 8.58591 23.748 9.00013 23.748H15.0001C15.4143 23.748 15.7501 23.4123 15.7501 22.998C15.7501 22.5838 15.4143 22.248 15.0001 22.248H12.7501V19.7069C15.8792 19.3609 18.3637 16.8761 18.7091 13.7468C18.7545 13.3351 18.4143 12.998 18.0001 12.998C17.5859 12.998 17.2558 13.3358 17.1973 13.7458C16.8343 16.2911 14.6458 18.248 12.0001 18.248C11.096 18.248 10.2452 18.0195 9.5024 17.617L8.40644 18.7129Z" fill="#ACACAC"/>
    <path d="M22 2.99805L2 22.998" stroke="#EE6762" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <p>аудио выключен</p></div>
   }
  })()}
        </div>
        <div className="Hooter_video_control">
        {(() => {
   if (isCameraOn===true) {
    return<div className="control_div">        <svg onClick={toggleCamera}
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="45"
    viewBox="0 0 24 25"
    fill="none"
  >
    <path
      d="M1 8.99805C1 7.89348 1.89543 6.99805 3 6.99805H13C15.2091 6.99805 17 8.78891 17 10.998V17.998C17 19.1026 16.1046 19.998 15 19.998H5C2.79086 19.998 1 18.2072 1 15.998V8.99805Z"
      fill="#ACACAC"
    />
    <path
      d="M18 10.5642C18 10.213 18.1843 9.88747 18.4855 9.70674L21.4855 7.90674C22.152 7.50683 23 7.98694 23 8.76424V18.2319C23 19.0092 22.152 19.4893 21.4855 19.0893L18.4855 17.2893C18.1843 17.1086 18 16.7831 18 16.4319V10.5642Z"
      fill="#ACACAC"
    />
  </svg>
  <p> камера включен</p>
  </div>  
   }else{
    return  <div className="control_div">          <svg onClick={toggleCamera} width="44" height="45" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 9.56814C18 9.21688 18.1843 8.89137 18.4855 8.71065L21.4855 6.91065C22.152 6.51074 23 6.99085 23 7.76814V17.2358C23 18.0131 22.152 18.4932 21.4855 18.0933L18.4855 16.2933C18.1843 16.1125 18 15.787 18 15.4358V9.56814Z" fill="#ACACAC"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.212 6.66868C14.5784 6.24741 13.8179 6.00195 13 6.00195H3C1.89543 6.00195 1 6.89738 1 8.00195V15.002C1 16.5917 1.92743 17.9649 3.27076 18.6099L15.212 6.66868ZM7.12132 19.002H15C16.1046 19.002 17 18.1065 17 17.002V10.002C17 9.72837 16.9725 9.46121 16.9202 9.20306L7.12132 19.002Z" fill="#ACACAC"/>
    <path d="M22 2.00195L2 22.002" stroke="#EE6762" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <p>камера выключен</p>
    </div>
   }
  })()}
        </div>
      </div>
      <div className="Hooter_center_controler">
         <div className="Hooter_video_share_controler">
         <div className="control_div">        
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 24 25" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 4.99805C1.89543 4.99805 1 5.89348 1 6.99805V18.998C1 20.1026 1.89543 20.998 3 20.998H21C22.1046 20.998 23 20.1026 23 18.998V6.99805C23 5.89348 22.1046 4.99805 21 4.99805H3ZM12.5303 8.46772C12.2374 8.17482 11.7626 8.17482 11.4697 8.46772L8.46967 11.4677C8.17678 11.7606 8.17678 12.2355 8.46967 12.5284C8.76256 12.8213 9.23744 12.8213 9.53033 12.5284L11.25 10.8087V15.998C11.25 16.4123 11.5858 16.748 12 16.748C12.4142 16.748 12.75 16.4123 12.75 15.998V10.8087L14.4697 12.5284C14.7626 12.8213 15.2374 12.8213 15.5303 12.5284C15.8232 12.2355 15.8232 11.7606 15.5303 11.4677L12.5303 8.46772Z" fill="#69D569"/>
</svg>
<p>Запись экрана</p></div>
         </div>
         <div className="Hooter_chat_controler">
         <div className="control_div">   
         <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 24 25" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4.99805C3.34315 4.99805 2 6.34119 2 7.99804V15.3314C2 16.9882 3.34315 18.3314 5 18.3314H5.88894V21.4607C5.88894 21.9205 6.4572 22.1365 6.76264 21.7929L9.83957 18.3314H19C20.6569 18.3314 22 16.9882 22 15.3314V7.99805C22 6.34119 20.6569 4.99805 19 4.99805H5Z" fill="#ACACAC"/>
</svg>
<p>Чат</p></div>
          </div>
          <div className="Hooter_users_controler">
          <div className="control_div"> 
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="48" viewBox="0 0 22 18" fill="none">
  <circle cx="7" cy="4.99805" r="4" fill="#ACACAC"/>
  <circle cx="16.5" cy="6.49805" r="3.5" fill="#ACACAC"/>
  <path d="M11.8462 17.998C12.9231 17.998 14 16.6522 14 15.3057C14 12.075 10.2098 10.998 7 10.998C3.79018 10.998 0 12.075 0 15.3057C0 16.6522 1.07692 17.998 2.15385 17.998H11.8462Z" fill="#ACACAC"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3037 17.9199C13.2083 17.6143 14 16.4602 14 15.3057C14 14.2298 13.5796 13.3928 12.9004 12.7548C11.7898 13.3278 11 14.2642 11 15.6904C11 16.6664 11.6051 17.642 12.3037 17.9199ZM14.5728 17.998H20.3077C21.1538 17.998 22 16.8445 22 15.6904C22 12.9211 19.022 11.998 16.5 11.998C15.8236 11.998 15.1143 12.0645 14.4385 12.2151C15.0845 13.0204 15.5 14.0419 15.5 15.3057C15.5 16.3155 15.1222 17.2718 14.5728 17.998Z" fill="#ACACAC"/>
</svg>
<p>Участники</p></div>
            </div>
      </div>
      <div className="btn_leave_div">
        <button onClick={() => LEAVE()} className="btn_leave">
          <p className="btn_leave_p">Выход</p>
        </button>
      </div>
    </div>
  </div>
);




}