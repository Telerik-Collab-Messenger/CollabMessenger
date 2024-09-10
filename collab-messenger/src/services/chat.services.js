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
export const createChat = async (author, teamName = null, isTeamChat = false) => {
    // trayans code 
    // const chat = {author, messages: false, participants: false, createdOn: new Date().toString(), lastSeen: {[author]: new Date().toString()}};
    const chat = {author, messages: false, participants: false, createdOn: new Date().toString(), lastSeen: {[author]: new Date().toString()}, isTeamChat, teamName};
    //participants above should be an object, declaring it as false to bypass the firebase (not {}) probably not the best idea
    const result = await push(ref(db, 'chats'), chat);
    const id = result.key;
    //await push(ref(db, `chats/${id}/participants`), author);
    //await update(ref(db), {[`chats/${id}/participants`]: {[author]: true}});
    await update(ref(db), {[`chats/${id}/id`]: id,});
    await addChatParticipant (id, author);
    return id; 
};

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
        seenBy: message.seenBy
      }))
    : [];

    const participantArray = chatData.participants
    ? Object.values(chatData.participants).map((userHandle) => ({
        lastSeenMessageId: userHandle.lastSeenMessageId,
        timeStamps: userHandle.timeStamps
      }))
    : [];

  return {
    ...chatData,
    //likedBy: Object.keys(chatData.likedBy ?? {}),
    messages: [...messagesArray], participants: [...participantArray] //not sure if it is passed correctly [...messagesArray] ?
  };
}

// export const calculateUnreadMessages = async (chatId, userHandle) => {
//   const chat = await getChatByID(chatId);
  
//   if (!chat.messages) return 0;
//   return chat.messages.filter(message => !message.seenBy?.[userHandle]).length;
// };

export const calculateUnreadMessages = async (chatId, userHandle) => {
  try {
    const chat = await getChatByID(chatId);

    if (!chat.messages || chat.messages.length === 0) {
      console.log('No messages in chat');
      return 0; // No messages, return 0
    }

    // Filter for unread messages
    const unreadMessages = chat.messages.filter(message => {
      const isSeenByUser = message.seenBy && message.seenBy[userHandle];
      console.log(`Message ID: ${message.id}, Seen By User (${userHandle}): ${isSeenByUser}`); // Log each message's seen status
      return !isSeenByUser; // Return true if the message hasn't been seen by the user
    });

    console.log('Unread Messages:', unreadMessages); // Log the unread messages array
    return unreadMessages.length; // Return the number of unread messages
  } catch (error) {
    console.error('Error calculating unread messages:', error);
    return 0; // Handle errors by returning 0 unread messages
  }
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


export const leaveChat = async (chatId, participantHandle) => {
  try {
    const currentChat = await getChatByID(chatId);

    if (currentChat.participants && currentChat.participants[participantHandle]) {
      const updatedParticipants = { ...currentChat.participants };
      updatedParticipants[participantHandle] = null;

      await update(ref(db), {[`chats/${chatId}/participants/${participantHandle}`]: null});
      await update(ref(db), {[`users/${participantHandle}/chats/${chatId}`]: null});

      console.log(`User ${participantHandle} removed from chat ${chatId}.`);
      return { success: true, participants: updatedParticipants };
    } else {
      console.log('User is not a participant.');
      return { success: false, participants: currentChat.participants };
    }
  } catch (error) {
    console.error("Failed to remove participant:", error);
    throw error;
  }
};

export const createChatMessage = async (chatId, author, content, date = new Date().toString()) => {
    const message = {author: author, content: content, createdOn: date, seenBy: {[author]: true}};
        const result = await push(ref(db, `chats/${chatId}/messages`), message);
        const id = result.key;
        await update(ref(db), {
            [`chats/${chatId}/messages/${id}/id`]: id,
            [`chats/${chatId}/participants/${author}/lastSeenMessageId`]: id,
          });
    return id; 
};

export const createChatForTeam = async (author, participants, teamName) => {
  const chatId = await createChat(author.id, teamName, true);
  await addChatParticipant(chatId, author.id);

  for (const participant of participants) {
      if (participant.id !== author.id) {
          await addChatParticipant(chatId, participant.id);
      }
  }

  return chatId;
};

//this works 

// export const createChatForTeam = async (author, participants) => {
//   const chatId = await createChat(author.id);
//   await addChatParticipant(chatId, author.id);
//   for (const participant of participants) {
//     if (participant.id !== author.id) {
//       await addChatParticipant(chatId, participant.id);
//     }
//   }
//   return chatId; 
// };


