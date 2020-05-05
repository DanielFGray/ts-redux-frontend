import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { categoriesSelector } from './fetchPosts'

export default function Layout({ children }) {
  const categories = useSelector(categoriesSelector)
  return (
    <div className="blog">
      <nav className="topnav">
        <NavLink exact to="/">
          home
        </NavLink>
        {categories
          .map(x => (
            <NavLink key={x} to={`/category/${x}`} activeClassName="active">
              {x}
            </NavLink>
          ))
          .concat(
            <NavLink key="projects" to={`/projects`} activeClassName="active">
              projects
            </NavLink>,
          )}
      </nav>
      {children}
    </div>
  )
}
