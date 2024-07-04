import React, { useContext, useState } from 'react';
import { CgNotes } from "react-icons/cg";
import { PiFilePlusBold } from "react-icons/pi";
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Context from '../../../Context/Context';
const Requirenments=({requirenment, handelHighlightAuthor})=>{
    const {highlightAuthor}=useContext(Context)
    const nav=useNavigate();
    const location=useLocation();

    return(
        <div className={`w-full flex items-center gap-1.5 hover:bg-cyan-200 hover:text-black  ${(location.pathname===`/author-UAT-Test/${requirenment.id}` || location.pathname===`/author-UAT-Test/${requirenment.id}/CreateTestCase`) && 'bg-cyan-200 hover:bg-cyan-200'}`} >
        <CgNotes className=" text-sm sm:text-base lg:text-base text-blue-500" />
        <div className="w-full flex justify-between items-center gap-1 lg:gap-2 truncate cursor-pointer">
            <span className="text-xs sm:text-sm lg:text-sm truncate" onClick={()=>{location.pathname!==`/author-UAT-Test/${requirenment.id}/CreateTestCase` && handelHighlightAuthor(requirenment.id)}}>{requirenment.name}</span>
            {
                (location.pathname===`/author-UAT-Test/${requirenment.id}` || location.pathname===`/author-UAT-Test/${requirenment.id}/CreateTestCase`) &&
                <div onClick={()=> nav(`/author-UAT-Test/${highlightAuthor}/CreateTestCase`)}>
                <PiFilePlusBold className=" text-sm sm:text-base lg:text-base text-yellow-500 font-semibold  hover:bg-cyan-200 "/>
                </div>
            }
        </div>
    </div>
    )
}
export default Requirenments;