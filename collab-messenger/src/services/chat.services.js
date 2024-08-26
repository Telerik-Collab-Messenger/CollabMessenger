import { ref, push, get, update } from 'firebase/database';
import { db } from '../config/firebase-config'


export const getAllChats = async () => {
    const snapshot = await get(ref(db, 'chats'));
    if (!snapshot.exists()) return [];
  
    return Object.values(snapshot.val()).map(chat => ({
      ...chat,
      likeCount: chat.likedBy ? Object.keys(chat.likedBy).length : 0,
    }));
  };
export const createChat = async (author) => {
    const chat = {author, participants:{}, createdOn: new Date().toString()};
    const result = await push(ref(db, 'chats'), chat);
    const id = result.key;
    await push(ref(db, `chats/${id}/participants`), author);
    await update(ref(db), {
      [`chats/${id}/id`]: id,
    });
    return id; 
}

export const getChatByID = async (id) => {
    const snapshot = await get(ref(db, `chats/${id}`));
    if (!snapshot.exists()) {
      throw new Error('Chat not found!');
    }
    const chatData = snapshot.val();

    const messagesArray = chatData.messages
    ? Object.entries(chatData.messages).map(([firebaseKey, message]) => ({
        id: firebaseKey, 
        author: message.author,
        content: message.content,
        createdOn: message.createdOn,
      }))
    : [];

  return {
    ...chatData,
    likedBy: Object.keys(chatData.likedBy ?? {}),
    messages: [...messagesArray], //not sure if it is passed correctly [...messagesArray] ?
  };
}

export const addChatParticipant = async (chatId, userHandle) => {
  try {
    const currentChat = await getChatByID(chatId);

    // Check if the user is already a participant
    if (!currentChat.participants.includes(userHandle)) {
      currentChat.participants.push(userHandle);

      // Update the participants array in the database
      await update(ref(db, `chats/${chatId}`), {
        participants: currentChat.participants,
      });

      return currentChat.participants;
    } else {
      console.log('User is already a participant.');
      return currentChat.participants;
    }
  } catch (error) {
    console.error("Failed to add participant:", error);
    throw error;
  }
};

export const createChatMessage = async (chatId, author, content, date = new Date().toString()) => {
    const message = {author: author, content: content, createdOn: date};
        const result = await push(ref(db, `chats/${chatId}/messages`), message);
        const id = result.key;
        await update(ref(db), {
            [`chats/${chatId}/messages/${id}/id`]: id,
          });
    return id; 
};


