import React, { useRef, useState } from "react";
import Modal from "./Modal";
import checkStatus from '../checkStatus'

interface Props {
  controller: ControllerMethods;
  connectionStatus: string | null;
  roomId?: string | null;
}

interface ControllerMethods {
  createChatRoom: () => void;
  joinChatRoom: (roomId: string) => void;
  leaveChatRoom: () => void
}

const ControlBar: React.FC<Props> = ({ controller, connectionStatus, roomId }) => {
  const remoteRoomId = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Modal state controlers
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  function join() {
    if (remoteRoomId && remoteRoomId.current) {
      controller.joinChatRoom(remoteRoomId.current.value);
      toggleModal();
    }
  }

  const ChatControls = (connectionStatus: string | null) => {
    // absytact into a switch
    if (
      checkStatus(connectionStatus)
    ) {
      return (
        <>
          <div className="flex items-center">
            <span className="text-lg font-bold">Room ID: {roomId}</span>
          </div>
          <button className="btn btn-error" id="answerButton" onClick={controller.leaveChatRoom}>
            Disconnect
          </button>
        </>
      );
    }
    if (!checkStatus(connectionStatus)) {
      return (
        <>
          <button
            id="callButton"
            className="btn btn-primary"
            onClick={controller.createChatRoom}
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
