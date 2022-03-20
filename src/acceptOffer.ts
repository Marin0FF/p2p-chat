import pc from "./peerConnection";
import firestore from "./firebase";

async function acceptOffer(roomId: string): Promise<void> {
  const roomDoc = firestore.collection("rooms").doc(roomId);
  const answerCandidates = roomDoc.collection("answerCandidates");
  const offerCandidates = roomDoc.collection("offerCandidates");

  // Update answerCandidates collection with ICE candidate value
  pc.onicecandidate = (event) => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const roomData: any = (await roomDoc.get()).data();

  // get the offer from db, set remote description
  const offerDescription: RTCSessionDescriptionInit = roomData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription: RTCSessionDescriptionInit = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };
  // push the answer to the db
  await roomDoc.update({ answer });

  // when a offer candidate is added to db, add it to peerConnection
  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
}

export default acceptOffer;
