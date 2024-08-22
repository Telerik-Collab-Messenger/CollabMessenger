import { ref, push, get, update, remove, onValue } from 'firebase/database';
import { db } from '../config/firebase-config'



export const createTeam = async (teamName, author) => {
    const team = {teamName, author, members:[author], createdOn: new Date().toString()};
    const result = await push(ref(db, 'team'), team);
    const id = result.key;
    await update(ref(db), {
      [`team/${id}/id`]: id,
    });
    return id; 
}