import { Outlet } from "react-router-dom";
import LogoSvg from "./../assets/logo.svg?react";
import { useAppDispatch } from "../redux/store.ts";
import { logout } from "../redux/slices/userSlices/userSlice.ts";

export const Header = () => {
    const dispatch = useAppDispatch();
    return (
        <>
            <header className="header">
                <button className="button orange max-h-9" onClick={() => dispatch(logout())}>
                    LOGOUT
                </button>
                <div className="flex items-center justify-center">
                    <h1 className="logo-text text-3xl">Family Tree App</h1>
                    <LogoSvg className="w-[50px] h-auto ml-3" />
                </div>
            </header>
            <Outlet />
        </>
    );
};
