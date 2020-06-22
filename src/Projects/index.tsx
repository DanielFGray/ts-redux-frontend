import React, { useEffect, useState } from 'react'
import { projectSelectors, fetchProjects } from './projectSlice'
import { useSelector, useDispatch } from 'react-redux'
import ago from 's-ago'
import Linkify from '../Linkify'

export default function Projects() {
  const dispatch = useDispatch()
  const data = useSelector(projectSelectors.selectAll)
  const [filter, filter$] = useState<string | null>(null)
  const [sort, sort$] = useState<string | null>('date')

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const toggleFilter = (language: string) => filter$(filter === language ? null : language)
  const changeSort = (label: string) => sort$(label)

  const list = data
    .filter(e => {
      if (filter && filter !== e.language) return false
      return true
    })
    .sort((a, b) => {
      const fn = x => x[sort === 'stars' ? 'stars' : 'updated']
      const aa = fn(a)
      const bb = fn(b)
      return aa > bb ? -1 : aa < bb ? 1 : 0
    })

  return (
    <div className="projects">
      <div className="controls">
        {filter && (
          <>
            {`filtered by ${filter}`}
            <button className="reset" onClick={() => filter$(null)}>
              X
            </button>
          </>
        )}
        {' sort:'}
        <button
          className={sort === 'date' ? 'active' : undefined}
          onClick={() => changeSort('date')}
        >
          date
        </button>
        <button
          className={sort === 'stars' ? 'active' : undefined}
          onClick={() => changeSort('stars')}
        >
          stars
        </button>
      </div>
      {list.map(e => {
        const [branch] = e.branches ?? []
        const dateObj = new Date(branch ? branch.committedDate : e.updated)
        return (
          <div className="project" key={e.url}>
            {e.language && (
              <button className={`language ${filter === e.language ? 'active' : ''}`} onClick={() => toggleFilter(e.language)}>
                {e.language}
              </button>
            )}
            <div className="title"><a href={e.url} target="_blank" rel="noopener noreferrer">{e.name}</a></div>
            {e.description && <div className="description">{Linkify(e.description)}</div>}
            {branch && (
              <div className="branchinfo">
                {'committed '}
                <a title={dateObj.toLocaleString()}>
                  {ago(dateObj)}
                </a>
                {' on '}
                {branch.name}
                {': '}
                <a href={branch.commitUrl} className="message" target="_blank" rel="noopener noreferrer">{branch.message}</a>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
