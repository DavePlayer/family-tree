import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { AppDispatch } from "../../redux/store";
import { fetchEditerTreeData } from "../../redux/slices/treesSlice/cases/tests/fetchEditTreeData";
import { useEffect } from "react";

export const TreeEdit = () => {
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchEditerTreeData(parseInt(params.id || "-1")));
    }, [])
    return (
        <>
            <main className="w-full min-h-[100vh] bg-mainBg text-default-color pt-[80px]">
                <h2>test</h2>
            </main>
        </>
    )
}
