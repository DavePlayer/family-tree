import { useEffect, useState } from "react";
import { Logo } from "./components/Logo.tsx";
import { GradientText } from "./components/GradientText.tsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "./../../redux/store.ts";
import { loginUser } from "../../redux/slices/userSlices/cases/login.ts";
import { useDispatch, useSelector } from "react-redux";
import { validateJwt } from "../../redux/slices/userSlices/cases/verifyToken.ts";

export const LoginRoute = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [emailError, setEmailError] = useState("");
    const [passError, setPasssError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value.replace(/\s/g, ""),
            };
        });
    };

    useEffect(() => {
        // must be redone to another protector.
        const tokenString = localStorage.getItem("JWTtoken");
        if (!tokenString) return console.error("token from local storage is null");
        dispatch(validateJwt(tokenString || "")).then(() => navigate("/trees"));
    }, []);

    const handleEmailSyntax = () => {
        const regex =
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (!regex.test(loginData.email)) {
            setEmailError("invalid email format");
        } else {
            setEmailError("");
        }

        return regex.test(loginData.email);
    };
    const handlePassword = () => {
        const { password } = loginData;
        if (password.length === 0) {
            setPasssError("password too short");
            return false;
        }
        setPasssError("");
        return true;
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (handlePassword() && handleEmailSyntax()) {
            console.log(loginData);
            // return navigate("/trees");
            return dispatch(
                loginUser({
                    email: loginData.email,
                    password: loginData.password,
                })
            ).then(() => navigate("/trees"));
        }
        toast.error("invalid login data");
    };

    return (
        <main className="flex h-[100vh] bg-mainBg">
            <section className="h-[100vh] w-1/2 bg-gradient flex items-center justify-center text-gradient-text">
                <GradientText />
            </section>
            <section className="w-1/2 flex justify-center items-center text-default-color">
                <article className="flex flex-col 2xl:w-1/2 w-3/4 ">
                    <Logo />
                    <form action="#" className="w-full">
                        <p className="mt-10 mb-5 text-lg">Please login to your account</p>
                        <p className="w-full mb-1 pl-4 text-error text-sm">{emailError}</p>
                        <input
                            className="w-full mb-4"
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={loginData.email}
                            onChange={(e) => handleForm(e)}
                            onBlur={() => handleEmailSyntax()}
                        />
                        <p className="w-full mb-1 pl-4 text-error text-sm">{passError}</p>
                        <input
                            className="w-full"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => handleForm(e)}
                            onBlur={() => handlePassword()}
                        />
                        <button onClick={(e) => handleSubmit(e)} className="w-full gradient-button">
                            Login
                        </button>
                    </form>
                    <div className="w-full flex justify-between 2xl:mt-[8rem] mt-[4rem] items-center">
                        <p>Don't have an account?</p>
                        <button onClick={() => navigate("/register")} className="register-button">
                            Register
                        </button>
                    </div>
                </article>
            </section>
        </main>
    );
};
