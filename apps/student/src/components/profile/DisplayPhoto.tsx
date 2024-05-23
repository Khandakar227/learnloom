"use client"
import { AiFillCamera } from 'react-icons/ai'
import { ChangeEvent, useRef } from 'react';

export const getDPName = (username: string) => {
    if (!username?.length) return "";
    const name = username.split(" ");
    const profileName = name[0][0].toUpperCase() + (name[1] ? name[1][0].toUpperCase() : "");
    return profileName;
}

type Props = {
    displayPhoto: string;
    name: string;
}

function DisplayPhoto(props:Props) {
    const imageRef = useRef({} as HTMLInputElement);

    const handleClick = () => {
        imageRef.current.click();
    }
    const handlePhotoUpload = (e: ChangeEvent) => {

    }

    return (
        <>
            <h3 className="py-2 text-xs">Profile picture</h3>
            <div onClick={handleClick} className="bg-white p-3 text-center rounded-full w-max shadow relative select-none cursor-pointer">
                {
                    !props.displayPhoto ?
                        <span className="grid justify-center items-center bg-green-400 text-9xl font-semibold p-8 rounded-full aspect-square">
                            {getDPName(props.name)}
                        </span>
                        :
                        <img src={props.displayPhoto} alt={props.name} className='rounded-full w-full'/>
                }
                <span className='absolute bottom-[10%] left-[8%] text-green-950'>
                    <AiFillCamera size={50} />
                </span>
            </div>
            <input onChange={handlePhotoUpload} className='hidden' type="file" name="photo" accept="image/*" ref={imageRef} />
        </>
    )
}

export default DisplayPhoto