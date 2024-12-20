import React from 'react';
import Logo from '../../../Common/Logo/Logo';
import Button from '../../../Common/Button/Button';
import {useAuthContext} from "../../../../contexts/AuthContext";
import {CircleUserRound} from 'lucide-react'
import {useUserContext} from "../../../../contexts/UserContext";
import Loading from "../../../Common/Loading/Loading";

const DesktopNavbar = () => {
    const {userBaseData,loadingData} = useUserContext();
    return (
        <>

            <div className=" w-[100%] sm:flex flex-row gap-2 lg:gap-5 items-center justify-between pr-5 lg:pr-20">
                <Logo className={`text-logo-md sm:text-logo-sm md:text-logo-md lg:text-logo-lg pl-14`}/>
                <div className="flex gap-4">
                    <Button className={``} to="/contact">Contact Us</Button>
                    { loadingData ?
                        <Button className={`border-2 border-lime text-titles flex justify-center`}><CircleUserRound className={`animate-spin`}/></Button>
                        :
                        (  userBaseData    ?
                                (
                                    <Button to="/admin-panel"
                                            className="border-2 border-lime text-titles flex justify-center">
                                        <CircleUserRound className={`mr-2`}/>
                                        {userBaseData?.businessName}
                                    </Button>)
                                : (
                                    <Button to="/auth" state={{showRegister: false}} className="bg-lime">Login</Button>
                                )
                        )
                    }
                </div>
            </div>
        </>
    );
};
export default DesktopNavbar;
