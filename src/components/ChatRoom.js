import React, { useState, useEffect, createRef } from "react";
import pc from "../peerConnection";
import createOffer from "../createOffer";
import acceptOffer from "../acceptOffer";
import Video from "./Video";
import ControlBar from "./ControlsBar";

const ChatRoom = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [roomId, setRoomId] = useState();

  const localSource = createRef();
  const remoteSource = createRef();

  useEffect(() => {
    localSource.current.srcObject = localStream;
  }, [localStream, localSource]);

  useEffect(() => {
    remoteSource.current.srcObject = remoteStream;
  }, [remoteStream, remoteSource]);

  async function setupStreams() {
    const userMedia = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    userMedia.getTracks().forEach((track) => pc.addTrack(track, userMedia));
    setLocalStream(userMedia);
    // when a new track has been added to the peer conection
    // set the value to remoteStream
    pc.ontrack = (e) => {
      const incomingStream = new MediaStream();
      e.streams[0]
        .getTracks()
        .forEach((track) => incomingStream.addTrack(track));
      setRemoteStream(incomingStream);
    };
  }
  const controlsFunctions = {
    // creates peer conection and pushes the video steam of the  1st user
    createChatRoom: () => {
      // get 1st user webcam feed
      setupStreams().then(() => createOffer().then(id => setRoomId(id)));
    },
    // 2nd user inputs the roomId (Answers the call), gets connected to the 1st peer
    joinChatRoom: (roomId) => {
      setRoomId(roomId)
      setupStreams().then(() => acceptOffer(roomId));
    },
  };

  return (
    <div>
      <div className="md:flex items-center justify-center h-[100vh] max-h-screen">
        <Video
          ref={localSource}
          isMuted={true}
          className={!remoteStream ? "single-stream w-full" : null}
        />
        <Video ref={remoteSource} className={remoteStream ? "block" : 'hidden'} />
      </div>
      <ControlBar callbacks={controlsFunctions} roomId={roomId} />
    </div>
  );
};

export default ChatRoom;
