import React from "react";
import { Outlet } from "react-router-dom";
import LogoSvg from "./../assets/logo.svg?react";

export const Header = () => {
    return (
        <>
            <header className="header">
                <button className="button orange max-h-9">LOGOUT</button>
                <div className="flex items-center justify-center">
                    <h1 className="logo-text text-3xl">Family Tree App</h1>
                    <LogoSvg className="w-[50px] h-auto ml-3" />
                </div>
            </header>
            <Outlet />
        </>
    );
};
