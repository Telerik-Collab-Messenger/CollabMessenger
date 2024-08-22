import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllUsers } from "../../services/user.services";
import PropTypes from "prop-types";

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

UserSearch.propTypes = {
    onAddParticipant: PropTypes.func.isRequired,
};

  return (
    <div>
    <h1>Search for user to chat:</h1>
    <label htmlFor="search"></label>
    <input 
    value={search} 
    onChange={e => setSearch(e.target.value)} 
    type="text" 
    name="search" 
    id="search" 
    placeholder="Search..." 
    className="input input-bordered w-64 max-w-full mb-4 px-4 py-2"
    />
    {users.length > 0 ? (
        users.map(u => (
            <div key={u.handle} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                {u.photoURL ? (
                    <img
                        src={u.photoURL}
                        alt="Profile"
                        style={{ borderRadius: '50%', marginRight: '10px', width: '40px', height: '40px' }}
                    />
                ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                        No Image
                    </div>
                )}
                {u.handle}
                <button 
                    style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }} 
                    onClick={() => onAddParticipant(u)}
                >
                    Add to Chat
                </button>
            </div>
        ))
    ) : (
        'No users'
    )}
</div>
)
}


{/* <div>
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
</div> */}