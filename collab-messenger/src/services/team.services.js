import { ref, push, get, update, query, orderByChild, equalTo, remove} from 'firebase/database';
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

  const userTeamsRef = ref(db, `users/${author.uid}/teams/${teamId}`);
  await update(userTeamsRef, {
    teamName: teamName,
    isMember: false,
    isOwner: true,
  });

  return teamId;
};


export const getTeamByID = async (id) => {
  const snapshot = await get(ref(db, `teams/${id}`));
  if (!snapshot.exists()) {
    throw new Error('Team not found!');
  }
  const teamData = snapshot.val();
  const membersArray = teamData.members 
    ? Object.entries(teamData.members).map(([key, member]) => ({
        id: member.id || key,
        ...member,
      }))
    : [];
    
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

    if (!user || !user.uid || !user.email) {
      throw new Error('User data is incomplete or not found.');
    }

    if (!Object.values(currentTeam.members).some(member => member.id === user.uid)) {
      const newMemberKey = push(ref(db, `teams/${teamId}/members`)).key;
      const newMember = {
        id: user.uid,
        email: user.email,
        joinedOn: new Date().toISOString(),
      };

      await update(ref(db, `teams/${teamId}/members/${newMemberKey}`), newMember);
        const userTeamsRef = ref(db, `users/${user.uid}/teams/${teamId}`);
        await update(userTeamsRef, {
            teamName: currentTeam.teamName,
            isMember: true,
            isOwner: false,
        });

      return { ...currentTeam.members, [newMemberKey]: newMember };
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
    if (!currentTeam || !currentTeam.members) {
      console.log('Team or team members not found.');
      return;
    }
    const memberToRemove = Object.values(currentTeam.members).find(member => member.email === userEmail);
    if (memberToRemove) {
      await remove(ref(db, `teams/${teamId}/members/${memberToRemove.id}`));
      const userTeamsRef = ref(db, `users/${memberToRemove.id}/teams/${teamId}`);
      await remove(userTeamsRef);
      const updatedMembers = Object.values(currentTeam.members).filter(member => member.id !== memberToRemove.id);
      await update(ref(db, `teams/${teamId}`), { members: updatedMembers });

      console.log('Member removed from the team and user reference.');
      return updatedMembers;
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

export const fetchUserTeams = async (userId) => {
  try {
    const userTeamsRef = ref(db, `users/${userId}/teams`);
    const snapshot = await get(userTeamsRef);
    if (snapshot.exists()) {
      const teams = snapshot.val();
      return teams ? Object.keys(teams) : [];
    } else {
      console.log('No teams found for this user.');
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch user teams:', error);
    throw error;
  }
};

export const fetchTeamsWhereUserIsMember = async (userHandle) => {
  const snapshot = await get(ref(db, 'teams'));
  const teams = snapshot.val() || {};
  
  return Object.values(teams).filter(team => 
      team.members && Object.values(team.members).some(member => member.id === userHandle && !member.owner)
  );
};

