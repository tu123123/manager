import { initializeApp } from "firebase/app";
import { getFirestore, query, orderBy, and } from "@firebase/firestore";
import {
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import moment from "moment";
const firebaseConfig = {
    apiKey: "AIzaSyDBor-yNScm2Oq-IJ0O6AloyQCwpCLolM0",
    authDomain: "fbapp-ce8ce.firebaseapp.com",
    databaseURL: "https://fbapp-ce8ce-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fbapp-ce8ce",
    storageBucket: "fbapp-ce8ce.appspot.com",
    messagingSenderId: "458942500126",
    appId: "1:458942500126:web:08434aafe4e2d9570d8d0f",
    measurementId: "G-B47RZHN8PZ"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export const imgDb = getStorage(app);

const getData2 = async (db: any, action: any, sql?: any) => {
  getDocs(query(collection(firestore, db), sql || null)).then(
    (querySnapshot) => {
      action(
        querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((i: any) => !i.delete)
      );
    }
  );
};
const getData = async (db: any, action: any, sql?: any) => {
  onSnapshot(
    query(
      collection(firestore, db),
      sql || where("time", "!=", ""),
      orderBy("time", "asc")
    ),
    (querySnapshot: any) => {
      action(
        querySnapshot.docs
          .map((doc: any) => ({ ...doc.data(), id: doc.id }))
          .filter((i: any) => !i.delete)
      );
    }
  );
};
const addData = async (db: any, data: any, success: any, err?: any) => {
  try {
    addDoc(collection(firestore, db), {
      ...data,
      time: moment().format("YYYY-MM-DDTHH:mm:ss"),
    }).then(() => success());
  } catch (e) {
    console.error("Error adding document", e);
  }
};
const delData = async (db: any, id: any, success: any) => {
  try {
    await deleteDoc(doc(firestore, db, id)).then(() => success());
  } catch (e) {
    console.error("Error adding document");
  }
};
const upload = async (db: any, id: any, file: any, success: any) => {
  const storage = getStorage();
  const storageRef = ref(storage, "img.png");

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, file).then((snapshot: any) => {
    console.log("Uploaded a blob or file!");
  });
};
const updateData = async (
  db: any,
  id: any,
  data: any,
  success: any,
  err: any
) => {
  const docRef = doc(firestore, db, id);
  updateDoc(docRef, data)
    .then((docRef: any) => {
      success();
    })
    .catch((error: any) => {
      if (err) err();
      console.log(error);
    });
};
export { firestore, getData, addData, updateData, delData, upload, getData2 };