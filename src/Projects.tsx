import React, { useEffect } from 'react'
import { projectSelectors, fetchProjects } from './fetchProjects'
import { useSelector, useDispatch } from 'react-redux'
import ago from 's-ago'
import Linkify from './Linkify'

export default function Projects() {
  const dispatch = useDispatch()
  const data = useSelector(projectSelectors.selectAll)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [])

  return (
    <div className="projects">
      {data.map(e => {
        const [branch] = e.branches ?? []
        const dateObj = branch ? new Date(branch.committedDate) : {}

        return (
          <div className="project" key={e.url}>
            {e.language && <div className="language">{e.language}</div>}
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
                {branch.message}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
