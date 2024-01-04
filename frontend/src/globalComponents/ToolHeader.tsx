import { Outlet, useNavigate } from "react-router-dom";
import LogoSvg from "./../assets/logo.svg?react";
import FeatherSvg from "./../assets/pen.svg?react";
import PenSvg from "./../assets/pen2.svg?react";
import UserSvg from "./../assets/user.svg?react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

export const ToolHeader = () => {
    const navigate = useNavigate();
    const editedTree = useSelector((root: RootState) => root.editedTree);
    return (
        <>
            <header className="header fixed z-30">
                <div className="flex items-center justify-center">
                    <LogoSvg className="w-[50px] h-auto ml-[-0.3em]" />
                    <div className="p-1.5 bg-default-color rounded-full cursor-pointer ml-4">
                        <FeatherSvg className=" fill-secondary-color" />
                    </div>
                    <div className="bg-default-color rounded-full cursor-pointer ml-2">
                        <PenSvg className=" fill-secondary-color" />
                    </div>
                    <div className="p-1.5 bg-default-color rounded-full cursor-pointer ml-2">
                        <UserSvg className=" fill-secondary-color" />
                    </div>
                </div>
                <h1 className="absolute z-[-1] l-0 w-full text-center">{editedTree.tree?.name}</h1>
                <button onClick={() => navigate("/trees")} className="button orange">
                    Exit Tree
                </button>
            </header>
            <Outlet />
        </>
    );
};
