import React, { useContext, useEffect, useState } from 'react';
import TestCasesRow from './TestCasesRow';
import Context from '../../../../Context/Context';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../utils';
const CreateTestCaseTable=()=>{
    const {highlightAuthor,isTureTestCaseName, setIsTrueTestCaseName ,isTureDescription, setIsTrueDescription ,isTurePreCondition, setIsTruePreCondition, countTestCaseSave, setCountTestCaseSave}=useContext(Context)
    const nav=useNavigate()
    const [testCaseData, setTestCaseData] = useState(
        [{name:'', parent_id:JSON.parse(Cookies.get('featureName')).id, properties:[{field_id:'13127522', field_value:''}, {field_id:'13127511', field_value:''}, {field_id: '13127524', field_value:''}, {field_id: '13127523', field_value:''}]}]
    )
    const [assignToOption, setAssignToOption]=useState([])
    const [priorityOption, setPriorityOption]=useState([])
    const handelFetchRequirenmentInfo=async(requirenmentId)=>{
        console.log('126............=>',requirenmentId)
        try{
            const requirenmentResponse=await axiosInstance.get(`/requirement/project/130015/requirement/${requirenmentId}`)
            console.log(requirenmentResponse.data)
        }catch(err){
            console.log(err)
        }
        // finally{
        //     setIsProcessing(false)
        // }
    }
    const handelAssignTo = async () => {
        try {
            const assignToResponse = await axiosInstance.get(`/project/130015/settings/test-cases/fields/13127511/allowed-values`)
            setAssignToOption(assignToResponse.data)
            console.log(assignToResponse.data)
            

        } catch (err) {
            console.log(err)
        }
    }
    const handelPriority = async () => {
        try {
            const priorityResponse = await axiosInstance.get(`/project/130015/settings/test-cases/fields/13127524/allowed-values`)
            setPriorityOption(priorityResponse.data)
            console.log(priorityResponse.data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(()=>{
        handelFetchRequirenmentInfo(highlightAuthor)
    },[highlightAuthor])
    useEffect(()=>{
        handelPriority()
        handelAssignTo()
    },[])
    const handelAddNewTestCases=()=>{
        setTestCaseData([...testCaseData,
            {name:'', parent_id:JSON.parse(Cookies.get('featureName')).id, properties:[{field_id:'13127522', field_value:''}, {field_id:'13127511', field_value:''}, {field_id: '13127524', field_value:''}, {field_id: '13127523', field_value:''}]}
        ])
    }
    useEffect(()=>{
        console.log(testCaseData)
    },[testCaseData])
    const handelSaveTestCases=async()=>{
        try{
            const filterTestCases = testCaseData.map(obj => {
                obj.properties = obj.properties.filter(property => {
                  if (property.field_id === '13127522' || property.field_id === '13127523') {
                    return true;
                  }
                  return property.field_value !== '';
                });
                return obj;
              });
             await Promise.all(
                filterTestCases.map( async(testCase)=> {
                    const testCaseResponse= await axiosInstance.post(`/project/130015/addTestCase`, testCase)
                    console.log(testCaseResponse.data)
                     await axiosInstance.post(`/project/130015/requirements/${highlightAuthor}/test-cases/link`,[testCaseResponse.data.id])
                }),
              )
              setCountTestCaseSave(countTestCaseSave+1)
              nav(`/author-UAT-Test/${highlightAuthor}`)
        }catch(err){
            console.log(err)
        }
    }
    const handelExpandRowCellOff=()=>{
        setIsTrueTestCaseName('')
        setIsTrueDescription('')
        setIsTruePreCondition('')
    }
    const handelTestCaseTrue=(index)=>{
        setIsTrueTestCaseName(index)
        setIsTrueDescription('')
        setIsTruePreCondition('')
        console.log(index)
    }
    const handelDesCriptionTrue=(index)=>{
        setIsTrueTestCaseName('')
        setIsTrueDescription(index)
        setIsTruePreCondition('')
    }
    const handelPreConditionTrue=(index)=>{
        setIsTrueTestCaseName('')
        setIsTrueDescription('')
        setIsTruePreCondition(index)
    }
    const handelDeleteTestCase=(index)=>{
        const testCase=[...testCaseData]
        testCase.splice(index, 1)
        setTestCaseData([])
        setTimeout(()=>{
            setTestCaseData(testCase)
        },1)
    }
    return(
        <>
        <div className='flex justify-between items-center mx-8' onClick={handelExpandRowCellOff}>
                                            <span className="font-semibold text-xs md:text-sm">Create test Cases</span>
                                            <button type="button" className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-4 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm" onClick={handelAddNewTestCases}>AddRow</button>
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className='flex gap-1 mt-2 mx-8 py-3' style={{ backgroundColor: '#EFFFE8' }} onClick={handelExpandRowCellOff}>
                                                <div className='flex justify-center gap-0.5 items-center w-3/5'>
                                                    <div className='flex justify-center items-center w-1/2'>
                                                        <span className='text-sm font-semibold whitespace-nowrap'>Name</span>
                                                    </div>
                                                    <div className='flex justify-center items-center w-1/2'>
                                                        <span className='text-sm font-semibold whitespace-nowrap'>Descriptions</span>
                                                    </div>
                                                </div>
                                                <div className='flex justify-center gap-0.5 items-center w-2/5'>
                                                    <div className='flex justify-center items-center w-1/4'>
                                                        <span className='text-sm font-semibold whitespace-nowrap'>Assign To</span>
                                                    </div>
                                                    <div className='flex justify-center items-center w-1/4'>
                                                        <span className='text-sm font-semibold whitespace-nowrap'>Priority</span>
                                                    </div>
                                                    <div className='flex justify-center items-center w-1/4'>
                                                        <span className='text-sm font-semibold whitespace-nowrap'>Precondition</span>
                                                    </div>
                                                    <div className=' w-1/4'></div>
                                                </div>
                                            </div>
                                            <div className='flex flex-col h-sreen mx-8 h-32 scrollbar-hide overflow-auto'>
                                                {
                                                    testCaseData.map((element, i) => (
                                                        <TestCasesRow 
                                                         tabelElement={element}
                                                          priorityOption={priorityOption}
                                                           assignToOption={assignToOption}
                                                           index={i}
                                                           isTureTestCaseName={isTureTestCaseName}
                                                           isTureDescription={isTureDescription}
                                                           isTurePreCondition={isTurePreCondition}
                                                           handelTestCaseTrue={(index)=>handelTestCaseTrue(index)}
                                                           handelDesCriptionTrue={(index)=>handelDesCriptionTrue(index)}
                                                           handelPreConditionTrue={(index)=>handelPreConditionTrue(index)}
                                                           handelDeleteTestCase={(index)=>handelDeleteTestCase(index)}
                                                            handelCreateTabelData={(testCaseName, moduleId, properties)=>{
                                                                const newData = [...testCaseData];
                                                                newData[i] = { name:testCaseName, parent_id:moduleId, properties:properties }
                                                                setTestCaseData(newData)
                                                                console.log('100==>','test')
                                                        }}
                                                        />
                                                    ))
                                                }
                                            </div>
                                            <div className="flex gap-2 justify-end mt-2 mb-4 mr-12" onClick={handelExpandRowCellOff}>
                                                <button type="button" className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-4 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm">DISCARD</button>
                                                <button type="button" className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-4 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm " onClick={handelSaveTestCases}>SAVE</button>
                                            </div>
                                        </div>
        </>
    )
}
export default CreateTestCaseTable;