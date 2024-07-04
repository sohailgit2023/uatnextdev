import React, { useContext, useEffect, useState } from 'react';
import { MdArrowRight } from "react-icons/md";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { PiWaveSineBold } from "react-icons/pi";
import { BiNotepad } from "react-icons/bi";
import Context from "../Context/Context";
import { json, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const Hierarchy_Folder = ({ testCycle, testCycleName, fileType, icon }) => {
    const {setHighlight}=useContext(Context)
    const [expand, setExpand] = useState(Cookies.get(`${testCycle.name}`)==undefined ? false : Cookies.get(`${testCycle.name}`)=='false' ? false : true)
    const [hideExpandIcon, setHideExpandIcon]=useState('')
    const nav=useNavigate();
    const location =useLocation();
    const handelTestSuitOpen = () => {
       // testCycle['test-cycles']!=undefined || testCycle['test-suites']!=undefined ? testCycle['test-cycles'].length!=0 || testCycle['test-suites']!=undefined ? setExpand(true) :setExpand(false): setExpand(false)
        if(testCycle['test-cycles']!=undefined || testCycle['test-suites']!=undefined){
            if(testCycle['test-cycles'].length!=0 || testCycle['test-suites']!=undefined){
                setExpand(true)
                Cookies.set(`${testCycle.name}`,true)
                Cookies.set('CookiesName',JSON.stringify([...JSON.parse(Cookies.get('CookiesName')),`${testCycle.name}`]))
            }else{
                setExpand(false)
                Cookies.set(`${testCycle.name}`,false)
                Cookies.set('CookiesName',JSON.stringify([...JSON.parse(Cookies.get('CookiesName')),`${testCycle.name}`]))
                setHideExpandIcon(true)
            }
        }else{
            setExpand(false)
            Cookies.set(`${testCycle.name}`,false)
            Cookies.set('CookiesName',JSON.stringify([...JSON.parse(Cookies.get('CookiesName')),`${testCycle.name}`]))
            setHideExpandIcon(true)
        }
    }
    const handelTestSuitClose = () => {
        Cookies.set(`${testCycle.name}`,false)
        Cookies.set('CookiesName',JSON.stringify([...JSON.parse(Cookies.get('CookiesName')),`${testCycle.name}`]))
        setExpand(false)
    }
    const handel_TestCycleID_Or_TestSuiteId=(id, testSuiteName, testCycleName)=>{
        Cookies.set('TestCycleIdOrTestSuiteId', id);
        Cookies.set('testCycleInfo', JSON.stringify({testSuiteName:testSuiteName, testCycleName:testCycleName}))
        Cookies.set('CookiesName',JSON.stringify([...JSON.parse(Cookies.get('CookiesName')),...['testCycleInfo','TestCycleIdOrTestSuiteId']]))
        sessionStorage.setItem('suiteId',id)
        setHighlight(id);
        nav(`/ExecuteTestRun/${id}`)
        console.log(testCycleName)

    }
    console.log(`${testCycle.name}==>`, Cookies.get(`${testCycle.name}`)==undefined ? false : Cookies.get(`${testCycle.name}`))
    console.log(testCycle)
    console.log(testCycle['test-cycles'])
    console.log(testCycle['test-suites'])
    console.log('54==>',location.pathname)
    return (
        <>
            <div className={`w-full flex items-center gap-0.5 mt-0 lg:mt-1 ml-0 sm:ml-0 mr-1 sm:mr-0 md:mr-0 lg:mr-0 hover:bg-cyan-200 hover:text-black ${location.pathname===`/ExecuteTestRun/${testCycle.id}` && 'bg-green-300 text-slate-900 hover:bg-green-300'}`} title={`${testCycle.pid} ${testCycle.name}`} onClick={()=>testCycle.pid.split('-')[0]=='TS' && handel_TestCycleID_Or_TestSuiteId(testCycle.id, testCycle.name, testCycleName)}>
                {expand ? <MdOutlineArrowDropDown className={`text-xs sm:text-lg md:text-xl cursor-pointer ${hideExpandIcon && 'hidden'}`} onClick={handelTestSuitClose} /> : <MdArrowRight className={`text-base sm:text-lg md:text-xl cursor-pointer ${hideExpandIcon && 'invisible'}`} onClick={handelTestSuitOpen} />}
                <div className="flex items-center gap-1 lg:gap-2 truncate cursor-pointer">
                    {icon=='test-Cycles' ? <PiWaveSineBold className=" text-sm sm:text-base lg:text-base bg-blue-500 text-white p-0.5" /> :<BiNotepad className=" text-sm sm:text-base lg:text-lg text-yellow-500 text-white" />}
                    <span className="text-xs  lg:text-xs truncate">{testCycle.name}</span>
                </div>
            </div>
            {
                expand && 
                    (Array.isArray(testCycle['test-cycles']) ? testCycle['test-cycles'].map((testCycleElement, testCycleIndex) => (
                        <div key={testCycleIndex} className='ml-4'>
                            <Hierarchy_Folder testCycle={testCycleElement} fileType={'file'} icon={'test-Cycles'}/>
                        </div>
                    )):null)
            }
            {
                expand && (Array.isArray(testCycle['test-suites']) ? testCycle['test-suites'].map((testSuiteElement, testSuiteIndex)=>(
                    <div key={testSuiteIndex} className='ml-4'>
                        <Hierarchy_Folder testCycle={testSuiteElement} testCycleName={testCycle.name} fileType={'file'} icon={'test-Suite'} />
                    </div>
                )):null)
            }
        </>
    )
}
export default Hierarchy_Folder;