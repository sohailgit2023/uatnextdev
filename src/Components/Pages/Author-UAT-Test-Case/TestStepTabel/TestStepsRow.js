import React, {useContext, useEffect, useState} from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import Context from '../../../../Context/Context';
const TestStepsRow=({index, testSteps, handelCreateDataTabel, handelDeleteTestStep, handelTestCaseTrue, handelDesCriptionTrue, UATCategoryOption})=>{
   const {isTureTestStepName, isTureDescription}=useContext(Context)
   const [description, setDescription]=useState(testSteps.description)
   const [expectedResult, setExpectedResult]=useState(testSteps.expected)
   const [UATCategoryValue, setUATCategoryValue]=useState({value:'710173', label:''})
   useEffect(()=>{
    handelCreateDataTabel(description, expectedResult, UATCategoryValue.value, testSteps.order)
   },[description, expectedResult, UATCategoryValue.value])
    return(
        <div className='flex flex-col'>
                                                <div className='flex justify-center items-center gap-0.5 hover:bg-gray-100 w-full'>
                                                <select className='w-1/6 ml-2 px-0.5 py-0.5 text-sm hover:bg-gray-100 border border-white hover:border hover:border-gray-600' onChange={(e)=>setUATCategoryValue({value:e.target.value, label:e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text})}>
                                                <option value={UATCategoryValue.value} selected disabled hidden>Select</option>
                                                       {
                                                        UATCategoryOption
                                                        .filter((e) => e.is_active == true)
                                                        .map((e)=><option value={e.value}>{e.label}</option>)
                                                       }
                                                       </select>
                                                        {
                                                            isTureTestStepName===index ?
                                                                <textarea rows={2} className='text-sm border border-gray-600 outline-none w-2/6 m-1 px-3 py-1.5' value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
                                                                : 
                                                                <div className='text-sm flex justify-center items-center border border-gray-100 hover:border hover:border-gray-600 w-2/6 py-3 mx-1 my-2 overflow-y-auto scrollbar-hide'  onClick={()=>handelTestCaseTrue(index)}>{description}</div>
                                                        }
                                                        {
                                                            isTureDescription===index ? 
                                                            <textarea rows={2} className='text-sm border border-gray-600 outline-none w-2/6 m-1 px-3 py-1.5' value={expectedResult} onChange={(e)=>setExpectedResult(e.target.value)}></textarea>
                                                             : 
                                                             <div className='text-sm flex justify-center items-center border border-gray-100 hover:border hover:border-gray-600 w-2/6 mx-1 p-3 my-2 overflow-y-auto scrollbar-hide'  onClick={()=>handelDesCriptionTrue(index)}>{expectedResult}</div>
                                                        }
                                                    <div className='flex justify-center items-center w-1/6'>
                                                            <RiDeleteBin6Line className='text-xl text-red-500 cursor-pointer' title='Delete' onClick={()=>handelDeleteTestStep(index)}/>
                                                        </div>
                                                </div>
                                                <div className='border border-gray-200 w-full'></div>
                                            </div>
    )
}
export default TestStepsRow;