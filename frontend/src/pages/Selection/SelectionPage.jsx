import React from 'react'
import Button from '../../Components/Button/Button'

const SelectionPage = () => {
  return (
    <>
        <div className='min-h-[100] flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center justify-center mb-20'>
                <h1 className='font-extrabold text-4xl'>Welcome!</h1>
                <h3 className='text-xl'>Select your account type to continue</h3>
            </div>
            <div className='flex flex-col gap-6 justify-center w-full'>
                <Button text="Scrap Seller" link="/user/login" className=''/>
                <Button text="Scrap Buyer" link="/seller/login" className='bg-[#2196F3]'/>
            </div>
            
        </div>
    </>
    
  )
}

export default SelectionPage