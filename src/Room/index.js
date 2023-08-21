import {useParams} from 'react-router';
import useWebRTC, {LOCAL_VIDEO} from '../hooks/useWebRTC';
import socket from '../socket';
import ACTIONS from '../socket/actions';


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
  // const videoLayout = layout(clients.length);
function LEAVE(params) {
  socket.emit(ACTIONS.LEAVE);
  window.location="/"
}
return (
  <div className='Main_room'>
    <p>{clients.length}</p>

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