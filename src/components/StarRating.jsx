import React from 'react'

export default function StarRating({ value=0, onChange=()=>{}, readOnly=false, size=24 }){
  const [hover, setHover] = React.useState(0)
  const display = hover || value
  const stars = [1,2,3,4,5]
  return (
    <div className="flex items-center gap-1">
      {stars.map(n=>{
        const filled = display >= n
        return (
          <svg key={n}
            onMouseEnter={()=>!readOnly && setHover(n)}
            onMouseLeave={()=>!readOnly && setHover(0)}
            onClick={()=>!readOnly && onChange(n)}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            width={size} height={size}
            className={filled ? "fill-yellow-400" : "fill-gray-300 cursor-pointer"}>
            <path d="M12 .587l3.668 7.431L24 9.75l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.598 0 9.75l8.332-1.732z"/>
          </svg>
        )
      })}
    </div>
  )
}
