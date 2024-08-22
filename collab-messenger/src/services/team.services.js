import { ref, push, get, update, remove, onValue } from 'firebase/database';
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


