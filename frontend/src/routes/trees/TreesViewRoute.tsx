import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store.ts";
import { useEffect, useState } from "react";
import { fetchTrees } from "../../redux/slices/treesSlice/cases/tests/fetchTrees.ts";
import Popup from "reactjs-popup";
import { CreateNewTree } from "../../globalComponents/modals/CreateNewTree.tsx";

export const TreesViewRoute = () => {
    const { familyTrees: trees } = useSelector((root: RootState) => root.trees);
    const dispatch = useDispatch<AppDispatch>();
    const [popupOpen, setPopupOpen] = useState(false);
    useEffect(() => {
        console.log("help pls");
        dispatch(fetchTrees());
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
                        return (
                            <article className="w-1/5 rounded-3xl overflow-hidden cursor-pointer">
                                <figure className="max-h-[10rem] overflow-hidden rounded-3xl">
                                    <img
                                        src={tree.imgUrl}
                                        alt="background"
                                        className="w-full block no-tap"
                                    />
                                </figure>
                                <p className="w-full text-center no-tap">{tree.name}</p>
                            </article>
                        );
                    })
                ) : (
                    <h3 className="title text-center mt-16">there are no trees right now :(</h3>
                )}
            </section>
        </main>
    );
};
