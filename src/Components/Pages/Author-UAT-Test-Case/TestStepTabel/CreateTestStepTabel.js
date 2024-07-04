import React, { useContext, useState } from 'react';
import TestCasesRow from './TestStepsRow';
import Context from '../../../../Context/Context';
import axiosInstance from '../../../../utils';
const CreateTestStepTable = ({testCaseId, testSteps ,UATCategoryOption, handelShowCreateTabelTestStep}) => {
    console.log(testCaseId)
    console.log(testSteps)
    var order=testSteps.length+1
    const { setIsTrueTestStepName, setIsTrueDescription,}=useContext(Context);
    const [testStepsData, setTestStepsData] = useState(
        [{description:'', expected:' ', order:testSteps.length+1, customFieldInfo:[{id:13710034, value:''}]}]
    )
    const handelAddNewRow = () => {
        order=order+1
        setTestStepsData([...testStepsData,
        {description:'', expected:'', order:order, customFieldInfo:[{id:13710034, value:''}]}
        ])
    }
    const handelDeleteTestStep=(index)=>{
        const testStep=[...testStepsData]
        testStep.splice(index,1)
        setTestStepsData([])
        setTimeout(()=>{
            setTestStepsData(testStep)
        },1)
    }
    const handelSaveTestStep=async()=>{
        console.log([...testSteps, ...testStepsData])
        try{
            console.log(testStepsData)
            console.log([...testSteps, ...testStepsData])
           await axiosInstance.put(`/updateTestCase/project/130015/test-cases/${testCaseId}`, {test_steps:[...testSteps, ...testStepsData]})
           handelShowCreateTabelTestStep()
        }catch(err){
            console.log(err)
        }
    }
    const handelExpandRowCellOff=()=>{
        setIsTrueTestStepName('')
        setIsTrueDescription('')
    }
    const handelTestStepTrue=(index)=>{
        setIsTrueTestStepName(index)
        setIsTrueDescription('')
    }
    const handelDesCriptionTrue=(index)=>{
        setIsTrueTestStepName('')
        setIsTrueDescription(index)
    }
    console.log(testStepsData)
    
    return (
        <>
            <div className='flex justify-between items-center' onClick={handelExpandRowCellOff}>
                <div className='w-full flex justify-between items-center ml-2 mr-4'>
                    <div className="flex flex-col hidden sm:block">
                        <span className="text-xs lg:text-base font-semibold lg:font-semibold">New test Step</span>
                        <div className="h-0.5 lg:h-1 w-full bg-yellow-500"></div>
                    </div>
                    <button type="button" className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-0 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm  sm:me-1 lg:me-2 rounded-full whitespace-nowrap" onClick={handelAddNewRow}>Add Row</button>
                </div>
            </div>
            <div className='flex flex-col'>
                <div className='flex justify-center gap-0.5 items-center w-full mt-2 py-3' style={{ backgroundColor: '#EFFFE8' }}>
                        <div className='flex justify-center items-center w-1/6 ml-0.5'>
                            <span className='text-sm font-semibold whitespace-nowrap'>UAT Category</span>
                        </div>
                        <div className='flex justify-center items-center w-2/6'>
                            <span className='text-sm font-semibold whitespace-nowrap'>Step Description</span>
                        </div>
                        <div className='flex justify-center items-center w-2/6'>
                            <span className='text-sm font-semibold whitespace-nowrap'>Expected Result</span>
                        </div>
                        <div className='flex justify-center items-center w-1/6'>
                            <span className='text-sm font-semibold whitespace-nowrap'>Name</span>
                        </div>
                </div>
                <div className='flex flex-col h-sreen h-32 scrollbar-hide overflow-auto'>
                    {
                        testStepsData.map((testStepElement, i) => (
                            <TestCasesRow
                            index={i}
                            testSteps={testStepElement}
                            UATCategoryOption={UATCategoryOption}
                            handelTestCaseTrue={(index)=>handelTestStepTrue(index)}
                            handelDesCriptionTrue={(index)=>handelDesCriptionTrue(index)}
                            handelDeleteTestStep={(index)=>handelDeleteTestStep(index)}
                            handelCreateDataTabel={(description, expectedResult, UATCategoryValue, order)=>{
                                const newData = [...testStepsData];
                                                                newData[i] = { description:description, expected:expectedResult, order:order, customFieldInfo:[{id:13710034, value:`${UATCategoryValue}`}] }
                                                                setTestStepsData(newData)
                            }}
                             />
                        ))
                    }
                </div>
                <div className="flex gap-2 justify-end mt-2 mb-4 mr-4" onClick={handelExpandRowCellOff}>
                    <button type="button" className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-0 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm  sm:me-1 lg:me-2 rounded-full whitespace-nowrap ">DISCARD</button>
                    <button type="button" className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-0 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm  sm:me-1 lg:me-2 rounded-full whitespace-nowrap " onClick={handelSaveTestStep}>SAVE</button>
                </div>
            </div>
        </>
    )
}
export default CreateTestStepTable;