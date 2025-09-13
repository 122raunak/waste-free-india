import React from 'react'

const ScrapCard = ({image , title}) => {
  return (
    <div className="flex-shrink-0 w-[140px] flex flex-col items-center justify-center border rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer bg-white">
      <h3 className="text-base font-medium text-center">{title}</h3>
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-contain mb-3"
      />
    </div>
  )
}

export default ScrapCard