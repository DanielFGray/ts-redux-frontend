import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { RootState } from '../store'
import { fold } from 'fp-ts/lib/Either'
import * as t from 'io-ts'

const Branch = t.type({
  name: t.string,
  committedDate: t.number,
  commitUrl: t.string,
  message: t.string,
})
type Branch = t.TypeOf<typeof Branch>

const Project = t.type({
  name: t.string,
  url: t.string,
  description: t.union([t.null, t.string]),
  language: t.union([t.undefined, t.null, t.string]),
  updated: t.number,
  stars: t.number,
  forks: t.number,
  issues: t.union([t.null, t.number]),
  branches: t.union([t.null, t.array(Branch)]),
})

export type Project = t.TypeOf<typeof Project>

export const fetchProjects = createAsyncThunk('fetch/projects', async () =>
  fetch('https://dfg.rocks/graphql', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          GitActivity {
            name
            description
            url
            updated
            stars
            issues
            forks
            language
            branches {
              name
              committedDate
              commitUrl
              message
            }
          }
        }`,
    }),
  })
    .then(x => x.json())
    .then(x => t.array(Project).decode(x.data.GitActivity))
    .then(fold(x => [], x => x)),
)

const projectsAdapter = createEntityAdapter<Project>({
  selectId: x => x.name,
  sortComparer: x => {
    if (x.branches) {
      return x.branches[0].committedDate
    }
    return x.updated
  },
})

export const projectSelectors = projectsAdapter.getSelectors(
  (state: RootState) => state.projects,
)

const projects = createSlice({
  name: 'projects',
  initialState: projectsAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: build => {
    build.addCase(fetchProjects.pending, (state, action) => {
      state.loading = true
    })
    build.addCase(fetchProjects.fulfilled, (state, action) => {
      state.loading = false
      projectsAdapter.setAll(state, action.payload)
    })
    build.addCase(fetchProjects.rejected, (state, action) => {
      state.loading = false
      // @ts-ignore
      state.error = action.payload
    })
  },
})
export default projects
