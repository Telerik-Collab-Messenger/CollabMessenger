import { useContext, useState } from "react";
import { AppContext } from "../../../state/app.context";
import { useNavigate } from "react-router-dom";
import { getUserByHandle, createUserHandle } from "../../../services/user.services";
import { registerUser } from "../../../services/authenticate-service";


export default function Register() {
  const [user, setUser] = useState({
    handle: '',
    email: '',
    phoneNumber: '',
    password: '',
    passwordCheck: ''
  });

  const updateUser = prop => e => {
    setUser({
      ...user,
      [prop]: e.target.value,
    })
  };

  const handleLoginNavigation = () => {
    navigate('/Login');
  };

  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      return alert('No credentials provided!');
    }
    if (user.password !== user.passwordCheck) {
      return alert("Password doesn't match");
    }
    if (!user.handle || user.firstName.length < 5 || user.firstName.length > 35){
      return alert("Invalid first name it (between 5 and 35 symbols)");
    }
    // have to fix check for phoneNumber bigint // string check
    // if (!user.phoneNumber ) {
    //     return alert('!');
    // }

    try {
      const userFromDB = await getUserByHandle(user.handle);
      if (userFromDB) {
        return alert(`User {${user.handle}} already exists!`);
      }
      const credential = await registerUser(user.email, user.password);
      await createUserHandle(user.handle, credential.user.uid, user.email);
      setAppState({ user: credential.user, userData: null });
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form className="register-form">
      <h1>Register</h1>
      <label htmlFor="email">Email: </label>
      <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" /><br /><br />
      <label htmlFor="password">Password: </label>
      <input value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /><br /><br />
      <label htmlFor="passwordCheck">Confirm Password: </label>
      <input value={user.passwordCheck} onChange={updateUser('passwordCheck')} type="password" name="passwordCheck" id="passwordCheck" /><br /><br />
      <button className="register-button" onClick={register}>Register</button>
      <button className="register-button" onClick={handleLoginNavigation}>Login</button>
    </form>
  );
}