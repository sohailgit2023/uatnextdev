import { useState, useSyncExternalStore } from "react";
import Context from "./Context";
const ContextProvider =({children})=>{
    const [sidebar, setSidebar]=useState({isSideMenuOpen:true})
    const [highlight, setHighlight]=useState('')
    const [highlightAuthor, setHighlightAuthor]=useState('')
    const [testCaseId, setTestCaseId]=useState('')
    const [testCycleId_Or_testSuiteId]=useState('')
    const [teamOption, setTeamOption]=useState([])
    const [isTureTestCaseName, setIsTrueTestCaseName] = useState('')
    const [isTureTestStepName, setIsTrueTestStepName] = useState('')
    const [isTureDescription, setIsTrueDescription] = useState('')
    const [isTurePreCondition, setIsTruePreCondition] = useState('')
    const [countTestCaseSave, setCountTestCaseSave]=useState(0)
    return(
        <Context.Provider value={{
            sidebar, setSidebar,
            highlight, setHighlight,
            highlightAuthor, setHighlightAuthor,
            testCycleId_Or_testSuiteId,
            teamOption, setTeamOption,
            isTureTestCaseName, setIsTrueTestCaseName,
            isTureTestStepName, setIsTrueTestStepName,
            isTureDescription, setIsTrueDescription,
            isTurePreCondition, setIsTruePreCondition,
            countTestCaseSave, setCountTestCaseSave,
            testCaseId, setTestCaseId


            }}>
            {children}
        </Context.Provider>
    )
}
export default ContextProvider;