import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllUsers } from "../../services/user.services";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";

export default function UserSearch ({ onAddParticipant }) {
    const [users, setUsers] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    let  search = searchParams.get('search') ?? '';

    
  console.log(users);

  useEffect(() => {
    if (search) {
        getAllUsers(search)
        .then(users => setUsers(users))
        .catch(error => alert(error.message));
    } 
  }, [search]);

  const setSearch = (value) => {
    setSearchParams({
      search: value,
    });
  }

  return (
    <div>
        <h1>Search for user to chat:</h1>
        <label htmlFor="search"></label>
        <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/><br/>
        {users.length > 0 ? (
            users.map(u => (
                <div key={u.handle} style={{ marginBottom: '10px' }}>
                    {u.photoURL ? (
                        <Image
                            src={u.photoURL}
                            alt="Profile"
                            roundedCircle
                            className="profile-image"
                            style={{ marginRight: '10px' }}
                        />
                    ) : (
                        <div className="placeholder-image">No Image</div>
                    )}
                    {u.handle}
                    <Button 
                        variant="success" 
                        style={{ marginLeft: '10px' }} 
                        onClick={() => onAddParticipant(u)}
                    >
                        Add to Chat
                    </Button>
                </div>
            ))
        ) : (
            'No users'
        )}
    </div>
)
}


//   return (
//     <div>
//       <h1>Search for user to chat:</h1>
//       <label htmlFor="search"></label>
//       <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/><br/>
//       {users.length > 0
//       ? users.map(u => <p key={u.handle}> {u.photoURL ? (
//         <Image
//           src={u.photoURL}
//           alt="Profile"
//           roundedCircle
//           className="profile-image"
//         />
//       ) : (
//         <div className="placeholder-image">No Image</div>
//       )} {u.handle}  </p>)
//       : 'No users'
//       }
//     </div>
//     //<button onClick={() => navigate(`/tweets/${t.id}`)}>add to chat</button>
//   )
