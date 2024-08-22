import { ref, push, get, update } from 'firebase/database';
import { db } from '../config/firebase-config'



export const createTeam = async (teamName, author) => {
  const team = { teamName, author, members: [author], createdOn: new Date().toString() };
  const result = await push(ref(db, 'teams'), team);
  const id = result.key;
  await update(ref(db), {
    [`teams/${id}/id`]: id,
  });
  return id;
}


export const getTeamByID = async (id) => {
  const snapshot = await get(ref(db, `Teams/${id}`));
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


export const addTeamMember = async (teamId, userHandle) => {
  try {
    const currentTeam = await getTeamByID(teamId);

    if (!currentTeam.members.some(member => member.handle === userHandle)) {
      const newMember = {
        handle: userHandle,
        joinedOn: new Date().toString(),
      };
      currentTeam.members.push(newMember);
      await update(ref(db, `Teams/${teamId}`), {
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
      await update(ref(db, `Teams/${teamId}`), {
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