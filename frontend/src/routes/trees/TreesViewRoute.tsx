import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store.ts";
import { useEffect, useState } from "react";
import { fetchTrees } from "../../redux/slices/treesSlice/cases/fetchTrees.ts";
import Popup from "reactjs-popup";
import { CreateNewTree } from "../../globalComponents/modals/CreateNewTree.tsx";
import { TreeView } from "./TreeView.tsx";

export const TreesViewRoute = () => {
    const { familyTrees: trees } = useSelector((root: RootState) => root.trees);
    const dispatch = useDispatch<AppDispatch>();
    const [popupOpen, setPopupOpen] = useState(false);
    const userData = useSelector((root: RootState) => root.user);
    useEffect(() => {
        dispatch(fetchTrees(userData.jwt));
    }, [dispatch]);
    return (
        <main className="w-full min-h-[100vh] bg-mainBg text-default-color pt-[150px]">
            <div className="w-full relative">
                <h2 className="title big text-center">Your Trees</h2>
                <Popup
                    open={popupOpen}
                    trigger={
                        <button
                            onClick={() => setPopupOpen(true)}
                            className="button orange absolute right-10 bottom-1/2 translate-y-1/2"
                        >
                            CREATE NEW TREE
                        </button>
                    }
                    modal
                    nested
                >
                    {
                        // It looks like there is a line to allow it but it is commented out
                        // I'm assuming it was difficult to type properly and the library author gave up.
                        // @ts-ignore
                        (close) => (
                            <>
                                <CreateNewTree close={() => close()} />
                            </>
                        )
                    }
                </Popup>
            </div>
            <section className="grid grid-cols-5 gap-8 px-20 pt-16 justify-items-center max-h-[70vh] overflow-y-scroll">
                {trees.length > 0 ? (
                    trees.map((tree) => {
                        return <TreeView key={tree.id} tree={tree} />;
                    })
                ) : (
                    <h3 className="title text-center mt-16 w-full col-span-5">
                        there are no trees right now :(
                    </h3>
                )}
            </section>
        </main>
    );
};
