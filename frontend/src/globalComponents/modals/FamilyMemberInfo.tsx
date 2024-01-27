import { useEffect, useState } from "react";
import { FamilyMember } from "../../redux/slices/treesSlice/editedTreeSlice.ts";
import DatePicker from "react-datepicker";
import CloseIcon from "./../../assets/close.svg?react";
import EditIcon from "./../../assets/edit.svg?react";
import SaveIcon from "./../../assets/save.svg?react";
import DownloadIcon from "./../../assets/download.svg?react";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store.ts";
import { updateFamilyMemberData } from "../../redux/slices/treesSlice/cases/tests/updateFamilyMemberData.ts";

export const FamilyMemberInfo = ({ famMember, close }: { famMember: FamilyMember; close: any }) => {
    const [member, setMember] = useState<FamilyMember>();
    const [isEditMode, setIsEditMode] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFile = (file: File) => {
        if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
            setSelectedFile(file);
        }
    };

    useEffect(() => {
        setMember(famMember);
    }, []);

    const toggleEdit = () => {
        setIsEditMode((prev) => {
            if (!prev) return !prev;
            console.log(member);
            if (member?.status == "dead" && !member?.deathTime) {
                member.status = "alive";
            }
            if (member) {
                dispatch(updateFamilyMemberData({
                    famMember: member,
                    image: selectedFile || undefined
                })).then(() => {
                    setMember((prev) => {
                        if (prev) {
                            return {
                                ...prev,
                                img_url: selectedFile ? URL.createObjectURL(selectedFile) : prev.img_url
                            }
                        }
                    })
                })
            }
            return !prev;
        });
    };

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        setMember((prev) => {
            return {
                ...prev,
                deathTime: e.target.name == "status" ? null : prev?.deathTime,
                [e.target.name]: e.target.value,
            } as FamilyMember;
        });
    };

    return (
        <div className="2xl:max-h-[50vh] xl:max-h-[70vh]">
            {!isEditMode ? (
                <>
                    <CloseIcon
                        className="absolute right-3 top-3 fill-orange cursor-pointer z-[1000000]"
                        onClick={() => close()}
                    />
                    <EditIcon
                        className="absolute right-12 top-3 fill-orange cursor-pointer z-[1000000]"
                        onClick={() => toggleEdit()}
                    />
                </>
            ) : (
                <>
                    <CloseIcon
                        className="absolute right-3 top-3 fill-red-400 cursor-pointer z-[1000000]"
                        onClick={() => close()}
                    />
                    <SaveIcon
                        className="absolute right-12 top-3 fill-green-400 cursor-pointer z-[1000000]"
                        onClick={() => toggleEdit()}
                    />
                </>
            )}
            <h1 className="text-4xl text-center mb-5 font-extralight">Family Member info</h1>
            {member && (
                <article className="p-3 px-9 flex gap-8 h-full items-center">
                    {isEditMode ? (
                        <>
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
                        </>
                    ) : (
                        <figure className="rounded-full overflow-hidden w-1/4 aspect-square flex items-center">
                            <img src={member.img_url} alt="user image" className="h-full w-full text-center flex justify-center items-center" />
                        </figure>
                    )}
                    <section className="w-3/4 bg-dark-1 rounded-3xl p-3 min-h-[20rem] h-full overflow-y-scroll">
                        <div className="w-full">
                            <label className="text-gray-400" htmlFor="name">
                                Name
                            </label>
                            {isEditMode ? (
                                <div className="">
                                    <input
                                        onChange={(e) => handleChange(e)}
                                        className=""
                                        name="name"
                                        value={member.name}
                                    />
                                </div>
                            ) : (
                                <p className="text-2xl">{member.name}</p>
                            )}
                        </div>
                        <div className="w-full flex mt-2">
                            <div className="w-1/2 ">
                                <label className="text-gray-400" htmlFor="status">
                                    Status
                                </label>
                                {isEditMode ? (
                                    <>
                                        <div className="select-wrapper w-min">
                                            <select
                                                value={member.status}
                                                onChange={(e) => handleChange(e)}
                                                className=""
                                                name="status"
                                                id="status"
                                            >
                                                <option value="alive">alive</option>
                                                <option value="dead">dead</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-2xl" id="status">
                                        {member.status}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                {member.status == "dead" && (
                                    <>
                                        {isEditMode ? (
                                            <>
                                                <label className="text-gray-400" htmlFor="date">
                                                    Death Time
                                                </label>
                                                <div className="">
                                                    <DatePicker
                                                        selected={member.deathTime}
                                                        onChange={(date) =>
                                                            setMember((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    deathTime: date || null, // Convert to ISO string or null
                                                                } as FamilyMember;
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {member.deathTime && (
                                                    <>
                                                        <label
                                                            className="text-gray-400"
                                                            htmlFor="date"
                                                        >
                                                            Death Time
                                                        </label>
                                                        <p className="text-2xl" id="date">
                                                            {member.deathTime.toLocaleDateString()}
                                                        </p>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="w-full mt-2">
                            <label className="text-gray-400" htmlFor="address">
                                Address
                            </label>
                            {isEditMode ? (
                                <div className="">
                                    <input
                                        onChange={(e) => handleChange(e)}
                                        className=""
                                        name="address"
                                        value={member.address}
                                    />
                                </div>
                            ) : (
                                <p className="text-2xl" id="address">
                                    {member.address}
                                </p>
                            )}
                        </div>
                        <div className="w-full mt-2">
                            <div>
                                {isEditMode ? (
                                    <>
                                        <label className="text-gray-400" htmlFor="additionalData">
                                            Additional Data
                                        </label>
                                        <textarea
                                            onChange={(e) => handleChange(e)}
                                            name="additionalData"
                                            id="additionalData"
                                            value={member.additionalData}
                                            className="w-full bg-dark-2 rounded-xl min-h-[5rem]"
                                        ></textarea>
                                    </>
                                ) : (
                                    <>
                                        {member.additionalData && (
                                            <>
                                                <label
                                                    className="text-gray-400"
                                                    htmlFor="additionalData"
                                                >
                                                    Additional Data
                                                </label>
                                                <p className="text-xl">{member.additionalData}</p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                </article>
            )
            }
        </div >
    );
};
