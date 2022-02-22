import React, { useRef, useState } from "react";
import Modal from "./Modal";

const ControlBar = ({ callbacks, connectionStatus, roomId }) => {
  const remoteRoomId = useRef();
  const [isOpen, setIsOpen] = useState(false);

  // Modal state controlers
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  function join() {
    callbacks.joinChatRoom(remoteRoomId.current.value);
    toggleModal();
  }

  const ChatControls = (connectionStatus) => {
    // absytact into a switch
    if (
      (connectionStatus === "new" || connectionStatus === "connected") &&
      (connectionStatus !== "failed" || connectionStatus !== "disconnected")
    ) {
      return (
        <>
          <div className="flex items-center">
            <span className="text-lg font-bold">Room ID: {roomId}</span>
          </div>
          <button className="btn btn-error" id="answerButton" onClick={callbacks.leaveChatRoom}>
            Disconnect
          </button>
        </>
      );
    }
    if (!connectionStatus || connectionStatus === 'disconnected') {
      return (
        <>
          <button
            id="callButton"
            className="btn btn-primary"
            onClick={callbacks.createChatRoom}
          >
            Start Call
          </button>
          <button
            onClick={toggleModal}
            className="btn btn-secondary"
            id="answerButton"
          >
            Join Call
          </button>
        </>
      );
    }
  };

  return (
    <>
      <Modal show={isOpen}>
        <div className="modal-box">
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Paste in the Id of the call you want to join and press accept.
              </span>
            </label>
            <input
              type="text"
              placeholder="Room ID"
              ref={remoteRoomId}
              className="input-bordered input mt-2"
            />
          </div>
          <div className="modal-action">
            <button onClick={join} className="btn btn-primary">
              Accept
            </button>
            <button onClick={toggleModal} className="btn">
              Close
            </button>
          </div>
        </div>
      </Modal>
      <div className="position-center navbar rounded-box fixed bottom-0 mb-2 bg-neutral p-3 text-neutral-content shadow-lg">
        <div className="navbar-center mx-2 flex px-2">
          <div className="flex items-stretch gap-5">{ChatControls(connectionStatus)}</div>
        </div>
      </div>
    </>
  );
};

export default ControlBar;
