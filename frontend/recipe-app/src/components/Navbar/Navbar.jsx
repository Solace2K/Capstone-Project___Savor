import React from 'react'
import ProfileInfo from '../Cards/Profileinfo';
import { useNavigate} from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate;

    const onLogout = () => {
        navigate("/Login");
    };

    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow" >
            <h2 className="text-xl font-medium text-black py-2">Recipes</h2>


            

            <ProfileInfo onLogout={onLogout}/>
        </div>
    );
};

export default Navbar;