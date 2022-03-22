import firestore from './firebase'

async function destroyOffer(roomId: string): Promise<void> {
    await firestore.collection("rooms").doc(roomId).delete()
        .catch(error => console.error(error));
}

export default destroyOffer