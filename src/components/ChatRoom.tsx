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
    // interface returns a string value describing the state of the signaling process on the local end of the connection.
    pc.onsignalingstatechange = (e) => {
      setConnectionStatus(pc.connectionState);
    };
    // interface indicates the current state of the peer connection by returning one of the following string values:
    // new, connecting, connected, disconnected, failed, or closed.
    pc.onconnectionstatechange = (e) => {
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
    // ends call
    leaveChatRoom: (roomId: string) => {
      destroyOffer(roomId).then(() => {
        setConnectionStatus('disconnected')
      })
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