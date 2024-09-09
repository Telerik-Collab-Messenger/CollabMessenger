import { ref, push, get, update } from 'firebase/database';
import { db } from '../config/firebase-config'
import { addChatToUser } from './user.services';


export const getAllChats = async () => {
    const snapshot = await get(ref(db, 'chats'));
    if (!snapshot.exists()) return [];
  
    return Object.values(snapshot.val()).map(chat => ({
      ...chat,
      likeCount: chat.likedBy ? Object.keys(chat.likedBy).length : 0,
    }));
  };
export const createChat = async (author) => {
    const chat = {author, messages: false, participants: false, messages: false, createdOn: new Date().toString(), lastSeen: {[author]: new Date().toString()}};
    //participants above should be an object, declaring it as false to bypass the firebase (not {}) probably not the best idea
    const result = await push(ref(db, 'chats'), chat);
    const id = result.key;
    //await push(ref(db, `chats/${id}/participants`), author);
    //await update(ref(db), {[`chats/${id}/participants`]: {[author]: true}});
    await update(ref(db), {[`chats/${id}/id`]: id,});
    await addChatParticipant (id, author);
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
    //likedBy: Object.keys(chatData.likedBy ?? {}),
    messages: [...messagesArray], //not sure if it is passed correctly [...messagesArray] ?
  };
}

export const calculateUnreadMessages = async (chatId, userHandle) => {
  const chat = await getChatByID(chatId);
  if (!chat.messages) return 0;
  return chat.messages.filter(message => !message.seenBy?.[userHandle]).length;
};

export const addChatParticipant = async (chatId, userHandle) => {
  try {
    const currentChat = await getChatByID(chatId);

    // Check if the user is already a participant
    if (!Object.values(currentChat.participants).includes(userHandle)) {
      //currentChat.participants.push(userHandle);

      // Update the participants array in the database NOT REALLY 
      // await update(ref(db, `chats/${chatId}`), {
      //   participants: currentChat.participants,
      // });
      //await push(ref(db, `chats/${chatId}/participants`), userHandle);
      await update(ref(db, `chats/${chatId}/participants`),{ [userHandle]: {'lastSeenMessageId': false, 'timeStamps': false} } );

      await addChatToUser(userHandle, chatId);

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
    const message = {author: author, content: content, createdOn: date, seenBy: {[author]: true}};
        const result = await push(ref(db, `chats/${chatId}/messages`), message);
        const id = result.key;
        await update(ref(db), {
            [`chats/${chatId}/messages/${id}/id`]: id,
          });
    return id; 
};

export const createChatForTeam = async (author, participants) => {
  const chat = {
    author: author.id, 
    participants: false, 
    createdOn: new Date().toString(), 
    lastSeen: { [author.id]: new Date().toString() }, 
  };

  const result = await push(ref(db, 'chats'), chat);
  const chatId = result.key;

  await update(ref(db), {
    [`chats/${chatId}/id`]: chatId,
    [`chats/${chatId}/participants/${author.id}`]: true, 
    [`chats/${chatId}/lastSeen/${author.id}`]: new Date().toString(),
  });

  for (const participant of participants) {
    await update(ref(db), {
      [`chats/${chatId}/participants/${participant.id}`]: true, 
      [`chats/${chatId}/lastSeen/${participant.id}`]: new Date().toString(), 
    });
  }

  return chatId; 
};


