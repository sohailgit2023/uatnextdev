import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../Navbar";
import UATNext from "../Pages/UAT-Next/UATNext";
import Context from "../../Context/Context";
import Execute_Test_Run_Sidebar from "../Pages/Execute-Test-Run/Execute_Test_Run_Sidebar";
import Execute_Test_Run from "../Pages/Execute-Test-Run/Execute_Test_Run";
import UAT_Test_Execution_Details from "../Pages/Execute-Test-Run/UAT_Test_Execution_Details";
import Defect from "../Pages/Execute-Test-Run/Defect";
import Review_UAT_Test_Cases_Sidebar from "../Pages/Author-UAT-Test-Case/Review_SIT_Test_Cases_Sidebar";
import Author_UAT_Test_Case from "../Pages/Author-UAT-Test-Case/Author_UAT_Test_Case";
import CreateTestCaseTable from "../Pages/Author-UAT-Test-Case/TestCaseTabel/CreateTestCaseTabel";
import TestCaseDetails from "../Pages/Author-UAT-Test-Case/TestCaseDetails";

const ParentRoute = () => {
    const { highlight, highlightAuthor, testCaseId } = useContext(Context);
    console.log(highlight)
    //console.log(Cookies.get('hello'))
    return (
        <div className="flex flex-col">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<UATNext />} />
                    <Route path="/author-UAT-Test" element={<Review_UAT_Test_Cases_Sidebar />}>
                        <Route path={`${highlightAuthor}`} element={<Author_UAT_Test_Case />}>
                            <Route path="CreateTestCase" element={<CreateTestCaseTable />} />
                        </Route>
                    </Route>
                    <Route path={`/testCaseDetails/${testCaseId}`} element={<TestCaseDetails/>}/>


                    <Route path="/ExecuteTestRun" element={<Execute_Test_Run_Sidebar />}>
                        <Route path={`${highlight}`} element={<Execute_Test_Run />} />
                    </Route>
                    <Route path={`/TestExecutionDetails`} element={<UAT_Test_Execution_Details />} />
                    <Route path="/defect" element={<Defect />} />

                </Routes>
            </Router>
        </div>
    )
}
export default ParentRoute;