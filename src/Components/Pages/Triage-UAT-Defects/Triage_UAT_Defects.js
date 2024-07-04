import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';
import Select from 'react-select';
import Context from "../../../Context/Context";
import { FaGreaterThan } from "react-icons/fa6";
import Cookies from "js-cookie";
const Triage_UAT_Defects = () => {
    const { sidebar } = useContext(Context);
    const [apiData, setApiData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const options = [
        { value: 'active', label: 'active' },
        { value: 'inactive', label: 'inactive' }
    ];
    const selectStyle = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? 'none' : 'none',
            backgroundColor: "white"
        }),
    }
    const columns = [
        {
            name: 'Test Run ID',
            selector: row => row.id,
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Test Case ID',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Assigned To',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Priority',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Planned Start Date',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Planned End Date',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Action',
            selector: row => row.name,
            sortable: true,
        },

    ];
    const customStyle = {
        headRow: {
            style: {
                minHeight: '45px',
                backgroundColor: '#EFFFE8',
                color: "black"
            }
        },
        headCell: {
            style: {
                fontSize: '16px',
                fontWeight: '600',
                TextTransform: 'uppercase'
            }
        },
        cells: {
            style: {
                fontSize: '12px',

            }
        },
        rows: {
            style: {
                zIndex: 2,
                minHeight: '40px !important', // override the row height
                fontSize: '14px',
                whiteSpace: 'pre',
            },
        },
        subHeader: {
            style: {
                minHeight: '40px',
            },
        },

    }
    const handleDataFetch = () => {
        setIsProcessing(true)
        axios
            .get('https://timesheet-application-9xly.onrender.com/client')
            .then((res) => {
                console.log('Data Process Successfuly');
                console.log(res);
                console.log(res.data.data);
                console.log(res.data);
                setApiData(res.data.data)
            })
            .catch((err) => {
                console.log('Data Process Error');
                console.log(err)
                setErrorText(err.message);
                setIsError(true)
            })
            .finally(() => setIsProcessing(false))
    }
    useEffect(() => {
        setIsProcessing(true);
        handleDataFetch()
    }, [])
    return (
        <div className={`flex flex-col h-screen ${sidebar.isSideMenuOpen===false && 'invisible'}`}>
            <div className="flex justify-between m-4">
                <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                    <span className="text-base font-medium">Project</span>
                    <FaGreaterThan className="text-sm mt-0.5" />
                </div>
                <span className="text-sm ">UAT Next DEV</span>
                </div>
                <div className="flex">
                <button type="button" className="text-white bg-cyan-500 focus:ring-4 focus:ring-blue-300 font-normal lg:font-medium text-xs lg:text-sm px-2 py-1 lg:px-8 lg:py-2 sm:me-1 lg:me-2 rounded ">Refresh</button>
                </div>

            </div>
            <DataTable
                columns={columns}
                data={apiData}
                pagination
                paginationPerPage={3}
                paginationRowsPerPageOptions={[3, 4]}
                highlightOnHover
                customStyles={customStyle}

            />
            <div className="flex gap-2 justify-end mt-8 mb-4 mr-4">
            <button type="button" className="text-white bg-cyan-500 focus:ring-4 focus:ring-blue-300 font-normal lg:font-medium text-xs lg:text-sm px-2 py-1 lg:px-8 lg:py-2 sm:me-1 lg:me-2 ">SAVE</button>
            </div>

        </div>
    )
}
export default Triage_UAT_Defects;