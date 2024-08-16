import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase-config';

export const getUserByHandle = async (handle) => {
    const snapshot = await get(ref(db, `users/${handle}`));
    return snapshot.val();
};

export const createUserHandle = async (handle, uid, email, phoneNumber = '', photoURL = '') => {
    const user = { handle, uid, email, phoneNumber, photoURL, createdOn: new Date().toString() };
    await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
    return snapshot.val();
};

export const uploadPhoto = async (uid, file) => {
    const photoStorageRef = storageRef(storage, `users/${uid}/profile.jpg`);
    await uploadBytes(photoStorageRef, file);
    const photoURL = await getDownloadURL(photoStorageRef);
    return photoURL;
};


//old users without photos
// export const createUserHandle = async (handle, uid, email, phoneNumber = '') => {
//     const user = { handle, uid, email, phoneNumber, createdOn: new Date().toString() };
//     await set(ref(db, `users/${handle}`), user);
// };
