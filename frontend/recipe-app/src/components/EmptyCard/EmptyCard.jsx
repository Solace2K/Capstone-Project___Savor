import React from 'react'

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <button
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <img src={imgSrc} alt="No Recipes" className="w-60" />
      </button>

      <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-700 mt-5">
        {message}
      </p>
    </div>
  )
}

export default EmptyCard
