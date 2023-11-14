import React, { useState } from "react";
import DownloadIcon from "./../../assets/download.svg?react";
import CloseIcon from "./../../assets/close.svg?react";

export const CreateNewTree: React.FC<{ close: () => void }> = ({ close }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const handleFile = (file: File) => {
        if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
            setSelectedFile(file);
        }
    };
    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
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
                <button className="gradient-button w-1/2">Create Tree</button>
            </div>
        </div>
    );
};
