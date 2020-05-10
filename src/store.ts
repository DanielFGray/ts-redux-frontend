import { combineReducers, configureStore } from '@reduxjs/toolkit'
import posts from './Posts/postSlice'
import projects from './Projects/projectSlice'

export const reducer = combineReducers({
  posts: posts.reducer,
  projects: projects.reducer,
})

export const store = configureStore({
  reducer,
})

export type RootState = ReturnType<typeof store.getState>
export default store
