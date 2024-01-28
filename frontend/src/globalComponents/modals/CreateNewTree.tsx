import React, { useState } from "react";
import DownloadIcon from "./../../assets/download.svg?react";
import CloseIcon from "./../../assets/close.svg?react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createNewTree } from "../../redux/slices/treesSlice/cases/createNewTree";
import { AppDispatch, RootState } from "../../redux/store";
import { uploadImage } from "../functions/uploadImageCase.ts";

export const CreateNewTree: React.FC<{ close: () => void }> = ({ close }) => {
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
            <div className="flex flex-col items-center justify-between py-10">
                <div>
                    <label
                        htmlFor="upload"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                        <figure className="w-[250px] overflow-hidden flex flex-col items-center pb-3">
                            {selectedFile ? (
                                <>
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="image"
                                        className="max-w-full max-h-1/2 block max-h-[300px]"
                                    />
                                    <p className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">
                                            Click or drag/drop to upload again
                                        </span>
                                    </p>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <DownloadIcon className="w-12 h-12 mb-4" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or
                                        drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG (PREFERABLY. 800x400px)
                                    </p>
                                </div>
                            )}
                        </figure>
                    </label>
                    <input
                        id="upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files![0])}
                    />
                </div>
                <input
                    value={name}
                    onChange={(e) => handleForm(e)}
                    type="text"
                    placeholder="tree name"
                    className="mt-5 text-center w-1/2"
                />
                <button onClick={() => handleCrateTree()} className="gradient-button w-1/2">
                    Create Tree
                </button>
            </div>
        </div>
    );
};
