import React, { useRef, useEffect } from "react";

interface Props {
  isMuted: boolean;
  className?: string | null;
  stream: MediaStream;
}

const Video: React.FC<Props> = ({ isMuted, className, stream }) => {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video && video.current) {
      video.current.srcObject = stream
    }
  }, [stream]);

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
