import { AppContext } from "../../state/app.context"
import { useContext } from 'react';

export default function Logged() {
    
    const { user } = useContext(AppContext);
    
    return (
        <div id="core">
            <h1>CorePage</h1>
            {/* {console.log(user)} */}
        </div>
    )
}