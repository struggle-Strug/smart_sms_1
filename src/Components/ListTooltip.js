import React from 'react';

const ListTooltip = ({data}) => {
  return (
    <div className="relative inline-block">
      <div className="absolute left-5 -top-2 w-3 h-3 bg-white transform rotate-45 shadow-lg"></div>
      <div className="bg-white shadow-lg rounded-lg p-4 w-60">
        <div className="flex flex-col space-y-2">
          {
            data.map((value, index) => (
              <div className="p-2 hover:bg-gray-100 hover:cursor-pointer">{value.name_primary}</div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ListTooltip;