import { useContext } from "react";
import { AuthContext } from "../state/auth.context";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth is outside ofAuthManager');
  }
  return context;
};

export default useAuth;