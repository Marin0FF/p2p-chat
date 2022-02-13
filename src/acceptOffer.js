import pc from "./peerConnection";
import firestore from "./firebase";

async function acceptOffer(roomId) {
  const roomDoc = firestore.collection("rooms").doc(roomId);
  const answerCandidates = roomDoc.collection("answerCandidates");
  const offerCandidates = roomDoc.collection("offerCandidates");

  // Update answerCandidates collection with ICE candidate value
  pc.onicecandidate = (event) => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const roomData = (await roomDoc.get()).data();

  // get the offer from db, set remote description
  const offerDescription = roomData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
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
      console.log(change);
      if (change.type === "added") {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  return roomData.id;
}

export default acceptOffer;
