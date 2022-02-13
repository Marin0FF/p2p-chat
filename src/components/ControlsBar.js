import React, {useRef} from "react";

const ControlBar = ({callbacks}) => {
    const remoteRoomId = useRef();

  return (
    <div className="mx-auto flex w-[30%] flex-col">
      <button
        id="callButton"
        className="btn-primary mb-4"
        onClick={callbacks.createChatRoom}
      >
        Start Call
      </button>

      <input ref={remoteRoomId} id="callInput" />
      <button
        onClick={() => callbacks.joinChatRoom(remoteRoomId.current.value)}
        className="btn-secondary mt-4"
        id="answerButton"
      >
        Answer
      </button>
    </div>
  );
};

export default ControlBar;
