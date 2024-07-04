import React, { useContext, useEffect, useState, useRef } from "react";
import DataTable, { Alignment } from "react-data-table-component";
import axios from 'axios';
import Select from 'react-select';
import Context from "../../../Context/Context";
import Cookies from "js-cookie";
import { IoReorderThreeOutline } from "react-icons/io5";
import { SiMoleculer } from "react-icons/si";
import { RotatingLines } from 'react-loader-spinner';
import { PiCalendarXThin } from "react-icons/pi";
import axiosInstance from "../../../utils";
import { useNavigate } from "react-router-dom";
import Model from "./Model";
const UAT_Test_Execution_Details = () => {
    const textareaRef = useRef(null)
    const nav=useNavigate();
    const { sidebar, highlight } = useContext(Context);
    const [testSteps, setTestSteps] = useState([])
    const [isProcessing, setIsProcessing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [testStepCellExpand, setTestStepCellExpand] = useState({})
    const [expectedResultCellExpand, setExpectedResultCellExpand] = useState({})
    const [actualResultCellExpand, setActualResultCellExpand] = useState({})
    const [tester, SetTester]=useState('')
    const [statusValue, setStatusValue]=useState(JSON.parse(Cookies.get('testRunInfo')).Status)
    const [UATCategory, setUATCategory]=useState([])
    const [testLogInfo, setTestLongInfo]=useState([])
    const [filterAllTestStep, setFilterAllTestStep]=useState([])
    const [openModel, setOpenModel]=useState(false)
    const [defetcs, setDefects]=useState([])
    const [unLinkDefectId, setUnlinkDefectId]=useState([])
    const [testCaseVersionId, setTestCaseVersionId]=useState('')
    console.log(highlight)
    const selectStyle = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? 'none' : 'none',
            backgroundColor: "white"
        }),
    }
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
            //selector: row => row.UAT_Category,
            selector: row => row.customFieldInfo[1].value,
            sortable: true,
            cell: ((row) => {
                return <div>{UATCategory[row.customFieldInfo[1].value]}</div>
            }),
            width: "150px",
            maxWidth: "auto"
        },
        {
            name: 'Test Step',
            selector: row => row.called_test_case_id,
            selector: row => row.expandRow,
            selector: row => row.description,
            sortable: true,
            cell: ((row, index) => {
                return <div className="w-full" onClick={() => { setTestStepCellExpand({ stepNo: index + 1 }); setExpectedResultCellExpand({ stepNo: '' }); setActualResultCellExpand({ stepNo: '' }) }}>
                    <div className={`flex gap-2 h-auto w-full rounded py-2 px-0.5 ${index + 1 == testStepCellExpand.stepNo && 'hidden'}`}>
                        <div>{row.called_test_case_id != (testLogInfo.items.length == 0 ? null : undefined) && <SiMoleculer className="text-green-900" />}</div>
                        <div className="truncate text-xs">{row.description.replace(/<[^>]*>/g, '')}</div>
                    </div>
                    {
                        index + 1 == testStepCellExpand.stepNo &&
                        <div className="flex justify-center items-center flex-row-reverse gap-2 my-1" >
                            <textarea
                                rows={3}
                                ref={textareaRef}
                                readOnly={true}
                                class={`block p-2 w-full resize-y text-xs text-gray-900 bg-gray-50 rounded border border-gray-300 ${row.icon == '' && 'focus:ring-blue-500 focus:border-blue-500'} focus:outline-none dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 whitespace-nowrap`}
                                placeholder="Write your thoughts here..."
                                onChange={(e) => {
                                    row.description = e.target.value;
                                    if (textareaRef.current) {
                                        textareaRef.current.style.height = 'auto';
                                        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                                    }
                                    console.log('44==>', testSteps)
                                }}>
                                {row.description.replace(/<[^>]*>/g, '')}
                            </textarea>
                            {/* <div>{row.testStep}</div> */}
                            {row.called_test_case_id != (testLogInfo.items.length == 0 ? null : undefined) ? <SiMoleculer className="text-green-900" /> : <div className="ml-2"></div>}
                        </div>
                    }
                </div>
            }),
            width: "270px",
            maxWidth: "auto"
        },
        {
            name: 'Expected Result',
            selector: row => row.expected_result,
            sortable: true,
            cell: ((row, index) => {
                return <div className="w-full" onClick={() => { setExpectedResultCellExpand({ stepNo: index + 1 }); setTestStepCellExpand({ stepNo: '' }); setActualResultCellExpand({ stepNo: '' }) }}>
                    <div className={`flex gap-2 h-auto w-full rounded py-2 px-0.5 ${index + 1 == expectedResultCellExpand.stepNo && 'hidden'}`}>
                        <div className="truncate text-xs">{row.expected_result.replace(/<[^>]*>/g, '')}</div>
                    </div>
                    {
                        index + 1 == expectedResultCellExpand.stepNo &&
                        <div className="flex justify-center items-center flex-row-reverse gap-2 my-1" >
                            <textarea
                                rows={3}
                                ref={textareaRef}
                                readOnly={true}
                                class={`block p-2 w-full resize-y text-xs text-gray-900 bg-gray-50 rounded border border-gray-300 ${row.icon == '' && 'focus:ring-blue-500 focus:border-blue-500'} focus:outline-none dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 whitespace-nowrap`}
                                placeholder="Write your thoughts here..."
                                onChange={(e) => {
                                    row.expected_result = e.target.value;
                                    if (textareaRef.current) {
                                        textareaRef.current.style.height = 'auto';
                                        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                                    }
                                    console.log('44==>', testSteps)
                                }}>
                                {row.expected_result.replace(/<[^>]*>/g, '')}
                            </textarea>
                        </div>
                    }
                </div>
            }),
            width: "290px",
            maxWidth: "auto"
        },
        {
            name: 'Actual Result',
            selector: row => row.actual_result,
            sortable: true,
            cell: ((row, index) => {
                return <div className="w-full" onClick={() => { setActualResultCellExpand({ stepNo: index + 1 }); setTestStepCellExpand({ stepNo: '' }); setExpectedResultCellExpand({ stepNo: '' }) }}>
                    <div className={`flex gap-2 h-auto w-full rounded hover:border hover:border-cyan-300 py-2 px-0.5 ${index + 1 == actualResultCellExpand.stepNo && 'hidden'}`}>
                        <div className="truncate text-xs">{row.actual_result == '' || row.actual_result == undefined ? 'Add Actual Result' : row.actual_result.replace(/<[^>]*>/g, '')}</div>
                    </div>
                    {
                        index + 1 == actualResultCellExpand.stepNo &&
                        <div className="flex justify-center items-center flex-row-reverse gap-2 my-1" >
                            <textarea
                                rows={3}
                                ref={textareaRef}
                                class={`block p-2 w-full resize-y text-xs text-gray-900 bg-gray-50 rounded border border-gray-300 ${row.icon == '' && 'focus:ring-blue-500 focus:border-blue-500'} focus:outline-none dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 whitespace-nowrap`}
                                placeholder="Write your thoughts here..."
                                onChange={(e) => {
                                    row.actual_result = `<p>${e.target.value}</p>`;
                                    if (textareaRef.current) {
                                        textareaRef.current.style.height = 'auto';
                                        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                                    }
                                    console.log('44==>', testSteps)
                                }}>
                                {row.actual_result == undefined || row.actual_result == '' ? '' : row.actual_result.replace(/<[^>]*>/g, '')}
                            </textarea>
                        </div>
                    }
                </div>
            }),
            width: "280px",
            maxWidth: "auto"
        },
        {
            name: 'Status',
            selector: row => row.status.name,
            selector: row => row.status.id,
            sortable: true,
            cell: ((row) => {
                return <select className="text-xs lg:text-sm w-full rounded hover:border hover:border-cyan-300 py-2 px-0.5" onChange={((e) => { row.status.id = Number(e.target.value); row.status.name = e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text; console.log('66==>', testSteps) })}>
                    <option selected disabled hidden value={row.status.id} label={row.status.name}>{row.status.name}</option>
                    <option value={601} label="Passed">Passed</option>
                    <option value={602} label="Failed">Failed</option>
                    <option value={603} label="Incomplete">Incomplete</option>
                    <option value={604} label="Bloked">Blocked</option>
                </select>
            }),
            width: "150px",
            maxWidth: "auto"
        }
    ];
    console.log(testStepCellExpand)
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
    const handelFetchTestLogInfo=async()=>{
        try{
            setIsProcessing(true)
            const testLogResponse=await axios.get(`https://qtestapi-9ho0.onrender.com/project/130015/addTestRun/${Cookies.get('testRunId')}/testlog`)
            console.log('206==>',testLogResponse.data);
            setTestLongInfo(testLogResponse.data)
             Cookies.get('unlinkDefectId')==undefined ? Cookies.set('unlinkDefectId',JSON.stringify([])) : Cookies.set('unlinkDefectId',JSON.stringify(JSON.parse(Cookies.get('unlinkDefectId'))))
             setUnlinkDefectId(JSON.parse(Cookies.get('unlinkDefectId')))
            if(testLogResponse.data.items.length==0){
                SetTester('')
                handelFetchTestRunInfo()
                if(Cookies.get('defectData')!=undefined){
                    setDefects(JSON.parse(Cookies.get('defectData')))
                }
            }else{
                handelUAT_Category(testLogResponse.data.items[0].test_step_logs[0].customFieldInfo[1].id, testLogResponse.data.items[0].test_step_logs,'')
                setTestSteps(testLogResponse.data.items[0].test_step_logs)
                SetTester(testLogResponse.data.items[0].properties[0].field_value_name, '')
                setStatusValue(testLogResponse.data.items[0].status)
                console.log(testLogResponse.data.items[0])
                console.log(testLogResponse.data.items[0].defects)
                if(testLogResponse.data.items[0].defects!=undefined ){
                  Cookies.get('defectData')==undefined ? Cookies.set('defectData', JSON.stringify(testLogResponse.data.items[0].defects)) : Cookies.set('defectData', JSON.stringify(JSON.parse(Cookies.get('defectData'))))
                    setDefects(JSON.parse(Cookies.get('defectData')))
                }else{
                    Cookies.get('defectData')==undefined ? Cookies.set('defectData', JSON.stringify([])) : Cookies.set('defectData', JSON.stringify(JSON.parse(Cookies.get('defectData'))))
                    setDefects(JSON.parse(Cookies.get('defectData')))
                }
            }
        }catch(err){
            setErrorText(err.message);
            setIsError(true)
            console.log(err)
        }finally{
            setIsProcessing(false)
        }
    }
    const handelUAT_Category=async(UATCategoryId, test_Step_Log, test_Step)=>{
        try {
            const UAT_CategoryResponse = await axios.get(`https://qtestapi-9ho0.onrender.com/project/130015/teststeps/${UATCategoryId}`)
            console.log(UAT_CategoryResponse);
            const newObject = UAT_CategoryResponse.data.reduce((acc, item) => {
                acc[item.value] = item.label;
                return acc;
            }, {})
            console.log(newObject)
            setUATCategory(newObject)
          test_Step=='' ? setTestSteps(test_Step_Log) : handel_API_Data(test_Step, test_Step ,null, null)
        } catch (err) {
            console.log(err)
        }
    }
    const handelFetchTestRunInfo = async () => {
        try {
            const testRunInfo = await axios.get(`https://qtestapi-9ho0.onrender.com/testRuns/${Cookies.get('testRunId')}`)
            console.log(Cookies.get('testRunId'))
            console.log(testRunInfo)
            console.log(testRunInfo.data.test_case.test_steps)
            setTestCaseVersionId(testRunInfo.data.test_case_version_id)
            handelUAT_Category(testRunInfo.data.test_case.test_steps[0].customFieldInfo[1].id , '' ,testRunInfo.data.test_case.test_steps)
           // handelFetchUATCategory(testRunInfo.data.test_case.test_steps[0].customFieldInfo[1].id ,testRunInfo.data.test_case.test_steps)
        } catch (err) {
            console.log(err)
        } finally {
            setIsProcessing(false)
        }
    }
    const handel_API_Data = async (data, test ,callTestCaseId, callTestCaseParentId) => {
        data.map(async (element, index) => {
            if (element.called_test_case === undefined) {
                testSteps.push(
                        {
                            status: { name: 'Unexecuted', id: 605 },
                            expected_result: element.expected,
                            description: element.description,
                            actual_result: '',
                            test_step_id: element.id,
                            customFieldInfo: element.customFieldInfo,
                            called_test_case_id: callTestCaseId,
                            parent_test_step_id: callTestCaseParentId
                        }
                )
            } else {
              const check=test.find((e,i)=>{
                   return e.id==element.id;
                })
                console.log(check)
                check!=undefined ? handel_API_Data(element.called_test_case.test_steps, test ,element.called_test_case.id, element.id) : handel_API_Data(element.called_test_case.test_steps, test ,element.called_test_case.id, callTestCaseParentId)
            }
        })
        console.log('281==>',testSteps)
        const uniqueObjects = [...new Map(testSteps.map(item => [item.test_step_id, item])).values()]
        setTestSteps(uniqueObjects);
        setFilterAllTestStep(uniqueObjects)
        console.log(uniqueObjects)
    }
    console.log('136==>', testSteps)
    useEffect(() => {
        setIsProcessing(true)
        handelFetchTestLogInfo()
    }, [])
    const handelCellExpandClose = () => {
        setTestStepCellExpand({ stepNo: '' })
        setExpectedResultCellExpand({ stepNo: '' })
        setActualResultCellExpand(({ stepNo: '' }))
    }
    const handelSave = async (testStep) => {
        // const newTestStep=testStep.map((e,i)=>{
        //     e.order=i+1
        //     return e
        // })
       if(testLogInfo.items.length==0){
        const currentDate=new Date()
        const req={
            status: {id:Number(statusValue.id), name:statusValue.name},
            exe_start_date:new Date(currentDate.getTime()).toISOString(),
            exe_end_date:new Date(currentDate.getTime() + 1000 * 60 * 90 ).toISOString(),
            test_case_version_id:testCaseVersionId,
            test_step_logs:testStep
        }
        console.log(req)
        try {
           const testlogResponse= await axiosInstance.post(`/submittestlog/project/130015/addTestRun/${Cookies.get('testRunId')}`, req)
           console.log(testlogResponse.data)
           if(Cookies.get('defectData')!=undefined && JSON.parse(Cookies.get('defectData')).length!=0){
            const defectDataId=JSON.parse(Cookies.get('defectData')).map((e,i)=>{
                return e.id
            })
            console.log('337==>',`navigate-${Cookies.get('TestCycleIdOrTestSuiteId')}`)
           defectDataId.length!=0 && await axiosInstance.post(`/project/130015/test-logs/${testlogResponse.data.id}/defects/link`, defectDataId)
           }
           console.log('337==>',`navigate-${Cookies.get('TestCycleIdOrTestSuiteId')}`)
             nav(`/ExecuteTestRun/${Cookies.get('TestCycleIdOrTestSuiteId')}`)
        } catch (err) {
            console.log(err)
        }
       }else{
        const currentDate=new Date()
        console.log(currentDate.toISOString())
        const req={
            status: {id:Number(statusValue.id), name:statusValue.name},
            exe_start_date:testLogInfo.items[0].exe_start_date,
            exe_end_date: new Date(currentDate.getTime() + 1000 * 60 * 90 ).toISOString().replace(/\..+$/,'Z'),
    test_step_logs:testStep
        }
        console.log(req)
        try{
            await axiosInstance.put(`/submittestlog/project/130015/addTestRun/${Cookies.get('testRunId')}/test-logs/${testLogInfo.items[0].id}`,req)
            const defectDataId=JSON.parse(Cookies.get('defectData')).map((e,i)=>{
                return e.id
            })
            defectDataId.length!=0 && await axiosInstance.post(`/project/130015/test-logs/${testLogInfo.items[0].id}/defects/link`, defectDataId)
           console.log(unLinkDefectId)
           unLinkDefectId.length!=0 && await axiosInstance.delete(`/project/130015/test-logs/${testLogInfo.items[0].id}/defects/unlink`,{data:unLinkDefectId})
            nav(`/ExecuteTestRun/${Cookies.get('TestCycleIdOrTestSuiteId')}`)
        }catch(err){
            console.log(err)
         }
       }
    }
    const handelFilterBusinessTestStep=(event)=>{
        console.log(event.target.value)
        const newData = testSteps.filter(row =>row.customFieldInfo[1].value.toLowerCase().includes(event.target.value.toLowerCase()));
        setTestSteps(newData)
    }
    const handelShowAllTestStep=(e)=>{
        testLogInfo.items.length==0 ? setTestSteps(filterAllTestStep) :setTestSteps(testLogInfo.items[0].test_step_logs) 
    }
    const handelAddNewDefect=(newDefect)=>{
        setDefects([...defetcs,newDefect])
        Cookies.set('defectData',JSON.stringify([...defetcs,newDefect]))
    }
    const handelUnlinkDefectId=(unlinkId)=>{
        Cookies.set('unlinkDefectId',JSON.stringify([...unLinkDefectId, unlinkId]))
        setUnlinkDefectId(JSON.parse(Cookies.get('unlinkDefectId')))
    }
    console.log(unLinkDefectId)
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
                                    <div className={`flex flex-col h-9/12 mt-10 mb-0 ${sidebar.isSideMenuOpen === false && 'invisible'}`}>
                                        <div className={`flex flex-col mt-2 sm:mt-3 lg:mt-4 ml-3 sm:ml-3 lg:ml-5 text-slate-600`} onClick={handelCellExpandClose}>
                                            <div className="flex items-center gap-1 lg:gap-12">
                                                <span className="text-xs lg:text-base font-semibold sm:font-bold whitespace-nowrap">{JSON.parse(Cookies.get('testRunInfo')).testRunId}</span>
                                                <span className="text-xs lg:text-base font-normal sm:font-bold truncate">{JSON.parse(Cookies.get('testRunInfo')).testCaseName}</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4 mt-3 lg:mt-4 text-slate-600">
                                                <div className="flex items-center gap-8 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Project</span>
                                                    <span className="text-xs lg:text-sm font-normal">{Cookies.get('projectName')}</span>
                                                </div>
                                                {tester!=='' &&<div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Tester</span>
                                                    <span className="text-xs lg:text-sm font-normal">{tester}</span>
                                                </div>}
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Test Cycle</span>
                                                    <span className="text-xs lg:text-sm font-normal">{JSON.parse(Cookies.get('testCycleInfo')).testCycleName}</span>
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Release</span>
                                                    <span className="text-xs lg:text-sm font-normal">{Cookies.get('releaseName')}</span>
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Test Case</span>
                                                    <span className="text-xs lg:text-sm font-normal">{JSON.parse(Cookies.get('testRunInfo')).testCaseId}</span>
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Test Suite</span>
                                                    <span className="text-xs lg:text-sm font-normal">{JSON.parse(Cookies.get('testCycleInfo')).testSuiteName}</span>
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Status</span>
                                                    <select className="text-xs lg:text-sm border border-1 border-slate-400 rounded px-1 lg:px-2 lg:py-1" onChange={(e) => setStatusValue({ id: e.target.value, name: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                                                        <option selected disabled hidden value={Number(statusValue.id)} label={statusValue.name}>{JSON.parse(Cookies.get('testRunInfo')).Status.name}</option>
                                                        <option value={601} label="Passed">Passed</option>
                                                        <option value={602} label="Failed">Failed</option>
                                                        <option value={603} label="Incomplete">Incomplete</option>
                                                        <option value={604} label="Blocked">Blocked</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-1 lg:gap-8">
                                                    <span className="text-xs lg:text-base font-semibold w-20">Defect</span>
                                                    <span className="text-xs lg:text-sm font-normal">DF-697</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 lg:gap-4 mt-2">
                                                <span className="text-xs lg:text-base font-semibold text-slate-600">Precondition</span>
                                                <span className="text-xs lg:text-sm font-normal lg:whitespace-nowrap truncate">http://set-sandbox-01.sandbox.operation.dynamics.com/?cmp=200&mi=DefaultDashboard.Modified</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between lg:items-center ml-1 lg:ml-2 mr-0 lg:mr-2 mt-2 sm:mt-2 lg:mt-4 mb-1 lg:mb-1" onClick={handelCellExpandClose}>
                                            <div className="flex flex-row text-slate-600  justify-around lg:justify-between items-center gap-6 lg:gap-20 ml-2 lg:ml-0 overflow-x-auto">
                                                <div className="flex flex-col hidden sm:block">
                                                    <span className="text-xs lg:text-base font-semibold lg:font-bold">Test-Logs</span>
                                                    <div className="h-0.5 lg:h-1 w-full bg-yellow-500"></div>
                                                </div>
                                                <div className="flex items-center gap-2 lg:gap-2">
                                                    <input type="radio" name='filterTestStep' value='709426' onChange={handelFilterBusinessTestStep} />
                                                    <span className="text-xs lg:text-sm font-normal whitespace-nowrap">Show Only Business Test Steps</span>
                                                </div>
                                                <div className="flex items-center gap-2 lg:gap-2">
                                                    <input type="radio" name='filterTestStep' value='allTestStep' onChange={handelShowAllTestStep} />
                                                    <span className="text-xs lg:text-sm font-normal whitespace-nowrap">Show All Test Steps</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mx-2 lg:mx-0 mt-1 sm:mt-4 lg:mt-0">
                                                <div className="flex flex-col block sm:hidden">
                                                    <span className="text-xs lg:text-base font-semibold lg:font-bold whitespace-nowrap">Test-Logs</span>
                                                    <div className="h-0.5 lg:h-1 w-full bg-yellow-500"></div>
                                                </div>
                                                <button type="button" className="text-white rounded bg-cyan-500 focus:ring-1 focus:ring-blue-300 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:focus:ring-green-800 font-normal lg:font-xs text-xs lg:text-xs px-1 py-1 lg:px-1 lg:py-1 sm:me-1 lg:me-2 whitespace-nowrap" onClick={() => setOpenModel(true)}>LINK DEFECT</button>
                                                {openModel && <Model defects={defetcs}  addNewDefect={(newDefect)=>handelAddNewDefect(newDefect)} handelUnlinkDefectId={(unlinkId)=>handelUnlinkDefectId(unlinkId)} onClose={()=>setOpenModel(false)}/>}
                                            </div>
                                        </div>
                                        <div className={`${openModel ? 'invisible' : 'visible'}`}>
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
                                        <div className="flex gap-2 justify-end mt-0 mb-2 mr-4" onClick={handelCellExpandClose}>
                                            <button type="button" className="text-white rounded bg-cyan-500 focus:ring-1 focus:ring-blue-300 focus:ring-blue-300 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:focus:ring-green-800 font-normal lg:font-xs text-xs lg:text-xs px-4 py-2 whitespace-nowrap" onClick={() => handelSave(testSteps)}>SAVE</button>
                                            <button type="button" className="text-white rounded bg-cyan-500 focus:ring-1 focus:ring-blue-300 focus:ring-blue-300 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:focus:ring-green-800 dark:focus:ring-green-800 font-normal lg:font-xs text-xs lg:text-xs px-4 whitespace-nowrap" onClick={()=> {nav('/defect'); Cookies.remove('defectInfo'); Cookies.remove('submittedDate'); Cookies.remove('defectId')}}>SUBMIT DEFECT</button>
                                        </div>
                                    </div>
                                )
                        }
                    </>
            }
        </>
    )
}
export default UAT_Test_Execution_Details;