import React, { useState, useRef, useEffect } from "react";
import pc from "../peerConnection";
import createOffer from "../createOffer";
import acceptOffer from "../acceptOffer";

const ChatRoom = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const localSource = useRef();
  const remoteSource = useRef();
  const remoteRoomId = useRef();

  useEffect(() => {
    localSource.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    remoteSource.current.srcObject = remoteStream;
  }, [remoteStream]);

  async function setupLocalStream() {
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
  // creates peer conection and pushes the video steam of the  1st user
  function createChatRoom() {
    // get 1st user webcam feed
    setupLocalStream().then(() => createOffer());
  }
  // 2nd user inputs the roomId (Answers the call), gets connected to the 1st peer
  function joinChatRoom() {
    setupLocalStream().then(() => acceptOffer(remoteRoomId.current.value));
  }

  return (
    <div>
      <div className="videos">
        <span>
          <h3>Local Stream</h3>
          <video
            id="webcamVideo"
            ref={localSource}
            autoPlay
            playsInline
            muted
          ></video>
        </span>
        <span>
          <h3>Remote Stream</h3>
          <video
            id="remoteVideo"
            ref={remoteSource}
            autoPlay
            playsInline
          ></video>
        </span>
      </div>
      <div className="flex flex-col w-[30%] mx-auto">
        <button id="callButton" className="mb-4 btn-primary" onClick={createChatRoom}>
          Start Call
        </button>

        <input ref={remoteRoomId} id="callInput" />
        <button onClick={joinChatRoom} className="btn-secondary mt-4" id="answerButton">
          Answer
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
