import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ago from 's-ago'
import { Post, postSelectors, fetchPostContent } from './postSlice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'

export default function Item() {
  const params = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const data = useSelector((state: RootState) =>
    postSelectors.selectById(state, params.id),
  )

  useEffect(() => {
    if (!data || !data.content) {
      // @ts-ignore
      dispatch(fetchPostContent(params.id))
    }
  }, [data, params.id])

  if (!data) return null
  return <BlogItem data={data} expand />
}

export function BlogItem({ data, expand }: { data: Post; expand?: boolean }) {
  if (!data) return null
  const dateObj = new Date(data.date)
  return (
    <div className="blogitem">
      {data.title && (
        <div className="title">
          <Link to={`/${data.id}`}>{data.title}</Link>
        </div>
      )}
      <div className="meta">
        {data.category && (
          <div className="category">
            category:{' '}
            <Link to={`/category/${data.category}`}>{data.category}</Link>
          </div>
        )}
        {data.tags && data.tags.length > 0 && (
          <ul className="blogtaglist">
            {'tagged: '}
            {data.tags.map(e => (
              <li key={e} className="tag">
                <Link to={`/tags/${e}`}>{e}</Link>
              </li>
            ))}
          </ul>
        )}
        {data.date && (
          <div className="date">
            <a title={dateObj.toLocaleDateString()}>{ago(dateObj)}</a>
          </div>
        )}
        {data.words && data.readTime && (
          <div className="readtime">
            <a title={`${data.words} words`}>{data.readTime}</a>
          </div>
        )}
      </div>
      {expand && data.content ? (
        <article
          className="content"
          dangerouslySetInnerHTML={{
            __html: data.content,
          }}
        />
      ) : data.excerpt ? (
        <article className="content">{data.excerpt}</article>
      ) : null}
    </div>
  )
}
