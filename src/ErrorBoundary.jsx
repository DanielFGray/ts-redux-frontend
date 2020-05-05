import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
    this.reset = this.reset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (this.props.didCatch) {
      this.props.didCatch({ error, info })
    }
  }

  reset() {
    console.log('resetting state')
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { onError, children } = this.props
    if (typeof onError !== 'function') {
      throw new Error('missing onError handler')
    }
    if (error) {
      return onError({ error, reset: this.reset })
    }
    return children
  }
}
