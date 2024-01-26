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
            <section className="flex flex-wrap gap-8 px-8 pt-16">
                {trees.length > 0 ? (
                    trees.map((tree) => {
                        return <TreeView tree={tree} />;
                    })
                ) : (
                    <h3 className="title text-center mt-16">there are no trees right now :(</h3>
                )}
            </section>
        </main>
    );
};
