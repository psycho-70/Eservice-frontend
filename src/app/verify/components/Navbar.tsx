import React from 'react'

const Navbar = () => {
  return (
     <header className="bg-white shadow-sm">
        <div className="max-w-[1500px] h-[100px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-center md:justify-between items-center">
            <img src="./logo-new.svg" className=' w-[150px] h-[70px]'  alt="" />
            <img src="./vision-SA.svg" className='  w-[150px]  md:block hidden h-[70px]'alt="" />
        </div>
      </header>
  )
}

export default Navbar
