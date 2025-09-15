import React from 'react'
import WasteItem from '../../../components/WasteItem/WasteItem'
import paper from "../../../../public/Found/newspaper.png"
import profile from "../../../../public/Profile/profile.png"

const Found = () => {
  return (
    <>
        <div className='min-h-[full] w-full flex flex-col items-center justify-center mt-2 py-[10px] px-[20px]'>
            <WasteItem 
                item={{
                    id: 1,
                    type: "Paper",
                    quantity: 30,
                    weight: "5KG",
                    price: 500,
                    imageSrc: paper,
                    title: "Newspaper"
                }} 
                showLearnMore={false}
            />

           <div className=" px-4 py-3 w-full text-center font-sans">
                <p className="font-semibold">A buyer has been found.</p>
                <p>He will contact you soon to purchase your waste material.</p>
            </div>

            

        </div>
    </>
  )
}

export default Found