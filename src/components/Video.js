import React, { forwardRef } from "react";

const Video = forwardRef(({ isMuted, className }, ref) => (
  <video ref={ref} id="webcamVideo" autoPlay playsInline muted={isMuted} className={'h-full ' + className}></video>
));

export default Video;
