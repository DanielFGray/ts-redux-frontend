import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, postSelectors, categoriesSelector } from './Posts/postSlice'

export default function Layout({ children }: { children: JSX.Element }) {
  const dispatch = useDispatch()
  const categories = useSelector(categoriesSelector)
  const data = useSelector(postSelectors.selectAll)

  useEffect(() => {
    if (!data || !data.length) {
      dispatch(fetchPosts())
    }
  }, [data, dispatch])

  return (
    <>
      <header>
        <nav className="topnav">
          <NavLink to="/" exact activeClassName="active">
            home
          </NavLink>
          {categories.map(x => (
            <NavLink to={`/category/${x}`} activeClassName="active" key={x}>
              {x}
            </NavLink>
          ))}
          <NavLink to={`/projects`} activeClassName="active">
            projects
          </NavLink>
        </nav>
      </header>
      <main className="blog">{children}</main>
    </>
  )
}
