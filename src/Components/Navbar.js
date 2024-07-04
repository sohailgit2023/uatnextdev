import React, { useContext, useEffect, useState } from 'react';
import pursuitLogo from '../images/pursuit_logo(white).png'
import { Link, useLocation } from 'react-router-dom';
import { BiSolidFilePdf } from "react-icons/bi";
import { CgPlayButtonO } from "react-icons/cg";
import clsx from 'clsx';
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Context from '../Context/Context';
import Cookies from 'js-cookie';
const Navbar = () => {
  const { setSidebar, setHighlight, highlight, highlightAuthor ,setHighlightAuthor, setTestCaseId } = useContext(Context);
  const location = useLocation();
  const [action, setAction] = useState('/')
  const [isSideMenuOpen, setMenu] = useState(false);
  console.log('shanti')
  console.log(highlight)
  console.log(highlightAuthor)
  const link=[
    {
      name:'UATNext', pathName:'/'
    },
    {
      name:'Execute Test Case', pathName:'/ExecuteTestRun'
    },
    {
      name:'Autor UAT Test Cases', pathName:'/author-UAT-Test'
    }
  ]
  useEffect(() => {
    setAction(location.pathname.split('/')[1])
    console.log(location.pathname)
    Cookies.remove('TestCycleId_Or_TestSuiteId')
    console.log(location.pathname.split('/')[2])
    location.pathname.split('/')[2]!=undefined ? setTestCaseId(location.pathname.split('/')[2]) : setTestCaseId('')
    location.pathname.split('/')[2]!==undefined ? setHighlight(location.pathname.split('/')[2]) : setHighlight('')
    location.pathname.split('/')[2]!==undefined ? setHighlightAuthor(location.pathname.split('/')[2]) : setHighlightAuthor('')
  }, [location.pathname])

  return (
    <div className='flex fixed top-0 left-0 right-0 justify-between items-center h-12 w-full bg-cyan-500 z-50 shadow-md pr-4'>
      <div className='flex items-center gap-3'>
        <img className='h-12 bg-teal-800 p-2' src={pursuitLogo} alt='Pursuit Logo' />
        <Link to='/' className='text-sm sm:text-base lg:text-base font-bold text-white'>UATNext</Link>
        <div className='hidden lg:flex items-center gap-8 lg:ml-28'>
          {link.slice(1).map((e, i) => (
            <div key={i} className='flex flex-col items-center'>
              <Link to={e.pathName} className={`text-xs sm:text-sm lg:text-base ${action === e.pathName.split('/')[1] ? 'font-bold text-white' : 'text-white'}`} onClick={() => setHighlight('')}>{e.name}</Link>
              <div
    className={`h-1 ${action === e.pathName.split('/')[1] ? 'bg-yellow-500 absolute bottom-0' : 'bg-cyan-500'}`}
    style={{ width: action === e.pathName.split('/')[1] ? `${e.name.length * 8.5}px` : '0' }}
  ></div>

            </div>
          ))}
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <FiMenu
          onClick={() => { setMenu(true); setSidebar({ isSideMenuOpen }) }}
          className="text-xl sm:text-3xl cursor-pointer lg:hidden"
        />
        <CgPlayButtonO className='text-white text-xl sm:text-2xl lg:text-3xl text-yellow-500 bg-white p-1 rounded-full' />
        <BiSolidFilePdf className='text-white text-xl sm:text-3xl lg:text-4xl p-1 rounded-full' />
      </div>
      <div
        className={clsx(
          "fixed h-full w-screen lg:hidden top-0 right-0 -translate-x-full transition-all",
          isSideMenuOpen && "translate-x-0"
        )}
      >
        <section className="text-black bg-gradient-to-r from-cyan-600 to-cyan-400 flex-col absolute left-0 top-0 h-screen gap-1 z-50 w-full sm:w-56 flex">
          <div className='flex justify-between items-center ml-6 mr-6 mt-3'>
            <div className='flex items-center gap-1'>
              <div className='flex justify-center items-center h-12 w-12 rounded-full bg-slate-300'>
                <span>RS</span>
              </div>
              <span className='text-sm font-normal text-white'>Rakesh Shaw</span>
            </div>
            <IoCloseOutline
              onClick={() => { setMenu(false); setSidebar({ isSideMenuOpen }) }}
              className="mt-0 text-xl sm:p-1 sm:text-3xl cursor-pointer"
            />
          </div>
          <div className='h-0.5 rounded-full w-full bg-emerald-100'></div>
          <div className='flex flex-col justify-center items-center gap-1 ml-3 mr-3 mt-2'>
            {link.map((e, i) => (
              <div key={i} className={`flex justify-left w-full py-2 rounded pl-4 ${action === e.pathName.split('/')[1] ? 'bg-emerald-100 text-black' : 'text-white'}`}>
                <Link to={e.pathName} className='text-sm sm:text-base lg:text-base font-medium' onClick={() => { setMenu(false); setSidebar({ isSideMenuOpen: true }); setHighlight('') }}>{e.name}</Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Navbar;
