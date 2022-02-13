import React, { forwardRef } from "react";

const Video = forwardRef(({ isMuted }, ref) => (
  <video ref={ref} id="webcamVideo" autoPlay playsInline muted={isMuted}></video>
));

export default Video;
