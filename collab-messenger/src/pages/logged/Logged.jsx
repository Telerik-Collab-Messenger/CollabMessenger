import { getAllUsersLength } from '../../services/user.services';
import './Logged.css'
import { useState, useEffect } from 'react';

export default function Logged() {
    const [users, setUsers] = useState([]);

    useEffect (() => {
        getAllUsersLength()
        .then(usersSnapshot => {
            if (usersSnapshot.exists()) {
              const usersData = Object.values(usersSnapshot.val());
              setUsers(usersData);
            }
          })
          .catch(error => {
            console.error("Error fetching users:", error);
          });
      }, []);

    return (
        <div id='main-logged-container'>
            <div id='inner-container'>
            <h2>Current Active Users: {users.length}</h2>
            </div>
        </div>
    )
}