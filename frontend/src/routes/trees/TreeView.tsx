import React, { useEffect, useState } from "react";
import { Tree } from "./../../redux/slices/treesSlice/treeSlice.ts";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store.ts";
import { getImage } from "../../globalComponents/functions/getImages.ts";
import CloseIcon from "./../../assets/close.svg?react";
import { removeTree } from "../../redux/slices/treesSlice/cases/removeTree.ts";

export const TreeView: React.FC<{ tree: Tree }> = ({ tree }) => {
    const userData = useSelector((root: RootState) => root.user);
    const [image, setImage] = useState<Blob | null>(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        getImage(userData.jwt, tree.imgUrl).then((img) => setImage(img));
    }, []);
    return (
        <div className="w-full relative">
            <Link key={tree.id} to={`/trees/${tree.id}`} className="w-full">
                <article key={tree.id} className="w-full rounded-3xl overflow-hidden">
                    <figure className="h-[10rem] overflow-hidden rounded-3xl grid content-center">
                        <img
                            src={image ? URL.createObjectURL(image) : ""}
                            alt="background"
                            className="w-full block no-tap"
                        />
                    </figure>
                    <p className="w-full text-center no-tap">{tree.name}</p>
                </article>
            </Link>
            <CloseIcon
                className="absolute right-3 top-3 fill-orange cursor-pointer z-[10]"
                onClick={() => dispatch(removeTree({ token: userData.jwt, id: tree.id }))}
            />
        </div>
    );
};
