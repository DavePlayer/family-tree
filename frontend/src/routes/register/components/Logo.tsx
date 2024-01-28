import LogoSvg from "./../../../assets/logo.svg?react";

export const Logo = () => {
    return (
        <>
            <div className="logos flex flex-col items-center">
                <LogoSvg className="mb-3 w-[150px] h-auto" />
                <h1 className="logo-text text-5xl">Family Tree App</h1>
            </div>
        </>
    );
};
