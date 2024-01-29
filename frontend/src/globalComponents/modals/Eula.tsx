import React, { useState } from "react";
import DownloadIcon from "./../../assets/download.svg?react";
import CloseIcon from "./../../assets/close.svg?react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createNewTree } from "../../redux/slices/treesSlice/cases/createNewTree.ts";
import { AppDispatch, RootState } from "../../redux/store.ts";
import { uploadImage } from "../functions/uploadImageCase.ts";

export const Eula: React.FC<{ close: () => void }> = ({ close }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const userData = useSelector((root: RootState) => root.user);
    const handleFile = (file: File) => {
        if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
            let image = new Image();

            image.onload = () => {
                const width = image.width;
                const height = image.height;

                console.log("Image width:", width);
                console.log("Image height:", height);

                // Define the target aspect ratio (3:4)
                const targetAspectRatio = 1 / 2;

                // Calculate the actual aspect ratio
                const actualAspectRatio = height / width;

                // Define a tolerance level for acceptable aspect ratios
                const tolerance = 0.1; // You can adjust this value based on your requirements

                // Check if the aspect ratio is within the acceptable range
                if (
                    actualAspectRatio >= targetAspectRatio - tolerance &&
                    actualAspectRatio <= targetAspectRatio + tolerance
                ) {
                    // Aspect ratio is valid, you can proceed with the selected file
                    setSelectedFile(file);
                } else {
                    // Display an error message or handle the aspect ratio mismatch
                    toast.error("image ratio must be 1/2");
                    // You can also reset the selected file or take other appropriate actions.
                }
            };

            image.src = URL.createObjectURL(file);
        }
    };
    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleCrateTree = () => {
        if (selectedFile && name.length > 0) {
            return dispatch(
                uploadImage({
                    file: selectedFile,
                    token: userData.jwt,
                })
            ).then((a) => {
                return dispatch(
                    createNewTree({
                        token: userData.jwt,
                        tree: {
                            name: name,
                            imgUrl: `${import.meta.env.VITE_API_URL}/assets/${(
                                a.payload as string
                            ).replace(/\"/g, "")}`,
                        },
                    })
                )
                    .then((a) => {
                        console.log(a);
                        return a;
                    })
                    .then((a) => a.meta.requestStatus != "rejected" && close())
                    .catch(() => {});
            });
        }
        return toast.error("not enough data provided");
    };

    return (
        <div className="modal relative">
            <CloseIcon
                className="absolute right-1 top-[-2rem] fill-orange cursor-pointer z-[1000000]"
                onClick={() => close()}
            />
            <h1 className="title w-full text-center mb-5">End-User License Agreement</h1>
            <div className="flex flex-col items-center justify-between max-h-[60vh] overflow-y-scroll py-10">
                <p className="px-8">
                    <span className="pb-4">
                        This End-User License Agreement ("Agreement") is a legal agreement between
                        you and the FamilyTree application ("Application"). By using the
                        Application, you agree to be bound by the terms and conditions of this
                        Agreement.
                    </span>
                    <ol>
                        <li>
                            <h2 className="title pt-4 !text-2xl">1. User Consent:</h2>
                            <p>
                                All members of the FamilyTree application, including the user, must
                                adhere to the following principles: Before submitting personal
                                information to the family tree, members must obtain consent from
                                living family members. If members post content without such consent,
                                the Registered User will be held responsible.
                            </p>
                        </li>
                        <li>
                            <h2 className="title pt-4 !text-2xl">2. User Responsibilities:</h2>
                            <p>
                                Users are responsible for obtaining proper authorization before
                                sharing personal information on the family tree. The Application is
                                not liable for any content posted without proper consent.
                            </p>
                        </li>
                        <li>
                            <h2 className="title pt-4 !text-2xl">
                                3. Privacy and Confidentiality:
                            </h2>
                            <p>
                                Users must respect the privacy and confidentiality of living family
                                members. Do not disclose sensitive information without proper
                                authorization.
                            </p>
                        </li>
                        <li>
                            <h2 className="title pt-4 !text-2xl">4. Compliance with Laws:</h2>
                            <p>
                                Users must comply with all applicable laws and regulations when
                                using the Application.
                            </p>
                        </li>
                        <li>
                            <h2 className="title pt-4 !text-2xl">5. Limitation of Liability:</h2>
                            <p>
                                The Application is not responsible for any unauthorized or unlawful
                                use of information posted on the family tree.
                            </p>
                        </li>
                        <li>
                            <h2 className="title pt-4 !text-2xl">6. Termination:</h2>
                            <p>
                                This Agreement is effective until terminated by the user or the
                                Application. The Application reserves the right to terminate or
                                suspend access to the family tree for users who violate this
                                Agreement.
                            </p>
                        </li>
                        <li>
                            <h2 className="title pt-4 !text-2xl">7. Governing Law:</h2>
                            <p>
                                This Agreement shall be governed by and construed in accordance with
                                the laws of Poland.
                            </p>
                        </li>
                    </ol>
                    <span className="pt-2">
                        By using the FamilyTree application, you acknowledge that you have read,
                        understood, and agree to be bound by the terms of this Agreement. Students
                        29.01.2024
                    </span>
                </p>
            </div>
        </div>
    );
};
