import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store.ts";
import { Navigate, Outlet } from "react-router-dom";
import { validateJwt } from "../redux/slices/userSlices/cases/verifyToken.ts";

export const Protector = () => {
    const [verified, setVerified] = useState(false);
    const userData = useSelector((root: RootState) => root.user);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const tokenString = localStorage.getItem("JWTtoken");
        if (!tokenString) console.error("token from local storage is null");
        dispatch(validateJwt(tokenString || "")).then(() => setVerified(true));
    }, []);
    return <>{verified && <>{userData.userData ? <Outlet /> : <Navigate to="/login" />}</>}</>;
};
