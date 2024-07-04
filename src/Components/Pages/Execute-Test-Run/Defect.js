import ladyBug from '../../../images/ladybug.png'
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axiosInstance from '../../../utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Defect = () => {
    const nav=useNavigate();
    const [summry, setSummry] = useState('')
    const [submitter, setSubmitter] = useState({ value: 478563, label: 'Rakesh Shaw' })
    const [severityOptions, setSeverityOption] = useState([])
    const [severityValue, setSeverityValue] = useState({ value: '', label: '' })
    const [submittedDate, setSubmittedDate] = useState('')
    const [priorityOption, setPriorityOption] = useState([])
    const [priorityValue, setPriorityValue] = useState({ value: '', label: '' })
    const [rootCauseOptions, setRootCauseOption] = useState([])
    const [rootCauseValue, setRootCauseValue] = useState({ value: '', label: '' })
    const [moduleOption, setModuleOption] = useState([])
    const [moduleValue, setModuleValue] = useState({ value: '', label: '' })
    const [assignToOption, setAssignToOption] = useState([])
    const [assignToValue, setAssignToValue] = useState({ value: '', label: '' })
    const [statusOption, setStatusOption] = useState([])
    const [statusValue, setStatusValue] = useState({ value: '', label: '' })
    const [typeOption, setTypeOption] = useState([])
    const [typeValue, setTypeValue] = useState({ value: '', label: '' })
    const [reasonOption, setReasonOption] = useState([])
    const [reasonValue, setReasonValue] = useState({ value: '', label: '' })
    const [categoryOption, setCategoryOPtion] = useState([])
    const [categoryValue, setCategoryValue] = useState('')
    const [targetDate, setTargetDate] = useState('')
    const [closeDate, setCloseDate] = useState('')
    const [linkedId, setLinkedId] = useState('')
    const [environmentOption, setEnvironmentOption] = useState([])
    const [environmentValue, setEnvironmentValue] = useState({ value: '', label: '' })
    const [linkedSystem, setLinkedSystem] = useState('Azure Boards')
    const [applicationOption, setApplicationOption] = useState([])
    const [applicationValue, setApplicationValue] = useState({ value: '', label: '' })
    const [affectedReleaseOption, setAffectedReleaseOption] = useState([])
    const [affectedReleaseValue, setAffectedReleaseValue] = useState({ value: '', label: '' })
    const [fixedReleaseOption, setFixedReleaseOption] = useState([])
    const [fixedReleaseValue, setFixedReleaseValue] = useState({ value: '', label: '' })
    const [targetReleaseOption, setTargetReleaseOption] = useState([])
    const [targetReleaseValue, setTargetReleaseValue] = useState({ value: '', label: '' })
    const [createdBy_UATnext_Only, setCreatedBy_UATnext_Only] = useState('')
    const [nonQaUserOption, setNonQaUserOption] = useState([])
    const [non_QA_User_UATnext_OnlyValue, setNon_QA_User_UATnext_OnlyValue] = useState({ value: '', label: '' })
    const [description, setDescription] = useState('')


    const [defectInfo, setDefectInfo] = useState((Cookies.get('defectInfo') != undefined && Cookies.get('defectId')!=undefined) ? JSON.parse(Cookies.get('defectInfo')) : '')

    const handelFetchSubmittedDate = () => {
        const date = new Date()
        const currentDateTime = `${date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
        Cookies.get('submittedDate')==undefined ? setSubmittedDate(currentDateTime) : setSubmittedDate(Cookies.get('submittedDate'))
        defectInfo !== '' && handelGetDefectInfo()
    }
    const handelGetDefectInfo = () => {
        let newDefectInfo={}
       
        defectInfo.filter((e) => 
            e.field_name=='Summary' ||
        e.field_name=='Description' ||
         e.field_name=='Submitter' ||
          e.field_name=='Target Date' ||
           e.field_name=='Closed Date' ||
           e.field_name=='Link ID' || 
           e.field_name=='Linked System' ||
           e.field_name=='Created By (UATNext Only)')
            .map((e) => {
                console.log(e.field_name)
                newDefectInfo[`${e.field_name}`] = e
            })
            console.log(newDefectInfo)
        setSummry(newDefectInfo.Summary.field_value)
        setDescription(newDefectInfo.Description.field_value)
        setSubmitter({ value:newDefectInfo.Submitter.field_value, label: newDefectInfo.Submitter.field_value_name })
        setTargetDate(newDefectInfo['Target Date'].field_value.split('T')[0])
        console.log(defectInfo[17].field_value.split(':')[0] + ':' + defectInfo[17].field_value.split(':')[1])
        setCloseDate((newDefectInfo['Closed Date'].field_value.split(':')[0] + ':' + newDefectInfo['Closed Date'].field_value.split(':')[1])==':undefined' ? '' : defectInfo[17].field_value.split(':')[0] + ':' + defectInfo[17].field_value.split(':')[1])
        setLinkedId(newDefectInfo['Link ID'].field_value)
        setLinkedSystem(newDefectInfo['Linked System'].field_value)
        setCreatedBy_UATnext_Only(newDefectInfo['Created By (UATNext Only)'].field_value)
    }
    const handelAffectedReleaseBuild = async () => {
        try {
            const affectedResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127554/allowed-values`)
            const newOptions = affectedResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => ({ value: e.value, label: e.label }));
            setAffectedReleaseOption(newOptions)
    
            if(defectInfo!==''){
               const effectedRelease= defectInfo.filter((e)=>e && e.field_name=='Affected Release/Build')
               console.log(effectedRelease)
                setAffectedReleaseValue({ value: effectedRelease[0].field_value, label: effectedRelease[0].field_value_name })
            }
        } catch (err) {
            console.log(err)
        }
    }
    console.log(affectedReleaseValue)
    const handelPriority = async () => {
        try {
            const priorityResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127551/allowed-values`)
            const newOptions = priorityResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => {
                    if(defectInfo!=''){
                        const priorityInfo=defectInfo.filter((e)=>e && e.field_name=='Priority')
                        setPriorityValue({ value: priorityInfo[0].field_value, label: priorityInfo[0].field_value_name }) 
                    }else if(e.label == '1 - Critical'){
                        setPriorityValue({ value: e.value, label: e.label })
                    }
                    return { value: e.value, label: e.label }
                });
            setPriorityOption(newOptions)
        } catch (err) {
            console.log(err)
        }
    }
    const handelSeverity = async () => {
        try {
            const severityResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127549/allowed-values`)
            const newOptions = severityResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => {
                    if(defectInfo!=''){
                        const severityInfo=defectInfo.filter((e)=>e && e.field_name=='Severity')
                        setSeverityValue({ value: severityInfo[0].field_value, label: severityInfo[0].field_value_name })
                    }else if(e.label == '2 - High'){
                        setSeverityValue({ value: e.value, label: e.label })
                    }
                    return { value: e.value, label: e.label }
                });
            setSeverityOption(newOptions)
        } catch (err) {
            console.log(err)
        }
    }
    const handelFixedReleaseBuild = async () => {
        try {
            const fixedReleaseResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127555/allowed-values`)
            const newOptions = fixedReleaseResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => ({ value: e.value, label: e.label }));
            setFixedReleaseOption(newOptions)
            if(defectInfo!==''){
                const fixedRelease= defectInfo.filter((e)=>e && e.field_name=='Fixed Release/Build')
                console.log(fixedRelease)
                setFixedReleaseValue({ value: fixedRelease[0].field_value, label: fixedRelease[0].field_value_name })
             }
        } catch (err) {
            console.log(err)
        }
    }
    const handelRootCause = async () => {
        try {
            const rootCauseResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127556/allowed-values`)
            const newOptions = rootCauseResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => {
                    if(defectInfo!=''){
                        const rootCauseInfo=defectInfo.filter((e)=>e && e.field_name=='Root Cause')
                        setRootCauseValue({ value: rootCauseInfo[0].field_value, label: rootCauseInfo[0].field_value_name })
                    }else if(e.label == 'Other'){
                        setRootCauseValue({ value: e.value, label: e.label })
                    }
                    return { value: e.value, label: e.label }
                });
            setRootCauseOption(newOptions)
        } catch (err) {
            console.log(err)
        }
    }
    const handelModule = async () => {
        try {
            const rootCauseResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127550/allowed-values`)
            const newOptions = rootCauseResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => ({ value: e.value, label: e.label }));
            setModuleOption(newOptions)
            if(defectInfo!==''){
                const moduleInfo= defectInfo.filter((e)=>e && e.field_name=='Module')
                console.log(moduleInfo)
                setModuleValue({ value: moduleInfo[0].field_value, label: moduleInfo[0].field_value_name })
             }
        } catch (err) {
            console.log(err)
        }
    }
    const handelAssignTo = async () => {
        try {
            const assignToResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127546/allowed-values`)
            const newOptions = assignToResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => ({ value: e.value, label: e.label }));
            setAssignToOption(newOptions)
            if(defectInfo!==''){
                const assignToInfo= defectInfo.filter((e)=>e && e.field_name=='Assigned To')
                console.log(assignToInfo)
                setAssignToValue({ value: assignToInfo[0].field_value, label: assignToInfo[0].field_value_name })
             }
        } catch (err) {
            console.log(err)
        }
    }
    const handelStatus = async () => {
        try {
            const statusResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127557/allowed-values`)
            const newOptions = statusResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => {
                    if(defectInfo!=''){
                        const statusInfo=defectInfo.filter((e)=>e && e.field_name=='Status')
                        setStatusValue({ value: statusInfo[0].field_value, label: statusInfo[0].field_value_name })
                    }else if(e.label == 'New'){
                        setStatusValue({ value: e.value, label: e.label })
                    }
                    return { value: e.value, label: e.label }
                });
            setStatusOption(newOptions)
        } catch (err) {
            console.log(err)
        }
    }
    const handelType = async () => {
        try {
            const typeResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127558/allowed-values`)
            const newOptions = typeResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => {
                    if(defectInfo!=''){
                        const typeInfo=defectInfo.filter((e)=>e && e.field_name=='Type')
                        setTypeValue({ value: typeInfo[0].field_value, label: typeInfo[0].field_value_name })
                    }else if(e.label == 'Bug'){
                        setTypeValue({ value: e.value, label: e.label })
                    }
                    return { value: e.value, label: e.label }
                });
            setTypeOption(newOptions)
        } catch (err) {
            console.log(err)
        }
    }
    const handelTargetReleaseBuild = async () => {
        try {
            const targetReleaseResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127559/allowed-values`)
            const newOptions = targetReleaseResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => ({ value: e.value, label: e.label }));
            setTargetReleaseOption(newOptions)
            if(defectInfo!==''){
                const targetRelease= defectInfo.filter((e)=>e && e.field_name=='Target Release/Build')
                console.log(targetRelease)
                setTargetReleaseValue({ value: targetRelease[0].field_value, label: targetRelease[0].field_value_name })
             }
        } catch (err) {
            console.log(err)
        }
    }
    const handelReason = async () => {
        try {
            const reasonResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127560/allowed-values`)
            const newOptions = reasonResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => {
                    if(defectInfo!=''){
                        const reasonInfo=defectInfo.filter((e)=>e && e.field_name=='Reason')
                        setReasonValue({ value: reasonInfo[0].field_value, label: reasonInfo[0].field_value_name })
                    }else if(e.label == 'Additional Info Needed'){
                        setReasonValue({ value: e.value, label: e.label })
                    }
                    return { value: e.value, label: e.label }
                });
            setReasonOption(newOptions)
        } catch (err) {
            console.log(err)
        }
    }
    const handelCategory = async () => {
        try {
            const categoryResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127561/allowed-values`)
            const newOptions = categoryResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => {
                    if(defectInfo!=''){
                        const categoryInfo=defectInfo.filter((e)=>e && e.field_name=='Category')
                        setCategoryValue({ value: categoryInfo[0].field_value, label: categoryInfo[0].field_value_name })
                    }else if(e.label == 'Other '){
                        setCategoryValue({ value: e.value, label: e.label })
                    }
                    return { value: e.value, label: e.label }
                });
            setCategoryOPtion(newOptions)
        } catch (err) {
            console.log(err)
        }
    }
    const handelEnviornment = async () => {
        try {
            const environmentResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13127564/allowed-values`)
            console.log('235==>', environmentResponse.data)
            const newOptions = environmentResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => ({ value: e.value, label: e.label }));
            console.log(newOptions);
            setEnvironmentOption(newOptions)
            if(defectInfo!==''){
                const environmentInfo= defectInfo.filter((e)=>e && e.field_name=='Environment')
                console.log(environmentInfo)
                setEnvironmentValue({ value: environmentInfo[0].field_value, label: environmentInfo[0].field_value_name })
             }
        } catch (err) {
            console.log(err)
        }
    }
    const handelApplication = async () => {
        try {
            const applicationResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13592322/allowed-values`)
            const newOptions = applicationResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => ({ value: e.value, label: e.label }));
            setApplicationOption(newOptions)
            if(defectInfo!==''){
                const applicationInfo= defectInfo.filter((e)=>e && e.field_name=='Application')
                console.log(applicationInfo)
                setApplicationValue({ value: applicationInfo[0].field_value, label: applicationInfo[0].field_value_name })
             }
        } catch (err) {
            console.log(err)
        }
    }
    const handelNonQaUser = async () => {
        try {
            const nonQaUserResponse = await axiosInstance.get(`/project/130015/settings/defects/fields/13741220/allowed-values`)
            const newOptions = nonQaUserResponse.data
                .filter((e) => e.is_active == true)
                .map((e) => ({ value: e.value, label: e.label }));
            setNonQaUserOption(newOptions)
            if(defectInfo!==''){
                const nonQaUserInfo= defectInfo.filter((e)=>e && e.field_name=='Non-QA User (UATNext Only)')
                console.log(nonQaUserInfo)
                setNon_QA_User_UATnext_OnlyValue({ value: nonQaUserInfo[0].field_value, label: nonQaUserInfo[0].field_value_name })
             }
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        handelFetchSubmittedDate()
        handelAffectedReleaseBuild()
        handelPriority()
        handelSeverity()
        handelFixedReleaseBuild()
        handelRootCause()
        handelModule()
        handelAssignTo()
        handelRootCause()
        handelStatus()
        handelType()
        handelTargetReleaseBuild()
        handelReason()
        handelCategory()
        handelApplication()
        handelEnviornment()
        handelNonQaUser()
    }, [])
    const handelTargetDate = (date) => {
        let targetIsoDate;
        if (date != '') {
            const [year, month, day] = date.split('-').map(Number);
            targetIsoDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toISOString();
        } else {
            targetIsoDate = '';
        }
        return targetIsoDate;
    }
    useEffect(()=>{
        console.log(fixedReleaseValue,affectedReleaseValue)
    },[fixedReleaseValue,affectedReleaseValue])
    const handelSaveDefect = async () => {
        const req = {
            "properties": [
                {
                    "field_id": 13127544,
                    "field_value": summry
                },
                {
                    "field_id": 13127547,
                    "field_value": description
                },
                {
                    "field_id": 13127554,
                    "field_value": `${affectedReleaseValue.value}`,
                },
                {
                    "field_id": 13127549,
                    "field_value": `${severityValue.value}`,
                },
                {
                    "field_id": 13127555,
                    "field_value": `${fixedReleaseValue.value}`,
                },
                {
                    "field_id": 13127551,
                    "field_value": `${priorityValue.value}`,
                },
                {
                    "field_id": 13127556,
                    "field_value": `${rootCauseValue.value}`,
                },
                {
                    "field_id": 13127550,
                    "field_value": `${moduleValue.value}`,
                },
                {
                    "field_id": 13127546,
                    "field_value": `${assignToValue.value}`,
                },
                {
                    "field_id": 13127557,
                    "field_value": `${statusValue.value}`,
                },
                {
                    "field_id": 13127558,
                    "field_value": `${typeValue.value}`,
                },
                {
                    "field_id": 13127559,
                    "field_value": `${targetReleaseValue.value}`,
                },
                {
                    "field_id": 13127560,
                    "field_value": `${reasonValue.value}`,
                },
                {
                    "field_id": 13127561,
                    "field_value": `${categoryValue.value}`,
                },
                {
                    "field_id": 13127562,
                    "field_value": `${handelTargetDate(targetDate)}`
                },
                {
                    "field_id": 13127563,
                    "field_value": closeDate != '' ? `${closeDate}:00.000Z` : ''
                },
                {
                    "field_id": 13209819,
                    "field_value": linkedId
                },
                {
                    "field_id": 13127564,
                    "field_value": environmentValue.value,
                },
                {
                    "field_id": 13209820,
                    "field_value": linkedSystem
                },
                {
                    "field_id": 13592322,
                    "field_value": `${applicationValue.value}`,
                },
                {
                    "field_id": 13738436,
                    "field_value": createdBy_UATnext_Only
                },
                {
                    "field_id": 13741220,
                    "field_value": `${non_QA_User_UATnext_OnlyValue.value}`,
                }
            ].filter(property => property && property.field_value !== '')
            
        }
        console.log(req)
        try {
            if (defectInfo == '') {
               const defectResponse= await axiosInstance.post('/project/130015/addDefect', req)
               const newDefect={
                id:defectResponse.data.id,
                pid:defectResponse.data.pid,
                summary:defectResponse.data.properties[0].field_value,
                status:defectResponse.data.properties[11].field_value_name,
                description:defectResponse.data.properties[1].field_value
            }
           // Cookies.set('defectDataId', JSON.stringify([...JSON.parse(Cookies.get('defectDataId')),defectResponse.data.id]))
           Cookies.get('defectData')!=undefined ? Cookies.set('defectData', JSON.stringify([...JSON.parse(Cookies.get('defectData')), newDefect])) : Cookies.set('defectData', JSON.stringify([newDefect]))
               console.log(defectResponse.data)
               nav('/TestExecutionDetails')
            } else {
               const defectInfoResponse= await axiosInstance.put(`/project/130015/updateDefect/${Cookies.get('defectId')}`, req)
               console.log(defectInfoResponse.data)
               Cookies.set('defectInfo', JSON.stringify(defectInfoResponse.data.properties))
               if(Cookies.get('defectData')!==undefined){
               const filterDefect= JSON.parse(Cookies.get('defectData')).filter((e)=>{
                    if(e.id==Cookies.get('defectId')){
                        e.status=statusValue.label
                        return e;
                    }else{
                        return e;
                    }
                })
                console.log(filterDefect)
                Cookies.set('defectData',JSON.stringify(filterDefect))
               }
               nav('/TestExecutionDetails')
            }
        } catch (err) {
            alert(err.response.data.error)
        }
    }
    return (
       
      <div className="flex-col  mt-12 text-slate-600" style={{backgroundColor:"#EFFFE8"}}>
         <div className='flex items-center gap-2 lg:gap-4 fixed bg-emerald-200 w-full z-30'>
              <img className='h-12 pl-10 py-2 mt-2' src={ladyBug} alt='Bug Icon' />
                <span className='text-xl font-bold'>New Defect</span>
               </div>
        <div className="grid grid-cols-4 mx-4 mt-16 py-2 gap-4">
          <div className="flex mb-4 items-center col-span-6">
            <label className="block text-slate-600 w-6/6">Summary</label>
            <input
              type="text"
              className="ml-2 flex-1 text-sm py-1 px-1 text-slate-600 block w-full rounded-md border  border-gray-300 outline-none ring-0 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50  shadow-sm"
              value={summry} onChange={(e) => setSummry(e.target.value)} />
          </div>

          <div className="col-span-4 grid grid-cols-4 gap-4">
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Submitter</label>
              <input type="text" className="ml-2 block w-2/3 text-sm py-1 px-1 text-slate-600 bg-gray-100 rounded-md border border-gray-300 outline-none ring-0  focus:ring-0 shadow-sm" readOnly={true} value={submitter.label} />
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Affected Release/Build</label>
              <select className="ml-2 block w-2/3 text-sm py-1 text-slate-600 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setAffectedReleaseValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={affectedReleaseValue.value} selected disabled hidden>{affectedReleaseValue.label}</option>
                {
                  affectedReleaseOption.map((element, index) => (
                    <option key={index} value={element.value}>{element.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Severity</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setSeverityValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={severityValue.value} selected disabled hidden>{severityValue.label}</option>
                {
                  severityOptions.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Fixed Release/Build</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setFixedReleaseValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={fixedReleaseValue.value} selected disabled hidden>{fixedReleaseValue.label}</option>
                {
                  fixedReleaseOption.map((element, index) => (
                    <option key={index} value={element.value}>{element.label}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="col-span-4 grid grid-cols-4 gap-4">
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Submitted Date</label>
              <input type="text" className="ml-2 block w-2/3 rounded-md text-sm py-1 px-1 text-slate-600 bg-gray-100 border border-gray-300 outline-none ring-0 focus:ring-0  shadow-sm" readOnly={true} value={submittedDate} />
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Priority</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setPriorityValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={priorityValue.value} selected disabled hidden>{priorityValue.label}</option>
                {
                  priorityOption.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Root Cause</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setRootCauseValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={rootCauseValue.value} selected disabled hidden>{rootCauseValue.label}</option>
                {
                  rootCauseOptions.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Module</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setModuleValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={moduleValue.value} selected disabled hidden>{moduleValue.label}</option>
                {
                  moduleOption.map((element, index) => (
                    <option key={index} value={element.value}>{element.label}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="col-span-4 grid grid-cols-4 gap-4">
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Assigned To</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setAssignToValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={assignToValue.value} selected disabled hidden>{assignToValue.label}</option>
                {
                  assignToOption.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Status</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setStatusValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={statusValue.value} selected disabled hidden>{statusValue.label}</option>
                {
                  statusOption.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Type</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setTypeValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={typeValue.value} selected disabled hidden>{typeValue.label}</option>
                {
                  typeOption.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Target Release/Build</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setAssignToValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={targetReleaseValue.value} selected disabled hidden>{targetReleaseValue.label}</option>
                {
                  targetReleaseOption.map((element, index) => (
                    <option key={index} value={element.value}>{element.label}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="col-span-4 grid grid-cols-4 gap-4">
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Reason</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50 shadow-sm" onChange={(e) => setReasonValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={reasonValue.value} selected disabled hidden>{reasonValue.label}</option>
                {
                  reasonOption.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Category</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:bg-white focus:border-cyan-300 focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setCategoryValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={categoryValue.value} selected disabled hidden>{categoryValue.label}</option>
                {
                  categoryOption.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Target Date</label>
              <input type="date" className="ml-2 block w-2/3 rounded-md text-sm py-1 px-1 text-slate-600 border border-gray-300 outline-none ring-0 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50 shadow-sm" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Closed Date</label>
              <input type="datetime-local" className="ml-2 block w-2/3 rounded-md text-sm py-1 px-1 text-slate-600 border border-gray-300 outline-none ring-0 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50 shadow-sm" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
            </div>
          </div>

          <div className="col-span-4 grid grid-cols-4 gap-4">
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Link ID</label>
              <input type="text" className="ml-2 block w-2/3 rounded-md text-sm py-1 px-1 text-slate-600 border border-gray-300 outline-none ring-0 ffocus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50 shadow-sm" onChange={(e) => setLinkedId(e.target.value)} />
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Environment</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50" onChange={(e) => setEnvironmentValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={environmentValue.value} selected disabled hidden>{environmentValue.label}</option>
                {
                  environmentOption.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Linked System</label>
              <input type="text" className="ml-2 block w-2/3 rounded-md text-sm py-1 px-1 text-slate-600 border border-gray-300 outline-none ring-0 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50 shadow-sm" value={linkedSystem} onChange={(e) => setLinkedSystem(e.target.value)} />
            </div>
            <div className="flex items-center col-span-1">
              <label className="block text-slate-600 w-1/3">Application</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50 border-gray-300 shadow-sm" onChange={(e) => setApplicationValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={applicationValue.value} selected disabled hidden>{applicationValue.label}</option>
                {
                  applicationOption.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="col-span-4 grid grid-cols-4 gap-4">
            <div className="flex items-center col-span-2">
              <label className="block text-slate-600 w-1/3">Created By (UATNext Only)</label>
              <input type="text" className="ml-2 block w-2/3 rounded-md text-sm py-1 px-1 text-slate-600 border border-gray-300 outline-none ring-0 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50 shadow-sm" onChange={(e) => setCreatedBy_UATnext_Only(e.target.value)} />
            </div>
            <div className="flex items-center col-span-2">
              <label className="block text-slate-600 w-1/3 inline-block">Non-QA User (UATNext Only)</label>
              <select className="ml-2 text-sm py-1 text-slate-600 block w-2/3 rounded-md border-gray-300 shadow-sm border border-1 border-slate-400 focus:border-cyan-300 focus:bg-white focus:border-1 outline-0 ring-0 focus:outline-0 hover:border-cyan-600 hover:bg-teal-50 shadow-sm" onChange={(e) => setNon_QA_User_UATnext_OnlyValue({ value: e.target.value, label: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text })}>
                <option value={non_QA_User_UATnext_OnlyValue.value} selected disabled hidden>{non_QA_User_UATnext_OnlyValue.label}</option>
                {
                  nonQaUserOption.map((e, i) => (
                    <option key={i} value={e.value}>{e.label}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="col-span-6">
            <div className="flex mb-4 items-center">
              <label className="block text-slate-600 w-6/6">Description</label>
              <textarea
                className="text-sm text-slate-600 ml-2 px-1 flex-1 block w-full rounded-md border border-slate-400 focus:outline-none dark:border-gray-300 dark:focus:ring-cyan-300 dark:focus:border-cyan-300 dark:focus:bg-white dark:hover:border-cyan-600 dark:hover:bg-teal-50 whitespace-nowrap shadow-sm"
                rows="4" value={description} onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="col-span-4 text-right">
            <button type="submit" className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md text-white bg-cyan-500 focus:ring-4 focus:ring-blue-300 dark:hover:bg-cyan-400 font-normal px-1 py-1 lg:font-medium text-sm lg:text-sm" onClick={handelSaveDefect}>SAVE</button>
          </div>
        </div>
      </div>

    )
}
export default Defect;