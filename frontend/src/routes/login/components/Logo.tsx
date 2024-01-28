import LogoSvg from "./../../../assets/logo.svg?react";

export const Logo = () => {
    return (
        <>
            <div className="logos flex flex-col items-center">
                <LogoSvg className="mb-3 2xl:w-[150px] w-[100px] h-auto" />
                <h1 className="logo-text 2xl:text-5xl text-3xl">Family Tree App</h1>
            </div>
        </>
    );
};
