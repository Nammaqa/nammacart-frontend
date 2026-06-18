import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>Discover delicious meals from top restaurants, freshly prepared and delivered straight to your doorstep with fast and reliable service.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  )
}

export default Header