import {useParams} from 'react-router';
import useWebRTC, {LOCAL_VIDEO} from '../hooks/useWebRTC';
import socket from '../socket';
import ACTIONS from '../socket/actions';


export default function Room() {
  const {id: roomID} = useParams();
  const {clients, provideMediaRef} = useWebRTC(roomID);
  // const videoLayout = layout(clients.length);
function LEAVE(params) {
  socket.emit(ACTIONS.LEAVE);
  window.location="/"
}
  return (
    <div className='Main_room'>
           <p>{clients.length}</p>
           <button onClick={()=>LEAVE()}>Leave</button>
      {clients.map((clientID, index) => {
        return (
          <div className='room' key={clientID}  id={clientID}>
            {/* <p>{clients.length}</p> */}
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
            
          </div>
        );
      })}
    </div>
  );
}