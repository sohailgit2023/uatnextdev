import React, { useContext, useEffect, useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
const TestCasesRow=({tabelElement, priorityOption, assignToOption, index, isTureTestCaseName, isTureDescription, isTurePreCondition, handelDeleteTestCase, handelTestCaseTrue, handelDesCriptionTrue, handelPreConditionTrue, handelCreateTabelData})=>{
    const [testCaseName, setTestCasename]=useState(tabelElement.name)
    const [moduleId, setModuleId]=useState(tabelElement.parent_id)
    const [properties, setProperties]=useState(tabelElement.properties)
    const handelDescription=(e)=>{
        setProperties([{field_id:'13127522', field_value:e.target.value}, tabelElement.properties[1], tabelElement.properties[2], tabelElement.properties[3]])
    }
    const handelAssignTo=(e)=>{
        setProperties([tabelElement.properties[0], {field_id:'13127511', field_value:`[${e.target.value}]`}, tabelElement.properties[2], tabelElement.properties[3]])
    }
    const handelPriority=(e)=>{
        setProperties([tabelElement.properties[0], tabelElement.properties[1], {field_id: '13127524', field_value:e.target.value}, tabelElement.properties[3]])
    }
    const handelPreCondition=(e)=>{
        setProperties([tabelElement.properties[0], tabelElement.properties[1], tabelElement.properties[2], {field_id: '13127523', field_value:e.target.value}])
    }
    useEffect(()=>{
        handelCreateTabelData(testCaseName, moduleId, properties)
    },[testCaseName, moduleId, properties])
    console.log(isTureTestCaseName)
    console.log(isTureDescription)
    console.log(isTurePreCondition)
    console.log(index)
    return(
        <div className='flex flex-col'>
                                                <div className='flex gap-1 hover:bg-gray-100'>
                                                    <div className={`flex justify-center items-center gap-0.5 w-3/5 `}>
                                                        {
                                                            isTureTestCaseName===index ?
                                                                <textarea rows={2} className='text-sm border border-gray-600 outline-none w-1/2 m-1 px-3 py-1.5' value={testCaseName} onChange={(e)=>setTestCasename(e.target.value)}></textarea>
                                                                : <div className='text-sm flex justify-center items-center border border-gray-100 hover:border hover:border-gray-600 w-1/2 py-3 mx-1 my-2 overflow-y-auto scrollbar-hide' onClick={()=>handelTestCaseTrue(index)}>{testCaseName}</div>
                                                        }
                                                        {
                                                            isTureDescription===index ? 
                                                            <textarea rows={2} className='text-sm border border-gray-600 outline-none w-1/2 m-1 px-3 py-1.5' value={properties[0].field_value}  onChange={handelDescription}></textarea>
                                                             : <div className='text-sm flex justify-center items-center border border-gray-100 hover:border hover:border-gray-600 w-1/2 mx-1 p-3 my-2 overflow-y-auto scrollbar-hide' onClick={()=>handelDesCriptionTrue(index)}>{properties[0].field_value}</div>
                                                        }
                                                    </div>
                                                    <div className={`flex justify-center gap-0.5 items-center w-2/5`}>
                                                        <select className='w-1/4 px-0.5 py-0.5 text-sm hover:bg-gray-100 hover:border hover:border-gray-600' onChange={handelAssignTo}>
                                                        <option value='' selected disabled hidden >{properties[1].field_value == '' ? 'Select..' : properties[1].field_value}</option>
                                                        {
                                                            assignToOption.filter((e) => e.is_active == true)
                                                            .map((e) => (<option value={e.value}>{e.label}</option>))
                                                        }
                                                        </select>
                                                        <select className='w-1/4 px-0.5 py-0.5 text-sm hover:bg-gray-100 border border-white hover:border hover:border-gray-600' onChange={handelPriority}>
                                                        <option value='' selected disabled hidden >{properties[2].field_value == '' ? 'Select..' : properties[2].field_value}</option>
                                                        {
                                                            priorityOption.filter((e) => e.is_active == true)
                                                            .map((e) => (<option value={e.value}>{e.label}</option>))
                                                        }
                                                        </select>
                                                        {
                                                            isTurePreCondition===index ?
                                                            <textarea rows={2} className='test-sm border border-gray-600 outline-none w-1/4 m-1' value={properties[3].field_value} onChange={handelPreCondition}></textarea>
                                                              : <div className='test-sm flex justify-center items-center hover:border hover:border-gray-600 w-1/4 py-3 my-2 overflow-y-auto scrollbar-hide' onClick={()=>handelPreConditionTrue(index)}>{properties[3].field_value}</div>
                                                        }
                                                        <div className='flex justify-center items-center w-1/4'>
                                                            <RiDeleteBin6Line className='text-xl text-red-500 cursor-pointer' title='Delete' onClick={()=>handelDeleteTestCase(index)}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='border border-gray-200 w-full'></div>
                                            </div>
    )
}
export default TestCasesRow;