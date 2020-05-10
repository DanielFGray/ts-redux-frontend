import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { categoriesSelector, fetchPosts, postSelectors } from './Posts/postSlice'

export default function Layout({ children }: { children: JSX.Element }) {
  const categories = useSelector(categoriesSelector)
  const posts = useSelector(postSelectors.selectAll)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!posts || !posts.length) {
      dispatch(fetchPosts())
    }
  }, [posts, dispatch])
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
