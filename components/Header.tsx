import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header className='flex justify-between px-4 max-w-7xl mx-auto'>
        <aside className='flex items-center space-x-5'>
            <Link href="/">
                <img 
                    className='w-44 object-contain cursor-pointer'
                    src="https://links.papareact.com/yvf" 
                    alt="wd" 
                />
            </Link>
            <div className='hidden md:inline-flex items-center space-x-5'>
                <h3>About</h3>
                <h3>Contact</h3>
                <h3 className='text-white bg-green-600 px-4 rounded-full'>Follow</h3>
            </div>
        </aside>
        <aside className='flex items-center space-x-5 text-green-600'>
            <h3>Sign In</h3>
            <h3 className='border px-4 py-1 rounded-full border-green-600'>Get started</h3>
        </aside>
    </header>
  )
}

export default Header