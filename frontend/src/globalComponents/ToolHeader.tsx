import { Outlet, useNavigate } from "react-router-dom";
import LogoSvg from "./../assets/logo.svg?react";
import FeatherSvg from "./../assets/pen.svg?react";
import PenSvg from "./../assets/pen2.svg?react";
import UserSvg from "./../assets/user.svg?react";
import { AppDispatch, RootState, useAppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { MouseMode, setMouseMode } from "../redux/slices/treesSlice/editedTreeSlice.ts";

export const ToolHeader = () => {
    const navigate = useNavigate();
    const editedTree = useSelector((root: RootState) => root.editedTree);
    const dispatch = useAppDispatch();
    return (
        <>
            <header className="header fixed z-30">
                <div className="flex items-center justify-center">
                    <LogoSvg className="w-[50px] h-auto ml-[-0.3em]" />
                    <div
                        className="p-1.5 bg-default-color rounded-full cursor-pointer ml-4"
                        onClick={() =>
                            editedTree.MouseMode != MouseMode.Link
                                ? dispatch(setMouseMode(MouseMode.Link))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <FeatherSvg className=" fill-secondary-color" />
                    </div>
                    <div
                        className="bg-default-color rounded-full cursor-pointer ml-2"
                        onClick={() =>
                            editedTree.MouseMode != MouseMode.Link
                                ? dispatch(setMouseMode(MouseMode.Link))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <PenSvg className=" fill-secondary-color" />
                    </div>
                    <div
                        className="p-1.5 bg-default-color rounded-full cursor-pointer ml-2"
                        onClick={() =>
                            editedTree.MouseMode != MouseMode.Create
                                ? dispatch(setMouseMode(MouseMode.Create))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <UserSvg className=" fill-secondary-color" />
                    </div>
                    <div
                        className="p-1.5 bg-default-color rounded-full cursor-pointer ml-2"
                        onClick={() =>
                            editedTree.MouseMode != MouseMode.Delete
                                ? dispatch(setMouseMode(MouseMode.Delete))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <button className="text-black">Delete</button>
                    </div>
                    <div
                        className="p-1.5 bg-default-color rounded-full cursor-pointer ml-2"
                        onClick={() =>
                            editedTree.MouseMode != MouseMode.RmLink
                                ? dispatch(setMouseMode(MouseMode.RmLink))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <button className="text-black">RM Link</button>
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
