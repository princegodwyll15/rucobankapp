import React from 'react'

const Homecard = ({children}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto w-full mt-10">
      {children}
    </div>
  )
}

export default Homecard
