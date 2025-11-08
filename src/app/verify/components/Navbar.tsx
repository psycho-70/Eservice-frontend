import React from 'react'

const Navbar = () => {
  return (
     <header className="bg-white shadow-sm">
        <div className="max-w-7xl h-[100px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <img src="./logo-new.svg" className=' w-[150px] h-[70px]'  alt="" />
            <img src="./vision-SA.svg" className='  w-[150px] h-[70px]'alt="" />
        </div>
      </header>
  )
}

export default Navbar
