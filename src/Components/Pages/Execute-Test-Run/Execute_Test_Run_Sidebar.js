import React, { useContext, useEffect, useState, useTransition } from "react";
import DataTable from "react-data-table-component";
import Select from 'react-select';
import axios from 'axios';
import axiosInstance from "../../../utils";
import Context from "../../../Context/Context";
import Hierarchy_Folder from "../../Hierarchy_Folder";
import { Outlet, useLocation } from "react-router-dom";
import { RotatingLines } from 'react-loader-spinner';
import Cookies from "js-cookie";
const Execute_Test_Run = () => {
  const { sidebar, setHighlight } = useContext(Context);
  const location = useLocation();
  const [projectInfo, setProjectInfo] = useState('');
  const [value, setValue] = useState('')
  const [option, setOption] = useState([])
  const [testCycle, setTestCycle] = useState([])
  const [isProcessing, setIsProcessing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const handelFetchProject = async () => {
    try {
      setIsProcessing(true)
      const projectResponse = await axiosInstance.get('/module/52126818')
      //    axios.get('https://pursuitrnd.qtestnet.com/api/v3/projects/130015/modules/52126818',{headers: {
      //       'Authorization': `Bearer fe453042-4eb3-463c-a2e2-06436acd57df`,
      //     'Access-Control-Allow-Origin': true
      //   }
      // })
      console.log(projectResponse.data)
      setProjectInfo(projectResponse.data)
      Cookies.set('projectName', projectResponse.data.name)
      handelFetchRelease()
    } catch (err) {
      setErrorText(err.message);
      setIsError(true)
      console.log(err);
    } finally {
      setIsProcessing(false)
    }
  }
  const handelFetchRelease = async () => {
    try {
      const releaseResponse = await axiosInstance.get('/release/920054')
      console.log(releaseResponse.data)
      setOption([{ value: releaseResponse.data.id, label: releaseResponse.data.name }])
    } catch (err) {
      console.log(err);
    }
  }
  const handelFetchTestSuit = async () => {
    try {
      const testCycleResponse = await axiosInstance.get('/testcycle')
      console.log(testCycleResponse)
      setTestCycle(testCycleResponse.data)
      console.log(testCycleResponse.data.length)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    setIsProcessing(true)
    handelFetchProject()
  }, [])
  useEffect(() => {
    if (value !== '') {
      handelFetchTestSuit()
      Cookies.set('releaseName', value)
      Cookies.get('CookiesName') == undefined ? Cookies.set('CookiesName', JSON.stringify(['projectName', 'releaseName'])) : Cookies.set('CookiesName', JSON.stringify([...JSON.parse(Cookies.get('CookiesName'))]))
    } else if (Cookies.get('releaseName') !== undefined) {
      setValue(Cookies.get('releaseName'))
    }
  }, [value])

  // console.log(JSON.parse(Cookies.get('projectInfo')))
  return (
    <>
      {
        isProcessing ?
          <div className='flex justify-center items-center h-svh w-full'>
            {/* <span className="text-3xl text-slate-400 font-medium">Loading....</span> */}
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
                  <div className="flex h-[92.5vh] ml-0 mt-10 text-slate-600">
                    <div className={`transition-all min-h-full duration-300 ${sidebar.isSideMenuOpen ? 'w-1/5' : 'w-0'} bg-emerald-50 overflow-hidden text-slate-600`}>
                      <div className={`flex flex-col ${sidebar.isSideMenuOpen ? 'block' : 'hidden'}`}>
                        <div className="grid grid-cols-1 gap-2 mt-4 ml-2 mr-1.5 lg:mr-0.5">
                          <div className="flex items-center">
                            <span className="font-medium sm:font-semibold text-xs md:text-sm lg:text-base text-slate-600 mr-5">Project</span>
                            <span className="font-medium sm:font-semibold text-xs whitespace-nowrap text-slate-500 ">{projectInfo.name}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="font-medium sm:font-semibold text-xs md:text-sm lg:text-base text-slate-600 mr-4">Release</span>
                            <span>
                            <select
                              defaultValue={value}
                              className="text-xs py-0.5 sm:px-1 sm:py-1 md:px-4 md:py-1.5 focus:ring-blue-500 outline-0 border border-slate-300 focus:border-cyan-400 rounded text-slate-400"
                              onChange={(e) => setValue(e.target.value)}
                            >
                              <option className="text-sm" selected disabled hidden>
                                {value === '' ? 'Select' : value}
                              </option>
                              {option.map((element, index) => (
                                <option className="" value={element.id} key={index}>
                                  {element.label}
                                </option>
                              ))}
                            </select>
                            </span>
                          </div>
                          
                        </div>

                        <div className="flex flex-col m-0 mt-2 overflow-x-auto overflow-y-auto h-[80vh] scrollbar-hide">
                          {testCycle.map((testCycleElement, testCycleIndex) => (
                            <div key={testCycleIndex}>
                              <Hierarchy_Folder testCycle={testCycleElement} fileType={'folder'} icon={'test-Cycles'} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={`transition-all duration-300 ${sidebar.isSideMenuOpen ? 'w-4/5' : 'w-full'}`}>
                      <Outlet />
                    </div>
                  </div>

                )
            }
          </>
      }
    </>

  )
}
export default Execute_Test_Run;