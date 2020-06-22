import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch as Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import List from './Posts/List'
import Item from './Posts/Item'
import 'normalize.css'
import './prism.css'
import './styles.css'
import Projects from './Projects'
import Layout from './Layout'
import store from './store'
import ErrorBoundary from './ErrorBoundary'

function errorHandler({ error, reset }: { error: Error, reset: () => void }) {
  console.error(error)
  return (
    <div className="error">
      <h1>oops :(</h1>
      <div>Hopefully there's an error in the console</div>
      <button onClick={() => reset()}>reset</button>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary onError={errorHandler}>
      <Provider store={store}>
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
      </Provider>
    </ErrorBoundary>
  )
}

if (document) {
  const rootElement = document.getElementById('root')
  ReactDOM.render(<App />, rootElement)
}
