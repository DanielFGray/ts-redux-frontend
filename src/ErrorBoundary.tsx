import React from 'react'

interface P { children: JSX.Element, onError: React.FC<{ error: Error, reset: () => void }> }
interface S { error: null | Error }
export default class ErrorBoundary extends React.Component<P, S> {
  constructor(props: P) {
    super(props)
    this.state = { error: null }
    this.reset = this.reset.bind(this)
  }

  static getDerivedStateFromError(error: any) {
    return { error }
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
