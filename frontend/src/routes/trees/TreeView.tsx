import React, { useEffect, useState } from "react";
import { Tree } from "./../../redux/slices/treesSlice/treeSlice.ts";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
import { getImage } from "../../globalComponents/functions/getImages.ts";

export const TreeView: React.FC<{ tree: Tree }> = ({ tree }) => {
    const userData = useSelector((root: RootState) => root.user);
    const [image, setImage] = useState<Blob | null>(null);
    useEffect(() => {
        getImage(userData.jwt, tree.imgUrl).then((img) => setImage(img));
    }, []);
    return (
        <Link key={tree.id} to={`/trees/${tree.id}`} className="w-1/5">
            <article key={tree.id} className="w-full rounded-3xl overflow-hidden cursor-pointer">
                <figure className="h-[10rem] overflow-hidden rounded-3xl flex justify-center">
                    <img
                        src={image ? URL.createObjectURL(image) : ""}
                        alt="background"
                        className="w-full max-w-none block no-tap"
                    />
                </figure>
                <p className="w-full text-center no-tap">{tree.name}</p>
            </article>
        </Link>
    );
};
