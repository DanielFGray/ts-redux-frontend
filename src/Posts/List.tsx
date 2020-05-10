import React from 'react'
//import { MagicMotion, motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BlogItem } from './Item'
import { postSelectors } from './postSlice'

export default function List() {
  const { tag, category } = useParams()
  let data = useSelector(postSelectors.selectAll)

  if (tag) {
    data = data.filter(x => x.tags.includes(tag))
  }
  if (category) {
    data = data.filter(x => x.category === category)
  }

  return (
    <div className="bloglist">
      {data && data.map(x => <BlogItem key={x.id} data={x} />)}
    </div>
  )
}
