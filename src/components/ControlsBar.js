import React, { useRef, useState } from "react";
import Modal from "./Modal";

const ControlBar = ({ callbacks, roomId }) => {
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

  const ChatControls = (roomId) => {
    if (roomId) {
      return (
        <>
          <div class="flex items-center">
            <span class="text-lg font-bold">Room ID: {roomId}</span>
          </div>
          <button className="btn btn-error" id="answerButton">
            Disconnect
          </button>
        </>
      );
    }
    if (!roomId) {
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
          <div class="form-control">
            <label class="label">
              <span class="label-text">
                Paste in the Id of the call you want to join and press accept.
              </span>
            </label>
            <input
              type="text"
              placeholder="Room ID"
              ref={remoteRoomId}
              class="input-bordered input mt-2"
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
          <div className="flex items-stretch gap-5">{ChatControls(roomId)}</div>
        </div>
      </div>
    </>
  );
};

export default ControlBar;
