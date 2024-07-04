import React, { useContext, useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { SiMoleculer } from "react-icons/si";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa6";
import { IoReorderThreeOutline } from "react-icons/io5";
import Context from '../../../Context/Context';
import DataTable from "react-data-table-component";
import axiosInstance from '../../../utils';
import Cookies from "js-cookie";
import CreateTestStepTable from './TestStepTabel/CreateTestStepTabel';
import Model from './Model';
import { useNavigate } from 'react-router-dom';
const TestCaseDetails = () => {
    const { sidebar, highlight, highlightAuthor, setIsTrueTestStepName, setIsTrueDescription ,testCaseId, setTestCaseId} = useContext(Context);
    const nav = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [priorityOption, setPriorityOption] = useState([])
    const [PriorityValue, setPriorityValue] = useState('')
    const [assignToOption, setAssignToOption] = useState([])
    const [assignToValue, setAssignToValue] = useState('')
    const [statusOption, setStatusOption] = useState([])
    const [statusValue, setStatusValue] = useState('')
    const [typeOption, setTypeOption] = useState([])
    const [typeValue, setTypeValue] = useState('')
    const [description, setDescription] = useState('')
    const [prediction, setPrediction] = useState('')
    const [testSteps, setTestSteps] = useState([])
    const [filterTestStep, setFilterTestStep] = useState([])
    const [UATCategory, setUATCategory] = useState([])
    const [UATCategoryOption, setUATCategoryOption] = useState([])
    const [showCreateTabelTestStep, setShowCreateTabelTestStep] = useState(false)
    const [openModel, setOpenModel] = useState(false)
    const [testStepCellExpand, setTestStepCellExpand] = useState({})
    const [expectedResultCellExpand, setExpectedResultCellExpand] = useState({})
    const [menu, setMenu]=useState({index:'', isTrue:false})
    const fetchDataFromEndPoint = [
        { endpoint: '/project/130015/settings/test-cases/fields/13127511/allowed-values', setOptions: setAssignToOption },
        { endpoint: '/project/130015/settings/test-cases/fields/13127524/allowed-values', setOptions: setPriorityOption },
        { endpoint: '/project/130015/settings/test-cases/fields/13127519/allowed-values', setOptions: setStatusOption },
        { endpoint: '/project/130015/settings/test-cases/fields/13127520/allowed-values', setOptions: setTypeOption }
    ]
    const columns = [
        {
            name: 'Step No',
            sortable: true,
            cell: ((row, index) => {
                return <span>{index + 1}</span>
            }),
             width: "100px",
            maxWidth: "auto"
        },
        {
            name: 'UAT Category',
            sortable: true,
            cell: (row) => {
                return <select className="text-xs lg:text-sm w-full rounded hover:border hover:border-cyan-300 py-1.5 px-0.5" onClick={()=>{setExpectedResultCellExpand({ stepNo: '' }); setTestStepCellExpand({ stepNo: '' }); setMenu({index:'', isTrue:false})}} onChange={(event)=>{
                    const value=event.target.value
                    row.customFieldInfo.filter((e)=>e.name=='UAT Category')
                    .map((e,i)=>e.value=value)
                }}>
                {
                  row.customFieldInfo.filter((e)=>e.name=='UAT Category')
                .map((e)=><option selected disabled hidden value={''}>{UATCategory[`${e.value}`] == 'Null' ? '' : UATCategory[`${e.value}`]}</option> )
                }
                {
                    UATCategoryOption.filter((e)=>e.is_active==true)
                    .map((e)=><option value={e.value}>{e.label}</option>)
                }
            </select>
            },
             width: "150px",
            maxWidth: "auto"
        },
        {
            name: 'Step Description',
            selector: row => row.description,
            sortable: true,
            cell: (row, index) => {
                return <div className="w-full" onClick={() => {row.called_test_case==undefined && setTestStepCellExpand({ stepNo: index + 1 }); row.called_test_case==undefined && setExpectedResultCellExpand({ stepNo: '' }); setMenu({index:'', isTrue:false})}}>
                    <div className={`flex gap-2 h-auto w-full rounded ${row.called_test_case==undefined && 'hover:border hover:border-cyan-300 '} py-2 px-0.5 ${index + 1 == testStepCellExpand.stepNo && 'hidden'}`}>
                        <div>{row.called_test_case != undefined && <SiMoleculer className="text-green-900" />}</div>
                        <div className={`truncate text-xs ${row.called_test_case!=undefined && 'text-blue-500 hover:underline'}`} onClick={()=>row.called_test_case!=undefined && nav(`/testCaseDetails/${row.called_test_case.id}`)}>{row.description.replace(/<[^>]*>/g, '')}</div>
                    </div>
                    {
                        index + 1 == testStepCellExpand.stepNo &&
                        <div className="flex justify-center items-center flex-row-reverse gap-2 my-1" >
                            <textarea
                                rows={3}
                                readOnly={row.called_test_case!=undefined ? true : false}
                                class={`block p-2 w-full resize-y text-xs text-gray-900 bg-gray-50 rounded border border-gray-300 ${row.icon == '' && 'focus:ring-blue-500 focus:border-blue-500'} focus:outline-none dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 whitespace-nowrap`}
                                placeholder="Write your thoughts here..."
                                onChange={(e)=>row.description=e.target.value}
                               >
                                {row.description.replace(/<[^>]*>/g, '')}
                            </textarea>
                            {row.called_test_case != undefined && <SiMoleculer className="text-green-900" />}
                        </div>
                    }
                </div>
            },
             width: "460px",
            maxWidth: "auto"
        },
        {
            name: 'Expected Result',
            selector: row => row.expected,
            sortable: true,
            cell: (row, index) => {
                return <div className="w-full" onClick={() => { setExpectedResultCellExpand({ stepNo: index + 1 }); setTestStepCellExpand({ stepNo: '' }); setMenu({index:'', isTrue:false})}}>
                <div className={`flex gap-2 h-auto w-full rounded hover:border hover:border-cyan-300 py-2 px-0.5 ${index + 1 == expectedResultCellExpand.stepNo && 'hidden'}`}>
                    <div className="truncate text-xs">{row.expected.replace(/<[^>]*>/g, '')}</div>
                </div>
                {
                    index + 1 == expectedResultCellExpand.stepNo &&
                    <div className="flex justify-center items-center flex-row-reverse gap-2 my-1" >
                        <textarea
                            rows={3}
                            class={`block p-2 w-full resize-y text-xs text-gray-900 bg-gray-50 rounded border border-gray-300 ${row.icon == '' && 'focus:ring-blue-500 focus:border-blue-500'} focus:outline-none dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 whitespace-nowrap`}
                            placeholder="Write your thoughts here..."
                            onChange={(e)=>row.expected=e.target.value}
                           >
                           {row.expected.replace(/<[^>]*>/g, '')}
                        </textarea>
                    </div>
                }
            </div>
            },
             width: "460px",
            maxWidth: "auto"
        },
        {
            name: 'Action',
            style:{
                height:'40px',
                zIndex:10
            },
            cell: (row, index) => (
                <>
                    <div className='flex justify-center items-center p-0.5 bg-green-700 hover:bg-green-500 rounded overflow-visible'>
                    <IoReorderThreeOutline className='text-xl font-semibold text-white cursor-pointer' onClick={()=>{setMenu({index:index+1, isTrue:menu.index!==index+1 ? true : !(menu.isTrue)}); setExpectedResultCellExpand({ stepNo: '' }); setTestStepCellExpand({ stepNo: '' })}}/>
                    </div>
                    {
                        (menu.index==index+1 && menu.isTrue==true) && 
                        <div className={`flex flex-col rounded border border-slate-300 ml-1 -translate-x-40 -translate-y-10`}>
                            <div className='flex items-center gap-3 hover:bg-gray-100 pl-3 pr-6 py-3' onClick={()=>index!=0 && handelMoveUp(index)}>
                            <FaArrowUp className='text-xs bg-yellow-500 rounded-full text-white p-0.5' />
                            <span>Move Up</span>
                            </div>
                            <div className='flex items-center gap-3 hover:bg-gray-100 pl-3 pr-6 py-3' onClick={()=>index!=testSteps.length-1 && handelMoveDown(index)}>
                            <FaArrowDown className='text-xs bg-yellow-500 rounded-full text-white p-0.5' />
                            <span className=''>Move Down</span>
                            </div>
                            <div className='flex items-center gap-3 hover:bg-gray-100 pl-3 pr-6 py-3' onClick={() => handelUnlinkTestStep(row, index)} >
                            <RxCross2 className='text-xs bg-red-500 rounded-full text-white p-0.5' />
                            <span>Delete</span>
                            </div>
                        </div>
                    }
                    {/* <RiDeleteBin6Line className='text-xl text-red-500 cursor-pointer' title='Delete' onClick={() => handelUnlinkTestStep(row, index)} /> */}
                </>
            ),
             width: "90px",
            maxWidth: "auto"
        },
    ]
    const customStyle = {
        headRow: {
            style: {
                //minHeight: '45px',
                backgroundColor: '#EFFFE8',
                color: "black",
                // maxWidth: "500px"
            }
        },
        headCells: {
            style: {
                fontSize: '12px',
                fontWeight: '600',
                TextTransform: 'uppercase',
                margin: "0px",
                //maxWidth: "500px"
            }
        },
        cells: {
            style: {
                fontSize: '12px',
                //padding: '8px',
            }
        },
        rows: {
            style: {
                zIndex: 2,
                minHeight: '40px !important', // override the row height
                fontSize: '14px',
                whiteSpace: 'pre',
                padding: '0px',
                //maxWidth: "500px"
            },
        },
        subHeader: {
            style: {
                minHeight: '40px',
            },
        },

    }
    console.log(menu)
    const handelMoveUp=(index)=>{
        const testStep=[...testSteps]
        testStep[index-1].order=index+1
        const previusData=testStep[index-1]              //index=2 order=3
       testStep[index].order=index
        testStep[index-1]=testStep[index]
        testStep[index]=previusData
       // setTestSteps([])
        setTimeout(()=>{
            setTestSteps(testStep)
        },1)
        setMenu({index:'', isTrue:false})
    }
    const handelMoveDown=(index)=>{
        console.log(index)
        const testStep=[...testSteps]
        testStep[index+1].order=index+1
        const nextData=testStep[index+1]
        testStep[index].order=index+2
        testStep[index+1]=testStep[index]
        testStep[index]=nextData
        //setTestSteps([])
        setTimeout(()=>{
            setTestSteps(testStep)
        },1)
        setMenu({index:'', isTrue:false})
    }
    const handelCellExpandClose = () => {
        setTestStepCellExpand({ stepNo: '' })
        setExpectedResultCellExpand({ stepNo: '' })
    }
    const handelFetchDataFromEndPoint = (fetchDataFromEndPoint) => {
        fetchDataFromEndPoint.map((endPointElement) => handelFetchOptions(endPointElement.endpoint, endPointElement.setOptions))
    }
    const handelFetchOptions = async (endPoint, setOption) => {
        console.log(endPoint)
        try {
            const optionResponse = await axiosInstance.get(`${endPoint}`)
            setOption(optionResponse.data)
        } catch (err) {
            console.log(err)
        }
    }
    const handelFetchTestStep = async () => {
        try {
            setIsProcessing(true)
            const testStepResponse = await axiosInstance.get(`/testCase/project/130015/test-cases/${testCaseId}`)
            console.log(testStepResponse.data)
            let testCaseDetails = {}
            await  testStepResponse.data.testCase.properties.filter((e) => e.field_name == 'Priority' || e.field_name == 'Status' || e.field_name == 'Description' || e.field_name == 'Assigned To' || e.field_name == 'Precondition' || e.field_name == 'Type')
                  .map((e) => {
                      testCaseDetails[`${e.field_name}`] = e.field_name == 'Description' || e.field_name == 'Precondition' ? e.field_value : { value: e.field_value, label: e.field_value_name }
                  })
              testCaseDetails.id = testStepResponse.data.testCase.id
              testCaseDetails.pid = testStepResponse.data.testCase.pid
              testCaseDetails.name = testStepResponse.data.testCase.name
              //Cookies.set('testCaseDetails', JSON.stringify(testCaseDetails))
              console.log(testCaseDetails['Assigned To'])
              if(testCaseDetails['Assigned To'].label!=''){
                setAssignToValue({value:testCaseDetails['Assigned To'].value, label:testCaseDetails['Assigned To'].label.replace(/[\[\]]/g,'')})
              }else{
                setAssignToValue(testCaseDetails['Assigned To'])
              }
              setStatusValue(testCaseDetails.Status)
              setPriorityValue(testCaseDetails.Priority)
              setTypeValue(testCaseDetails.Type)
              setDescription(testCaseDetails.Description)
              setPrediction(testCaseDetails.Precondition)
            if (testStepResponse.data.testSteps.length != 0) {
                await handelFetchUATCategory(testStepResponse.data.testSteps[0].customFieldInfo[1].id)
                setTestSteps(testStepResponse.data.testSteps)
                setFilterTestStep(testStepResponse.data.testSteps)
            } else {
                setTestSteps([])
                setFilterTestStep([])
            }
        } catch (err) {
            setErrorText(err.message);
            setIsError(true)
            console.log(err)
        }finally{
            setIsProcessing(false)
        }
    }
    const handelFetchUATCategory = async (UATCategoryId) => {
        console.log(UATCategoryId)
        try {
            const UAT_CategoryResponse = await axiosInstance.get(`/project/130015/settings/test-steps/fields/${UATCategoryId}/allowed-values`)
            console.log(UAT_CategoryResponse);
            setUATCategoryOption(UAT_CategoryResponse.data)
            const newObject = UAT_CategoryResponse.data.reduce((acc, item) => {
                acc[item.value] = item.label;
                return acc;
            }, {})
            console.log(newObject)
            setUATCategory(newObject)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        setIsProcessing(true)
        handelFetchDataFromEndPoint(fetchDataFromEndPoint)
        handelFetchTestStep()
    }, [])
    console.log('169==>', assignToValue.value)
    useEffect(() => {
        console.log('171==>', assignToValue)
    }, [assignToValue.value])
    const handelExpandRowCellOff = () => {
        setIsTrueTestStepName('')
        setIsTrueDescription('')
    }
    const handelFilterTechnicalTestStep = (event) => {
        console.log(event.target.value)
        const newData = testSteps.filter(row => !(row.customFieldInfo[1].value.toLowerCase()).includes(event.target.value.toLowerCase()));
        setTestSteps(newData)
    }
    const handelShowAllTestStep = () => {
        setTestSteps(filterTestStep)
    }
    const handelShowCreateTabelTestStep = async () => {
        setShowCreateTabelTestStep(false)
        handelFetchDataFromEndPoint(fetchDataFromEndPoint)
        handelFetchTestStep()

    }
    const handelCallingTestStep = async(calltestCaseId) => {
        console.log(calltestCaseId)
        try{
            const searchTestCaseResponse= await axiosInstance.get(`/testCase/project/130015/test-cases/${calltestCaseId}`)
            console.log(searchTestCaseResponse.data)
            setTestSteps([...testSteps,
                {
                    
                    customFieldInfo:[{
                        id: 13710034,
                        name:"UAT Category",
                        value:"710173"
                    }],
                    description:searchTestCaseResponse.data.testCase.name,
                    expected:'',
                    order:testSteps.length+1,
                    called_test_case:{
                        id:calltestCaseId,
                        approved: true
                    }                
                }
            ])
        }catch(err){
            console.log(err)
        }
    }
    console.log(highlightAuthor)
    const handelSave = async () => {
        const properties = [
            { field_id: '13127511', field_value: assignToValue.value },
            { field_id: '13127519', field_value: statusValue.value },
            { field_id: '13127524', field_value: PriorityValue.value },
            { field_id: '13127520', field_value: typeValue.value },
            { field_id: '13127522', field_value: description },
            { field_id: '13127523', field_value: prediction }]
            .filter(property => property && property.field_value !== '')
        console.log(properties)
        try {
            await axiosInstance.put(`/updateTestCase/project/130015/test-cases/${testCaseId}`,
                {
                    properties: properties,
                    test_steps: testSteps
                })
            nav(`/author-UAT-Test/${Cookies.get('requirementId')}`)
        } catch (err) {
            console.log(err)
        }
    }
    const handelUnlinkTestStep = (row, index) => {
        //setUnliknedId([...unlinkedId, row.id])

        const testStep = [...testSteps]
        testStep.splice(index, 1)
        setTestSteps([])
        setTimeout(() => {
            setTestSteps(testStep)
        }, 1)
        setMenu({index:'', isTrue:false})
    }
    console.log('272===>',testSteps)
    useEffect(()=>{
        console.log('274==>',testSteps)
    },[testSteps])
    return (
        <>
            {
                isProcessing ?
                    <div className='flex justify-center items-center h-svh w-full'>
                        <RotatingLines strokeColor="#00ABF0" strokeWidth="3" height="96" width="96" />
                    </div> :
                    <>
                        {
                            isError ? (
                                <div className='flex justify-center items-center w-full py-20 mt-20'>
                                    <h2 className='text-3xl text-slate-400 font-medium mt-20 py-20'>{errorText}</h2>
                                </div>
                            ) :
                                (
                                    <div className={`flex flex-col mt-10 h-auto ${sidebar.isSideMenuOpen === false && 'invisible'}`}>
                                        <div className={`flex flex-col mt-2 sm:mt-3 lg:mt-4 ml-3 sm:ml-8 lg:mx-6`} onClick={()=>{handelExpandRowCellOff(); handelCellExpandClose(); setMenu({index:'', isTrue:false})}}>
                                            <div className="flex items-center gap-2 lg:gap-14">
                                                <span className="text-xs lg:text-lg font-semibold sm:font-bold whitespace-nowrap">TC-12</span>
                                                <span className="text-xs lg:text-base font-normal sm:font-bold truncate">rakeh shaw</span>
                                            </div>
                                            <div className="flex justify-between w-full gap-8 mt-3">
                                                <div className='w-1/5 flex gap-10 justify-between items-center'>
                                                    <span className="text-xs lg:text-sm font-semibold">Project</span>
                                                    <span className="text-xs lg:text-xs font-normal">UAT NEXT DEV</span>
                                                </div>
                                                <div className='w-1/5 flex gap-10 justify-between items-center'>
                                                    <span className="text-xs lg:text-sm font-semibold whitespace-nowrap">Assign To</span>
                                                    <select className='w-full text-xs lg:text-sm border border-1 border-slate-400 rounded px-1 lg:px-2 lg:py-0.5' onChange={(e) => setAssignToValue({ value: `[${e.target.value}]`, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                                                        <option selected disabled hidden value={assignToValue.value}>{assignToValue.label == '' ? 'Select.' : assignToValue.label}</option>
                                                        {
                                                            assignToOption
                                                                .filter((e) => e.is_active == true)
                                                                .map((e) => (
                                                                    <option value={e.value}>{e.label}</option>
                                                                ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='w-1/5 flex gap-10 justify-between items-center'>
                                                    <span className="text-xs lg:text-sm font-semibold">Status</span>
                                                    <select className='w-full text-xs lg:text-sm border border-1 border-slate-400 rounded px-1 lg:px-2 lg:py-0.5' onChange={(e) => setStatusValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                                                        <option selected disabled hidden value={statusValue.value}>{statusValue.label == '' ? 'Select.' : statusValue.label}</option>
                                                        {
                                                            statusOption
                                                                .filter((e) => e.is_active == true)
                                                                .map((e) => (
                                                                    <option value={e.value}>{e.label}</option>
                                                                ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='w-1/5 flex gap-10 justify-between items-center'>
                                                    <span className="text-xs lg:text-sm font-semibold">Priority</span>
                                                    <select className='w-full text-xs lg:text-sm border border-1 border-slate-400 rounded px-1 lg:px-2 lg:py-0.5' onChange={(e) => setPriorityValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                                                        <option selected disabled hidden value={PriorityValue.value}>{PriorityValue.label == '' ? 'Select.' : PriorityValue.label}</option>
                                                        {
                                                            priorityOption
                                                                .filter((e) => e.is_active == true)
                                                                .map((e) => (
                                                                    <option value={e.value}>{e.label}</option>
                                                                ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='w-1/5 flex gap-10 justify-between items-center'>
                                                    <span className="text-xs lg:text-sm font-semibold">Type</span>
                                                    <select className='w-full text-xs lg:text-sm border border-1 border-slate-400 rounded px-1 lg:px-2 lg:py-0.5' onChange={(e) => setTypeValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                                                        <option selected disabled hidden value={typeValue.value}>{typeValue.label == '' ? 'Select.' : typeValue.label}</option>
                                                        {
                                                            typeOption
                                                                .filter((e) => e.is_active == true)
                                                                .map((e) => (
                                                                    <option value={e.value}>{e.label}</option>
                                                                ))
                                                        }
                                                    </select>
                                                </div>

                                            </div>
                                            <div className="flex justify-between w-full gap-8 mt-2.5">
                                                <div className='w-1/5 flex gap-10 justify-between items-center'>
                                                    <span className="text-xs lg:text-sm font-semibold">Module</span>
                                                    <span className="text-xs lg:text-xs font-normal">UAT NEXT DEV</span>
                                                </div>
                                                <div className='w-1/5 flex gap-10 justify-between items-center'>
                                                    <span className="text-xs lg:text-sm font-semibold">Description</span>
                                                    <input type="text" placeholder="Search test case" className="border text-xs lg:text-sm px-2 py-2.5 lg:py-0.5 rounded outline-none ring-0 border-gray-600 focus:border-gray-700 focus:border-2 w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
                                                </div>
                                                <div className='w-1/5 flex gap-10 justify-between items-center'>
                                                    <span className="text-xs lg:text-sm font-semibold">Prediction</span>
                                                    <input type="text" placeholder="Search test case" className="border text-xs lg:text-sm px-2 py-2.5 lg:py-0.5 rounded outline-none ring-0 border-gray-600 focus:border-gray-700 focus:border-2 w-full" value={prediction} onChange={(e) => setPrediction(e.target.value)} />
                                                </div>
                                                <div className='w-1/5 flex gap-6 justify-between items-center'>
                                                    <span className="text-xs lg:text-sm font-semibold">Linked Requirement</span>
                                                    <span className="text-xs lg:text-xs font-normal">UAT NEXT DEV</span>
                                                </div>

                                                <div className='w-1/5 '></div>
                                            </div>
                                        </div>
                                        {/* <div className={`flex flex-col mt-2 sm:mt-3 lg:mt-4 ml-3 sm:ml-3 lg:ml-5 text-slate-600`} onClick={handelCellExpandClose}>
                                            <div className="flex items-center gap-1 lg:gap-12">
                                                <span className="text-xs lg:text-base font-semibold sm:font-bold whitespace-nowrap">TC-12</span>
                                                <span className="text-xs lg:text-base font-normal sm:font-bold truncate">Rakesh Shaw</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 lg:gap-4 mt-3 lg:mt-4 text-slate-600">
                                                <div className="flex items-center gap-8 lg:gap-2">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Project</span>
                                                    <span className="text-xs lg:text-sm font-normal">UAT NEXT DEV</span>
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Assign To</span>
                                                    <select className="text-xs lg:text-sm border border-1 border-slate-400 rounded px-1 lg:px-2 lg:py-1" onChange={(e) => setStatusValue({ id: e.target.value, name: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                                                    <option selected disabled hidden value={assignToValue.value}>{assignToValue.label == '' ? 'Select.' : assignToValue.label}</option>
                                                        {
                                                            assignToOption
                                                                .filter((e) => e.is_active == true)
                                                                .map((e) => (
                                                                    <option value={e.value}>{e.label}</option>
                                                                ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Status</span>
                                                    <select className="text-xs lg:text-sm border border-1 border-slate-400 rounded px-1 lg:px-2 lg:py-1" onChange={(e) => setStatusValue({ id: e.target.value, name: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                                                    <option selected disabled hidden value={statusValue.value}>{statusValue.label == '' ? 'Select.' : statusValue.label}</option>
                                                        {
                                                            statusOption
                                                                .filter((e) => e.is_active == true)
                                                                .map((e) => (
                                                                    <option value={e.value}>{e.label}</option>
                                                                ))
                                                        }
                                                    </select>
                                                   
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Priority</span>
                                                    <select className="text-xs lg:text-sm border border-1 border-slate-400 rounded px-1 lg:px-2 lg:py-1" onChange={(e) => setStatusValue({ id: e.target.value, name: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                                                    <option selected disabled hidden value={PriorityValue.value}>{PriorityValue.label == '' ? 'Select.' : PriorityValue.label}</option>
                                                        {
                                                            priorityOption
                                                                .filter((e) => e.is_active == true)
                                                                .map((e) => (
                                                                    <option value={e.value}>{e.label}</option>
                                                                ))
                                                        }
                                                    </select>
                                                   
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Type</span>
                                                    <select className="text-xs lg:text-sm border border-1 border-slate-400 rounded px-1 lg:px-2 lg:py-1" onChange={(e) => setStatusValue({ id: e.target.value, name: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                                                    <option selected disabled hidden value={typeValue.value}>{typeValue.label == '' ? 'Select.' : typeValue.label}</option>
                                                        {
                                                            typeOption
                                                                .filter((e) => e.is_active == true)
                                                                .map((e) => (
                                                                    <option value={e.value}>{e.label}</option>
                                                                ))
                                                        }
                                                    </select>
                                                   
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Module</span>
                                                    <span className="text-xs lg:text-sm font-normal">UAT NEXT DEV</span>
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                <span className="text-xs lg:text-sm font-semibold">Description</span>
                                                <input type="text" placeholder="Search test case" className="border text-xs lg:text-sm px-2 py-2.5 lg:py-0.5 rounded outline-none ring-0 border-gray-600 focus:border-gray-700 focus:border-2" value={description} onChange={(e) => setDescription(e.target.value)} />
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                <span className="text-xs lg:text-sm font-semibold">Prediction</span>
                                                <input type="text" placeholder="Search test case" className="border text-xs lg:text-sm px-2 py-2.5 lg:py-0.5 rounded outline-none ring-0 border-gray-600 focus:border-gray-700 focus:border-2 w-full" value={prediction} onChange={(e) => setPrediction(e.target.value)} />
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Linked Requirement</span>
                                                    <span className="text-xs lg:text-sm font-normal">UAT NEXT DEV</span>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="flex flex-col sm:flex-row justify-between lg:items-center ml-1 lg:ml-2 mr-4 mt-2 sm:mt-4 lg:mt-8 mb-1 lg:mb-2" onClick={()=>{handelExpandRowCellOff(); handelCellExpandClose(); setMenu({index:'', isTrue:false})}}>
                                            <div className="flex flex-row justify-around lg:justify-between items-center gap-6 lg:gap-20 ml-2 lg:ml-0 overflow-x-auto">
                                                <div className="flex flex-col hidden sm:block">
                                                    <span className="text-xs lg:text-base font-semibold lg:font-semibold">Exsisting test Step</span>
                                                    <div className="h-0.5 lg:h-1 w-full bg-yellow-500"></div>
                                                </div>
                                                <div className="flex items-center gap-2 lg:gap-2">
                                                    <input type="radio" name='filter' value='709427' onChange={handelFilterTechnicalTestStep} />
                                                    <span className="text-xs lg:text-sm font-normal whitespace-nowrap">Hide Techinical Test steps</span>
                                                </div>
                                                <div className="flex items-center gap-2 lg:gap-2">
                                                    <input type="radio" name='filter' value='' onChange={handelShowAllTestStep} />
                                                    <span className="text-xs lg:text-sm font-normal whitespace-nowrap" name='filter' value=''>Show All Test Steps</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mx-2 lg:mx-0 mt-1 sm:mt-4 lg:mt-0">
                                                <div className="flex flex-col block sm:hidden">
                                                    <span className="text-xs lg:text-base font-semibold lg:font-bold whitespace-nowrap">Test-Logs</span>
                                                    <div className="h-0.5 lg:h-1 w-full bg-yellow-500"></div>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <button type="button" className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-0 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm  sm:me-1 lg:me-2 rounded-full whitespace-nowrap" onClick={() => setShowCreateTabelTestStep(!showCreateTabelTestStep)}>ADD TEST STEP</button>
                                                    <button type="button" className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-0 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm  sm:me-1 lg:me-2 rounded-full whitespace-nowrap" onClick={() => setOpenModel(true)}>ADD CALLED TEST CASES</button>
                                                    {openModel && <Model calltestCaseId={(id) => handelCallingTestStep(id)} onClose={() => setOpenModel(false)} />}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`h-auto ${openModel ? 'invisible' : 'visible'}`}  onClick={()=>{handelExpandRowCellOff()}}>
                                            <DataTable
                                                columns={columns}
                                                data={testSteps}
                                                pagination
                                                paginationPerPage={6}
                                                paginationRowsPerPageOptions={[3, 4, 6]}
                                                highlightOnHover
                                                customStyles={customStyle}

                                            />
                                        </div>
                                        <div className="flex gap-2 justify-end mt-4 mb-4 mr-4"  onClick={()=>{handelExpandRowCellOff(); handelCellExpandClose(); setMenu({index:'', isTrue:false})}}>
                                            <button type="button" className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-0 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm  sm:me-1 lg:me-2 rounded-full whitespace-nowrap " onClick={handelSave}>SAVE</button>
                                        </div>
                                        {showCreateTabelTestStep ? <CreateTestStepTable
                                            testCaseId={testCaseId}
                                            testSteps={testSteps}
                                            UATCategoryOption={UATCategoryOption}
                                            handelShowCreateTabelTestStep={() => handelShowCreateTabelTestStep()}
                                        />
                                            :
                                            <div></div>}
                                    </div>
                                )
                        }
                    </>

            }
        </>
    )
}
export default TestCaseDetails;