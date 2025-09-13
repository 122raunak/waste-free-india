import React from 'react'

const Icons = ({ icon: Icon, title }) => {
  return (
    <div className="flex flex-col items-center">
      <Icon className="w-6 h-6" />   
      <h3 className="text-base font-sm text-center">{title}</h3>
    </div>
  );
};

export default Icons