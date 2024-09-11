import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase-config';

export const getAllUsersLength = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) return [];
  return snapshot;
}

export const getUserByHandle = async (handle) => {
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  const users = snapshot.val();

  if (!users) return null;

  for (const userId in users) {
    if (users[userId].handle === handle) {
      return { ...users[userId], uid: userId };
    }
  }

  return null;
};

export const getAllUsers = async (search = '') => {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) return [];

  const users = Object.values(snapshot.val());

  if (search) {
    return users.filter(u => u.handle.toLowerCase().includes(search.toLowerCase()));
  }

  return users;
};

export const createUserHandle = async (handle, uid, email, phoneNumber = '', photoURL = '', firstName = '', lastName = '') => {
  const user = { handle, uid, firstName, lastName, email, phoneNumber, photoURL, createdOn: new Date().toString() };
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

export const updateUserData = async (uid, updatedData) => {
    try {
      const userRef = query(ref(db, 'users'), orderByChild('uid'), equalTo(uid));
      const snapshot = await get(userRef);
  
      if (snapshot.exists()) {
        const userKey = Object.keys(snapshot.val())[0];
  
        await update(ref(db, `users/${userKey}`), updatedData);
  
        console.log(`User ${userKey} data updated successfully.`);
      } else {
        console.error('User does not exist');
      }
    } catch (error) {
      console.error(`Failed to update user data: ${error}`);
    }
  };

  export const addChatToUser = async (userHandle, chatId) => {
    try {
        await update(ref(db, `users/${userHandle}/chats`), { [chatId]: true });

        console.log("Chat added successfully to user's chat list.");
    } catch (error) {
        console.error("Failed to add chat to user's chats:", error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
  const usersRef = ref(db, 'users');
  const snapshot = await get(usersRef);
  const users = snapshot.val();

  if (!users) return null;

  for (const userId in users) {
    if (users[userId].email === email) {
      return { ...users[userId], uid: userId };
    }
  }

  return null;
};

