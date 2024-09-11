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
    const chat = {author, messages: false, participants: false, createdOn: new Date().toString(), lastSeen: {[author]: new Date().toString()}, isTeamChat, teamName};
    const result = await push(ref(db, 'chats'), chat);
    const id = result.key;
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
    ? Object.entries(chatData.participants).map(([participantHandle, attribute]) => ({
      participantHandle: participantHandle, 
      lastSeenMessageId: attribute.lastSeenMessageId,
      timeStamps: attribute.timeStamps,

    }))
  : [];
    

  return {
    ...chatData,
    messages: [...messagesArray], participants: [...participantArray] 
  };
}

export const calculateUnreadMessages = async (chatId, userHandle) => {
  try {
    const chat = await getChatByID(chatId);

    if (!chat.messages || chat.messages.length === 0) {
      console.log('No messages in chat');
      return 0; 
    }

    const unreadMessages = chat.messages.filter(message => {
      const isSeenByUser = message.seenBy && message.seenBy[userHandle];
      return !isSeenByUser; 
    });

    return unreadMessages.length;
  } catch (error) {
    console.error('Error calculating unread messages:', error);
    return 0;
  }
};


export const addChatParticipant = async (chatId, userHandle) => {
  try {
    const currentChat = await getChatByID(chatId);

    if (!Object.values(currentChat.participants).includes(userHandle)) {

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
    console.log(currentChat.participants)

    const participantIndex = currentChat.participants.findIndex(
      (p) => p.participantHandle === participantHandle
    );

    if (participantIndex !== -1) {
      const updatedParticipants = [...currentChat.participants];
      updatedParticipants.splice(participantIndex, 1);


      if (currentChat.participants.length === 0) {
        await update(ref(db), { [`chats/${chatId}`]: null})
        return { success: true, chatDeleted: true };
      }
      await update(ref(db), {
        [`chats/${chatId}/participants/${participantHandle}`]: null,
      });

      await update(ref(db), {
        [`users/${participantHandle}/chats/${chatId}`]: null,
      });

      const updatedChat = {
        ...currentChat,
        participants: updatedParticipants, 
      };

      console.log(
        `User ${participantHandle} removed from chat ${chatId}. Updated chat: `,
        updatedChat
      );
      
      return updatedChat;
    } else {
      console.log("User is not a participant.");
      return { success: false, chat: currentChat };
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


