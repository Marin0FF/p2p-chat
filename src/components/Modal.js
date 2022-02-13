import React from "react";

const Modal = (props) => {
    return (
        <>
            {props.show ? <div className="modal z-50 modal-open">{props.children}</div> : null}
        </>
    );
};

export default Modal;