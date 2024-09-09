import { ref, push, get, update, query, orderByChild, equalTo} from 'firebase/database';
import { db } from '../config/firebase-config'
import { getUserByHandle, getUserByEmail } from './user.services';


export const createTeam = async (teamName, author) => {
  const team = { 
    teamName, 
    author: author.uid,
    createdOn: new Date().toString(),
    members: {}  
  };

  const teamRef = await push(ref(db, 'teams'), team);  
  const teamId = teamRef.key;
  const ownerRef = push(ref(db, `teams/${teamId}/members`));  
  const ownerMember = {
    id: author.uid,        
    email: author.email,
    owner: true,
  };

  await update(ownerRef, ownerMember);
  await update(ref(db), {
    [`teams/${teamId}/id`]: teamId,
  });

  return teamId;
};

export const getTeamByID = async (id) => {
  const snapshot = await get(ref(db, `teams/${id}`));
  if (!snapshot.exists()) {
    throw new Error('Team not found!');
  }
  const teamData = snapshot.val();
  const membersArray = Object.entries(teamData.members || {}).map(([key, member]) => ({
    id: member.id || key,
    ...member,
  }));

  return {
    ...teamData,
    members: membersArray,
  };
};

export const addTeamMember = async (teamId, userIdentifier) => {
  try {
    const currentTeam = await getTeamByID(teamId);
    currentTeam.members = currentTeam.members || {};
    
    let user;
    if (userIdentifier.includes('@')) {
      user = await getUserByEmail(userIdentifier);
    } else {
      user = await getUserByHandle(userIdentifier);
    }

    if (!user || !user.uid || !user.handle) {
      throw new Error('User data is incomplete or not found.');
    }

    if (!Object.values(currentTeam.members).some(member => member.id === user.uid)) {
      const newMemberKey = push(ref(db, `teams/${teamId}/members`)).key;
      const newMember = {
        id: user.uid,
        email: user.email,
        joinedOn: new Date().toString(),
      };
      await update(ref(db, `teams/${teamId}/members/${newMemberKey}`), newMember);

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

export const removeTeamMember = async (teamId, userEmail) => {
  try {
    const currentTeam = await getTeamByID(teamId);
    const memberIndex = currentTeam.members.findIndex(member => member.email === userEmail);

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

export const fetchTeamsOwnedByUser = async (userHandle) => {
  const teamsRef = ref(db, 'teams');
  const userTeamsQuery = query(teamsRef, orderByChild('author'), equalTo(userHandle));
  const snapshot = await get(userTeamsQuery);

  if (!snapshot.exists()) {
    return [];
  }

  return Object.entries(snapshot.val()).map(([key, value]) => ({
    id: key,
    ...value,
  }));
};

// export const createTeam = async (teamName, author) => {
//   const team = { 
//     teamName, 
//     author: author.uid,
//     members: [{
//       id: author.uid,        
//       email: author.email
//     }],
//     createdOn: new Date().toString()
//   };
//   const result = await push(ref(db, 'teams'), team);
//   const id = result.key;
//   await update(ref(db), {
//     [`teams/${id}/id`]: id,
//   });
//   return id;
// };

// export const getTeamByID = async (id) => {
//   const snapshot = await get(ref(db, `teams/${id}`));
//   if (!snapshot.exists()) {
//     throw new Error('Team not found!');
//   }
//   const teamData = snapshot.val();
//   const membersArray = Array.isArray(teamData.members)
//     ? teamData.members
//     : Object.entries(teamData.members || {}).map(([key, member]) => ({
//         id: member.id || key,
//         ...member
//       }));

//   return {
//     ...teamData,
//     members: membersArray,
//   };
// };