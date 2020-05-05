import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'
import * as t from 'io-ts'
import { RootState } from './store'
import { fold } from 'fp-ts/lib/Either'
import { draw } from 'io-ts/lib/Tree'

const Post = t.type({
  id: t.string,
  title: t.string,
  category: t.string,
  tags: t.array(t.string),
  date: t.number,
  readTime: t.string,
  words: t.number,
  excerpt: t.string,
  content: t.union([t.undefined, t.string]),
})

export type Post = t.TypeOf<typeof Post>

export const fetchPosts = createAsyncThunk('fetch/posts', async () =>
  fetch('https://dfg.rocks/graphql', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          BlogList {
            id
            title
            tags
            category
            date
            readTime
            words
            excerpt
          }
        }`,
    }),
  })
    .then(x => x.json())
    .then(x => t.array(Post).decode(x.data.BlogList))
    .then(
      fold(
        x => {
          console.log(draw(x))
          return []
        },
        x => x,
      ),
    ),
)

export const fetchPostContent = createAsyncThunk(
  'fetch/postcontent',
  async id =>
    fetch('https://dfg.rocks/graphql', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        variables: {
          id,
        },
        query: `
        query($id: String!) {
          BlogPost(id: $id) {
            id
            content
          }
        }`,
      }),
    })
      .then(x => x.json())
      .then(x => {
        const { id, content } = x.data.BlogPost
        return {
          id,
          changes: { content },
        }
      }),
)

const postsAdapter = createEntityAdapter<Post>({
  selectId: x => x.id,
  sortComparer: (a, b) => b.date - a.date,
})

export const postSelectors = postsAdapter.getSelectors(
  (state: RootState) => state.posts,
)

export const categoriesSelector = createSelector(
  [postSelectors.selectAll],
  posts => Array.from(new Set(posts.map(x => x.category))),
)

const posts = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: build => {
    build.addCase(fetchPosts.pending, (state, action) => {
      state.loading = true
    })
    build.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false
      postsAdapter.setAll(state, action.payload)
    })
    build.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    build.addCase(fetchPostContent.pending, (state, action) => {
      state.loading = true
    })
    build.addCase(fetchPostContent.fulfilled, (state, action) => {
      state.loading = false
      postsAdapter.updateOne(state, action.payload)
    })
    build.addCase(fetchPostContent.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  },
})
export default posts
