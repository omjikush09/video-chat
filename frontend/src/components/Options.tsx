import React from 'react'

type Props ={
  children:JSX.Element
}

const Options = ({children}:Props) => {
  return (
    <div>
        Options
    {children}
    </div>
  )
}

export default Options