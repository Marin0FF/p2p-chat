import React from "react";

interface Props {
    show?: boolean;
}

const Modal: React.FC<Props> = (props) => {
    return (
        <>
            {props.show ? <div className="modal z-50 modal-open">{props.children}</div> : null}
        </>
    );
};

export default Modal;