import { Outlet, useNavigate } from "react-router-dom";
import LogoSvg from "./../assets/logo.svg?react";
import UserCreateSvg from "./../assets/userCreate.svg?react";
import UserRemoveSvg from "./../assets/userRemove.svg?react";
import LinkCreateSvg from "./../assets/link.svg?react";
import LinkRemoveSvg from "./../assets/destroyLink.svg?react";
import NodeCreateSvg from "./../assets/nodeCreate.svg?react";
import { RootState, useAppDispatch } from "../redux/store";
import { useSelector } from "react-redux";
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
                            editedTree.MouseMode != MouseMode.CreateNode
                                ? dispatch(setMouseMode(MouseMode.CreateNode))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <NodeCreateSvg
                            className={`${
                                editedTree.MouseMode == MouseMode.CreateNode
                                    ? "fill-orange"
                                    : "fill-secondary-color"
                            }`}
                        />
                    </div>
                    <div
                        className="p-1.5 bg-default-color rounded-full cursor-pointer ml-4"
                        onClick={() =>
                            editedTree.MouseMode != MouseMode.Create
                                ? dispatch(setMouseMode(MouseMode.Create))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <UserCreateSvg
                            className={`${
                                editedTree.MouseMode == MouseMode.Create
                                    ? "fill-orange"
                                    : "fill-secondary-color"
                            }`}
                        />
                    </div>
                    <div
                        className="p-1.5 bg-default-color rounded-full cursor-pointer ml-2"
                        onClick={() =>
                            editedTree.MouseMode != MouseMode.Delete
                                ? dispatch(setMouseMode(MouseMode.Delete))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <UserRemoveSvg
                            className={`${
                                editedTree.MouseMode == MouseMode.Delete
                                    ? "fill-orange"
                                    : "fill-secondary-color"
                            }`}
                        />
                    </div>
                    <div
                        className="p-1.5 bg-default-color rounded-full cursor-pointer ml-2"
                        onClick={() =>
                            editedTree.MouseMode != MouseMode.Link
                                ? dispatch(setMouseMode(MouseMode.Link))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <LinkCreateSvg
                            className={`${
                                editedTree.MouseMode == MouseMode.Link
                                    ? "fill-orange"
                                    : "fill-secondary-color"
                            }`}
                        />
                    </div>
                    <div
                        className="p-1.5 bg-default-color rounded-full cursor-pointer ml-2"
                        onClick={() =>
                            editedTree.MouseMode != MouseMode.RmLink
                                ? dispatch(setMouseMode(MouseMode.RmLink))
                                : dispatch(setMouseMode(MouseMode.None))
                        }
                    >
                        <LinkRemoveSvg
                            className={`${
                                editedTree.MouseMode == MouseMode.RmLink
                                    ? "fill-orange"
                                    : "fill-secondary-color"
                            }`}
                        />
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
