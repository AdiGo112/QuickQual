import { collection, addDoc, getDocs } from "firebase/firestore";

export async function saveScore(db, name, score) {
  await addDoc(collection(db, "scores"), {
    name,
    score,
    time: Date.now()
  });
}

export async function getScores(db) {
  const snap = await getDocs(collection(db, "scores"));
  return snap.docs.map(d => d.data());
}
