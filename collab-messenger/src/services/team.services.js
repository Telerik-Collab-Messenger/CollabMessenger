import { ref, push, get, update, query, orderByChild, equalTo} from 'firebase/database';
import { db } from '../config/firebase-config'
import { getUserByHandle, getUserByEmail } from './user.services';



export const createTeam = async (teamName, author) => {
  const team = { 
    teamName, 
    author, 
    members: [{ id: author, handle: author }],
    createdOn: new Date().toString() 
  };
  const result = await push(ref(db, 'teams'), team);
  const id = result.key;
  await update(ref(db), {
    [`teams/${id}/id`]: id,
  });
  return id;
};


export const getTeamByID = async (id) => {
  const snapshot = await get(ref(db, `teams/${id}`));
  if (!snapshot.exists()) {
    throw new Error('Team not found!');
  }
  const teamData = snapshot.val();

  const membersArray = teamData.members
    ? Object.entries(teamData.members).map(([firebaseKey, member]) => ({
      id: firebaseKey,
      handle: member.handle,
      joinedOn: member.joinedOn,
    }))
    : [];

  return {
    ...teamData,
    members: [...membersArray],
  };
}

export const addTeamMember = async (teamId, userIdentifier) => {
  try {
    const currentTeam = await getTeamByID(teamId);
    currentTeam.members = currentTeam.members || [];
    let user;
    if (userIdentifier.includes('@')) {
      user = await getUserByEmail(userIdentifier);
    } else {
      user = await getUserByHandle(userIdentifier);
    }

    if (!user || !user.uid || !user.handle) {
      throw new Error('User data is incomplete or not found.');
    }
    if (!currentTeam.members.some(member => member.id === user.uid)) {
      const newMember = {
        id: user.uid,
        handle: user.handle,
        joinedOn: new Date().toString(),
      };

      console.log('New member to be added:', newMember); 

      currentTeam.members.push(newMember);
      await update(ref(db, `teams/${teamId}`), {
        members: currentTeam.members,
      });

      return currentTeam.members;
    } else {
      console.log('User is already a member.');
      return currentTeam.members;
    }
  } catch (error) {
    console.error("Failed to add member:", error);
    throw error;
  }
};

export const removeTeamMember = async (teamId, userHandle) => {
  try {
    const currentTeam = await getTeamByID(teamId);
    const memberIndex = currentTeam.members.findIndex(member => member.handle === userHandle);

    if (memberIndex !== -1) {
      currentTeam.members.splice(memberIndex, 1);
      await update(ref(db, `teams/${teamId}`), {
        members: currentTeam.members,
      });

      return currentTeam.members;
    } else {
      console.log('User is not a member of the team.');
      return currentTeam.members;
    }
  } catch (error) {
    console.error("Failed to remove member:", error);
    throw error;
  }
};

export const fetchTeamsOwnedByUser = async (userId) => {
  const teamsRef = ref(db, 'teams');
  const userTeamsQuery = query(teamsRef, orderByChild('author'), equalTo(userId));
  const snapshot = await get(userTeamsQuery);

  if (!snapshot.exists()) {
      return [];
  }

  return Object.entries(snapshot.val()).map(([key, value]) => ({
      id: key,
      ...value,
  }));
};