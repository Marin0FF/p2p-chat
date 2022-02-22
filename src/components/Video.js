import React, { useRef, useEffect } from "react";

const Video = ({ isMuted, className, stream }) => {
  const video = useRef();

  useEffect(() => {video.current.srcObject = stream}, [stream]);

  return (
    <video
      ref={video}
      id="webcamVideo"
      autoPlay
      playsInline
      muted={isMuted}
      className={"h-full " + className}
    ></video>
  );
};

export default Video;
