import React, { useContext, useEffect, useState } from "react";
import Context from "../../../Context/Context";
import axiosInstance from "../../../utils";
import Cookies from "js-cookie";
import { Outlet, json, useLocation, useNavigate } from "react-router-dom";
import { CiBookmarkMinus } from "react-icons/ci";
import Requirenments from "./Requirenments";
const Review_UAT_Test_Cases_Sidebar = () => {
    const { sidebar, highlightAuthor ,setHighlightAuthor } = useContext(Context);
    const nav=useNavigate()
    const location=useLocation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [projectInfo, setProjectInfo] = useState('');
    const [epicOption, setEpicOption] = useState([])
    const [epicValue, setEpicValue] = useState('')
    const [featureOption, setFeatureOption] = useState([])
    const [featurevalue, setFeaturevalue] = useState({value:'', label:''})
    const [requirements, setRequirenments] = useState([])
    const [teamValue, setTeamValue]=useState('')
    const [teamOption, setTeamOption]=useState([])
    const options = [
        { value: 'active', label: 'active' },
        { value: 'inactive', label: 'inactive' }
    ];
    const handelFetchProject = async (moduleId, count) => {
        try {
            setIsProcessing(true)
            const projectResponse = await axiosInstance.get(`/module/${moduleId}`)
            console.log(projectResponse.data)
            count == 1 && setProjectInfo(projectResponse.data)
            if(count==1){
                setEpicOption(projectResponse.data.children)
                Cookies.get('epicName')==undefined ? setEpicValue('') : setEpicValue(Cookies.get('epicName'))
                Cookies.get('featureOption')==undefined ? setFeatureOption([]) : setFeatureOption(JSON.parse(Cookies.get('featureOption')))
                Cookies.get('team')===undefined ? setTeamOption([]) : setTeamOption(JSON.parse(Cookies.get('team')))
                //setTeamOption([])
                if(Cookies.get('featureName')==undefined){
                    setFeaturevalue({value:'', label:''})
                }else{
                    setFeaturevalue(JSON.parse(Cookies.get('featureName')))
                    handelFetchRequirenments(JSON.parse(Cookies.get('featureName')))
                }
            }else{
                setEpicValue(count)
                Cookies.set('epicName',count)
                setFeaturevalue({value:'', label:''})
                setTeamValue('')
                setTeamOption([])
                projectResponse.data.children!=undefined ?  setFeatureOption(projectResponse.data.children) : setFeatureOption([])
                console.log(projectResponse.data.children)
                setRequirenments([])
                Cookies.set('featureOption',JSON.stringify(projectResponse.data.children))
                Cookies.get('CookiesName')==undefined ? Cookies.set('CookiesName',JSON.stringify(['epicName','featureOption'])) : Cookies.set('CookiesName',JSON.stringify([...JSON.parse(Cookies.get('CookiesName')),...['epicName','featureOption']]))
            }
        } catch (err) {
            setErrorText(err.message);
            setIsError(true)
            console.log(err);
        } finally {
            setIsProcessing(false)
        }
    }
    const handelFetchRequirenments = async (feature, team) => {
        console.log(feature, team)
        try {
            const requirementsResponse = await axiosInstance.post(`/projects/130015/requirements/search`, { moduleId: feature.value, featureName: feature.label, team: team})
            console.log(requirementsResponse.data)
            setRequirenments(requirementsResponse.data.items)
            requirementsResponse.data.items.length!=0 && Cookies.set('featureName',JSON.stringify({...JSON.parse(Cookies.get('featureName')),id:requirementsResponse.data.items[0].parent_id}))
            handelFetchTeam(requirementsResponse.data.items[0].properties)
        } catch (err) {
            console.log(err)
        }
    }
    const handelFetchTeam = async (properties) => {
        try {
            const teamField= await properties.filter((e)=>e && e.field_name=='Team')
            console.log(teamField)
            const teamResponse = await axiosInstance.get(`/project/130015/settings/requirements/fields/${teamField[0].field_id}/allowed-values`)
            console.log(teamResponse.data)
            setTeamOption(teamResponse.data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        setIsProcessing(true);
        handelFetchProject(52126818, 1)
    }, [])
    console.log(epicValue)
    const handelFeatureValue = (e) => {
        //setFeaturevalue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })
        setFeaturevalue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })
        handelFetchRequirenments({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text }, '')
        Cookies.set('featureName',JSON.stringify({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text }))
        Cookies.set('CookiesName',JSON.stringify([...JSON.parse(Cookies.get('CookiesName')),'featureName']))
    }
    const handelHighlightAuthor=(requirementId)=>{
        setHighlightAuthor(requirementId)
       nav(`/author-UAT-Test/${requirementId}`)
    }
    console.log('.........=>85')
    return (
        <div className="flex h-[107vh] ml-0 mt-10 text-slate-600">
            <div className={`transition-all min-h-full duration-300 ${sidebar.isSideMenuOpen ? 'w-1/5' : 'w-0'} bg-emerald-50 mt-1 overflow-hidden text-slate-600`}>
                <div className="flex flex-col gap-2 mx-2">
                    <div className="flex gap-5 mt-2.5">
                        <div className="w-2/6 h-6">
                            <span className="font-medium sm:font-semibold text-xs  md:text-sm lg:text-base">Project</span>
                        </div>
                        <div className="w-4/6 h-6">
                            <span className="font-medium sm:font-semibold text-xs whitespace-nowrap text-slate-500">{projectInfo.name}</span>
                        </div>
                    </div>
                    <div className="flex gap-3.5">
                        <div className="w-2/6 h-8">
                            <span className="font-medium sm:font-semibold text-xs  md:text-sm lg:text-base whitespace-nowrap">Select Epic</span>
                        </div>
                        <div className="w-4/6 h-8">
                            <select className="w-full text-xs py-0.5 sm:px-1 sm:py-1 md:px-1 md:py-1.5 focus:ring-blue-500 outline-0 border border-slate-300 focus:border-cyan-400 rounded text-slate-400" onChange={(e) => handelFetchProject(e.target.value, e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text)}>
                                <option value='' selected disabled hidden >{epicValue == '' ? 'Select..' : epicValue}</option>
                                {
                                    epicOption.map((element, index) => (
                                        <option value={element.id}>{element.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-2/6 h-8"></div>
                        <div className="w-4/6 h-8">
                            <select className="w-full  text-xs py-0.5 sm:px-1 sm:py-1 md:px-1 md:py-1.5 focus:ring-blue-500 outline-0 border border-slate-300 focus:border-cyan-400 rounded text-slate-400" value={featurevalue.label} onChange={handelFeatureValue}>
                                <option value='' selected disabled hidden >{featurevalue.label == '' && 'Select..'}</option>
                                {
                                    featureOption.map((element, index) => (
                                        <option value={element.pid} key={index}>{element.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3.5">
                        <div className="w-2/6 h-8">
                            <span className="font-medium sm:font-semibold text-xs  md:text-sm lg:text-base whitespace-nowrap">Select Item</span>
                        </div>
                        <div className="w-4/6 h-8">
                            <select className="w-full  text-xs py-0.5 sm:px-1 sm:py-1 md:px-1 md:py-1.5 focus:ring-blue-500 outline-0 border border-slate-300 focus:border-cyan-400 rounded text-slate-400" value={teamValue} onChange={(e)=>handelFetchRequirenments(featurevalue,e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text)}>
                            <option value='' selected disabled hidden >{teamValue == '' && 'Select..'}</option>
                                {
                                    teamOption.map((e)=>(
                                        <option value={e.value}>{e.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="">
                        <input type="text" placeholder="Search here" className="border z-30 text-xs lg:text-sm px-1 py-2.5 lg:py-2 rounded outline-none ring-0 border-slate-300 focus:border-blue-300 focus:border-1 sm:w-11/12 lg:w-full" />
                    </div>
                    {
                        requirements.map((requirenmentElement, i) => (
                            <Requirenments requirenment={requirenmentElement} handelHighlightAuthor={(requirementId)=>handelHighlightAuthor(requirementId)}/>
                        ))
                    }
                </div>
            </div>
            <div className={`transition-all duration-300 ${sidebar.isSideMenuOpen ? 'w-4/5' : 'w-full'}`}>
                <Outlet/>
            </div>
        </div>

    )
}
export default Review_UAT_Test_Cases_Sidebar;