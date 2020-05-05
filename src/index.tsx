import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch as Routes,
  Route,
} from 'react-router-dom'
import { Provider, useSelector, useDispatch } from 'react-redux'
import List from './List'
import Item from './Item'
import 'normalize.css'
import './prism.css'
import './styles.css'
import Projects from './Projects'
import Layout from './Layout'
import store from './store'
import { fetchPosts, postSelectors } from './fetchPosts'
import ErrorBoundary from './ErrorBoundary'

export default function App() {
  const posts = useSelector(postSelectors.selectAll)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!posts || !posts.length) {
      dispatch(fetchPosts())
    }
  }, [posts, dispatch])

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/tags/:tag" render={() => <List />} />
          <Route path="/category/:category" render={() => <List />} />
          <Route path="/projects" render={() => <Projects />} />
          <Route path="/:id" render={() => <Item />} />
          <Route path="/" render={() => <List />} />
        </Routes>
      </Layout>
    </Router>
  )
}

function errorHandler({ error, reset }) {
  console.error(error)
  return (
    <>
      <h1>oops :(</h1>
      <div>Hopefully there's an error in the console</div>
      <div>
        <button onClick={() => reset}>reset</button>
      </div>
    </>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(
  <ErrorBoundary onError={errorHandler}>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>,
  rootElement,
)
