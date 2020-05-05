import { combineReducers, configureStore } from '@reduxjs/toolkit'
import posts from './fetchPosts'
import projects from './fetchProjects'

export const reducer = combineReducers({
  posts: posts.reducer,
  projects: projects.reducer,
})

export const store = configureStore({
  reducer,
})

export type RootState = ReturnType<typeof store.getState>
export default store
