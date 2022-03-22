/* TODO */
// clean up code 🧹
import React, { useEffect, useState } from "react";
import { pc, resetPeerConnection } from "../peerConnection";
import createOffer from "../createOffer";
import acceptOffer from "../acceptOffer";
import destroyOffer from "../destroyOffer";
import Video from "./Video";
import ControlBar from "./ControlsBar";

const ChatRoom: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<RTCPeerConnectionState | null | 'disconnected'>(null);
  const [mediaStreams, setMediaStreams] = useState<Array<MediaStream> | null>();
  const [roomId, setRoomId] = useState<string | null>(null);

  async function setupStreams() {
    const userMedia = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    userMedia.getTracks().forEach((track) => pc.addTrack(track, userMedia));
    //setLocalStream(userMedia);
    setMediaStreams([userMedia]);
    // when a new track has been added to the peer conection
    // set the value to remoteStream
    pc.ontrack = (e) => {
      const incomingStream = new MediaStream();
      e.streams[0]
        .getTracks()
        .forEach((track) => incomingStream.addTrack(track));
      setMediaStreams((current) => current ? [current[0], incomingStream] : current);
    };
    // pc.onremovetrack = (e) => console.log(e);
    // remove e.track
    pc.onsignalingstatechange = (e) => {
      console.log(e, pc.connectionState);
      setConnectionStatus(pc.connectionState);
    };
    pc.onconnectionstatechange = (e) => {
      console.log(e, pc.connectionState);
      setConnectionStatus(pc.connectionState);
    };
  }

  useEffect(() => {
    // teardown state when connection status is set to disconnected
    if (connectionStatus === 'disconnected') {
      if (mediaStreams) mediaStreams[0].getTracks().forEach(track => track.stop())
      setMediaStreams(null);
      pc.close();
      setRoomId(null)
      setConnectionStatus(null)
      resetPeerConnection();
    }
  }, [connectionStatus, mediaStreams])

  const controller = {
    // creates peer conection and pushes the video steam of the  1st user
    createChatRoom: () => {
      // get 1st user webcam feed
      setupStreams().then(() => createOffer().then((id) => setRoomId(id)));
    },
    // 2nd user inputs the roomId (Answers the call), gets connected to the 1st peer
    joinChatRoom: (roomId: string) => {
      setRoomId(roomId);
      setupStreams().then(() => acceptOffer(roomId));
    },
    // end call
    leaveChatRoom: (roomId: string) => {
      destroyOffer(roomId).then(() => {
        setConnectionStatus('disconnected')
      })
      console.log(pc);
    },
  };

  return (
    <div>
      <div className="h-[100vh] max-h-screen items-center justify-center md:flex">
        {mediaStreams &&
          mediaStreams.map((stream, i) => (
            <Video
              key={stream.id}
              stream={stream}
              isMuted={i === 0 ? true : false}
              className={mediaStreams.length === 1 ? "single-stream w-full" : null}
            />
          ))}
      </div>
      <ControlBar
        controller={controller}
        roomId={roomId}
        connectionStatus={connectionStatus}
      />
    </div>
  );
};

export default ChatRoom;