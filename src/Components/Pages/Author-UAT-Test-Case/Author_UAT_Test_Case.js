import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import { RotatingLines } from 'react-loader-spinner';
import { Outlet, useNavigate } from 'react-router-dom';
import Context from '../../../Context/Context';
import axiosInstance from '../../../utils';
import Cookies from 'js-cookie';
import { RiDeleteBin6Line } from "react-icons/ri";
const Author_UAT_Test_Case = () => {
    const { highlightAuthor, setIsTrueDescription, setIsTruePreCondition, setIsTrueTestCaseName, countTestCaseSave, setCountTestCaseSave, setTestCaseId } = useContext(Context)
    const nav = useNavigate()
    const [existingTestCase, setExistingTestCase] = useState([])
    const [isProcessing, setIsProcessing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [requirementInfo, setRequirenmentInfo] = useState('')
    const [expandedCell, setExpandedCell] = useState(null);
    const columns = [
        {
            name: 'Test Case ID',
            selector: row => row.id,
            selector: row => row.pid,
            style: {
                color: 'blue',
            },
            cell: (row) => <div className='cursor-pointer hover:underline' onClick={() => handelNavigatetestCaseDetails(row)}>{row.pid}</div>,
            width: "105px",
            maxWidth: 'auto',
        },

        {
            name: 'Name',
            selector: row => row.name,
            cell: (row) => (
                <div
                    className={`cell-with-multiline-text ${expandedCell === row.id ? 'overflow-auto' : ''}`}
                    onClick={() => handleCellClick(row.id)}
                >
                    <span>{row.name}</span>
                </div>
            ),
            width: "200px",
            maxWidth: 'auto',
        },
        {
            name: 'Description',
            selector: row => row.properties,
            // cell: (row) => {
            //     return <div>
            //         {
            //             row.properties.filter((e) => e && e.field_name == 'Description')[0].field_value
            //         }

            //     </div>
            // }
            cell: (row) => (
                <div
                    className={`cell-with-multiline-text ${expandedCell === row.id ? 'overflow-auto' : ''}`}
                    onClick={() => handleCellClick(row.id)}
                >
                    <span>{row.properties.filter((e) => e && e.field_name == 'Description')[0].field_value}</span>
                </div>
            ),
            width: "210px",
            maxWidth: 'auto',
        },
        {
            name: 'Status',
            selector: row => row.properties,
            cell: (row) => {
                return <div>
                    {
                        row.properties.filter((e) => e && e.field_name == 'Status')[0].field_value_name
                    }

                </div>
            },
            width: "97px",
            maxWidth: 'auto',
        },
        {
            name: 'Priority',
            selector: row => row.properties,
            cell: (row) => {
                return <div>
                    {
                        row.properties.filter((e) => e && e.field_name == 'Priority')[0].field_value_name
                    }

                </div>
            },
            width: "80px",
            maxWidth: 'auto',
        },
        {
            name: 'Test Step',
            selector: row => row.testStepsCount,
            width: "90px",
            maxWidth: 'auto',
        },
        {
            name: 'AssignTo',
            selector: row => row.properties,
            cell: (row) => {
                return <div>
                    {
                        row.properties.filter((e) => e && e.field_name == 'Assigned To')[0].field_value_name.replace(/[\[\]]/g, '')
                    }
                </div>
            },
            width: "130px",
            maxWidth: 'auto',
        },
        {
            name: 'Action',
            cell: (row, index) => {
                return <div>
                    <RiDeleteBin6Line className='text-xl text-red-500 cursor-pointer' title='Delete' onClick={()=>handelUnlink(row, index)}/>
                </div>
            },
            width: "75px",
            maxWidth: 'auto',
        },

    ];
    const customStyle = {
        headRow: {
            style: {
                //minHeight: '45px',
                backgroundColor: '#EFFFE8',
                color: "black",
                // maxWidth: "500px"
                position: 'sticky',
            }
        },
        headCells: {
            style: {
                fontSize: '12px',
                fontWeight: '600',
                TextTransform: 'uppercase',
                margin: "0px",
                position: 'sticky',
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

    const handleCellClick = (cellId) => {
        if (expandedCell === cellId) {
            setExpandedCell(null); // Collapse if already expanded
        } else {
            setExpandedCell(cellId); // Expand the clicked cell
        }
    };

    const handelUnlink=async(row, index)=>{
        const testCase=[...existingTestCase]
        testCase.splice(index, 1)
        setExistingTestCase([])
        setTimeout(()=>{
            setExistingTestCase(testCase)
        },1)
        try{
            await axiosInstance.delete(`/project/130015/requirements/${highlightAuthor}/test-cases/unlink`,{data:[row.id]})
        }catch(err){
            console.log(err)
        }
    }
    console.log('rakesh...............')
    const handelNavigatetestCaseDetails = (row) => {
        Cookies.set('requirementId',highlightAuthor)
        setTestCaseId(row.id)
        nav(`/testCaseDetails/${row.id}`)
    }
    console.log('108==>...')
    const handelFetchRequirenmentInfo = async (requirenmentId) => {
        console.log('126............=>', requirenmentId)
        try {
            const requirenmentResponse = await axiosInstance.get(`/requirement/project/130015/requirement/${requirenmentId}`)
            console.log(requirenmentResponse.data)
            setRequirenmentInfo(requirenmentResponse.data.requirement)
            requirenmentResponse.data.linkedTestCases[0].objects.length != 0 ? setExistingTestCase(requirenmentResponse.data.linkedTestCases[0].objects) : setExistingTestCase([])
        } catch (err) {
            setErrorText(err.message);
            setIsError(true)
            console.log(err)
        } finally {
            setIsProcessing(false)
        }
    }
    console.log('128==>', existingTestCase)
    useEffect(() => {
        if (highlightAuthor !== '') {
            setIsProcessing(true)
            handelFetchRequirenmentInfo(highlightAuthor)
        } else {
            setExistingTestCase([])
        }
    }, [highlightAuthor, countTestCaseSave])
    const handelExpandRowCellOff = () => {
        setIsTrueTestCaseName('')
        setIsTrueDescription('')
        setIsTruePreCondition('')
    }
console.log('......')
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
                                    <div className="flex flex-col mt-5">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mx-2 sm:mx-2" onClick={handelExpandRowCellOff}>
                                        <span className="font-semibold text-xs md:text-sm">Requirement</span>
                                        <span className="text-xs md:text-sm truncate">{requirementInfo !== '' && requirementInfo.pid}</span>
                                        <span className="font-semibold text-xs md:text-sm">Module</span>
                                        <span className="text-xs md:text-sm truncate">UAT Next DEV</span>
                                        <span className="font-semibold text-xs md:text-sm">Title</span>
                                        <span className="text-xs md:text-sm truncate">{requirementInfo !== '' && requirementInfo.name}</span>
                                        <span className="font-semibold text-xs md:text-sm">Description</span>
                                        <span className="text-xs md:text-sm truncate">{requirementInfo !== '' && requirementInfo.properties[8].field_value}</span>
                                        <span className="font-semibold text-xs md:text-sm whitespace-nowrap">Linkned System</span>
                                        <span className="text-xs md:text-sm truncate">{requirementInfo !== '' && requirementInfo.properties[5].field_value}</span>
                                        <span className="font-semibold text-xs md:text-sm">Link Id</span>
                                        <span className="text-xs md:text-sm truncate">{requirementInfo !== '' && requirementInfo.properties[4].field_value}</span>
                                    </div>
                                    <div className="mt-3 mx-2 sm:mx-2" onClick={handelExpandRowCellOff}>
                                        <span className="font-semibold text-xs md:text-sm">Existing Test Cases</span>
                                    </div>
                                    <div className="px-1 sm:py-1 sm:px-2 sm:py-2 mt-2 lg:mt-0 overflow-auto" onClick={handelExpandRowCellOff}>

                                        <DataTable
                                            columns={columns}
                                            data={existingTestCase}
                                            pagination
                                            paginationPerPage={5}
                                            paginationRowsPerPageOptions={[4, 5, 6, 7, 10]}
                                            highlightOnHover
                                            customStyles={customStyle}

                                        />

                                    </div>
                                    <Outlet />

                                </div>
                                )
                        }
                    </>
            }
        </>
    )
}
export default Author_UAT_Test_Case;