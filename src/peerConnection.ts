// STUN SERVER URL'S

const servers: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc = new RTCPeerConnection(servers);

function resetPeerConnection(): void {
  pc = new RTCPeerConnection(servers);
}

export { pc, resetPeerConnection };
