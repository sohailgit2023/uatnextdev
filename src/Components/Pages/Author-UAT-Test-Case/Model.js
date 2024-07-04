import React, { useEffect, useRef, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { FaLink } from "react-icons/fa6";
import axiosInstance from '../../../utils';
const Model=({calltestCaseId, onClose})=>{
    const modelRef = useRef();
    const [testCasePid, setTestCasePid]=useState('')
    const [testCaseId, setTestCaseId]=useState('')
    const [testCaseName, setTestCaseName]=useState('')
    const [errorMessage, setErrorMessage]=useState('')
    const onCloseModel = (e) => {
        if (modelRef.current === e.target) {
            onClose()
        }
    }
    const handelSearchTestCase=async()=>{
        try{
            const testCaseResponse=await axiosInstance.post(`/searchTestCase/project/130015/search`, {testCaseId:testCasePid})
            console.log(testCaseResponse.data)
            if(testCaseResponse.data.items.length!=0){
                setTestCaseId(testCaseResponse.data.items[0].id)
            setTestCaseName(testCaseResponse.data.items[0].name)
            }else{
                setErrorMessage('Enter test case')
            }
        }catch(err){
            console.log(err)
            setErrorMessage(err.response.data)
        }
    }
    const handelSave=async()=>{
         try{
            await axiosInstance.put(`/testCase/project/130015/test-case/${testCaseId}/approve`)
            calltestCaseId(testCaseId);
            onClose()
         }catch(err){
            console.log(err)
         }
    }
    return(
        <div ref={modelRef} className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center' onClick={onCloseModel}>
            <div className='flex flex-col gap-3 bg-white text-black rounded-lg px-4 py-2 w-1/3'>
                <div className='flex gap-5 justify-between items-center'>
                    <span className='text-lg font-semibold whitespace-nowrap text-slate-600'>Test Case</span>
                    <div className='flex justify-center items-center h-5 w-5 rounded-full bg-gray-200 hover:bg-gray-100 cursor-pointer' title='Cancel' onClick={onClose}>
                        <RxCross2 className='text-xs' />
                    </div>
                </div>
                {/* {children} */}
                <div className='flex gap-4'>
                    <div className='flex gap-1 flex-col'>
                    <input className="border text-xs lg:text-sm px-1 py-2.5 lg:py-1 rounded-md border  border-gray-300 outline-none ring-0 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50 text-slate-600  sm:w-11/12 lg:w-full" placeholder='Enter Test Case Id' value={testCasePid} onChange={(e)=>{setTestCasePid(e.target.value); setErrorMessage('')}}/>
                    <label className={` text-xs text-red-500 font-semibold h-0.5`}>{errorMessage}</label>
                    </div>
                    <div>
                    <button type="button" class="px-2 py-1 text-white rounded bg-cyan-500 focus:ring-1 focus:ring-blue-300 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:focus:ring-green-800 font-normal lg:font-sm text-sm lg:text-sm whitespace-nowrap" onClick={handelSearchTestCase}>Search</button>
                    </div>
                </div>
                <div className={`flex justify-start gap-1 h-16 ${testCaseName=='' ? 'invisible' : 'visible'}`}>
                <FaLink className='text-blue-500 test-sm mt-1' />
                    <span className='text-sm'>{testCaseName}</span>
                    </div>
                <div className="flex gap-2 justify-end">
                                            <button type="button" className="px-2 py-1 text-white rounded bg-cyan-500 focus:ring-1 focus:ring-blue-300 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:focus:ring-green-800 font-normal lg:font-sm text-sm lg:text-sm whitespace-nowrap" onClick={handelSave}>SAVE</button>
                                        </div>
            </div>
        </div>
    )
}
export default Model;