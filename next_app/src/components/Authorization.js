import React, { Component } from 'react';
import Router from "next/router";
import { auth, noAuth } from '../utils/auth'

const getDisplayName = Component =>
  Component.displayName || Component.name || 'Component'

export const withAuth = WrappedComponent =>
  class extends Component {
    static displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps (ctx) {
      const token = auth(ctx)

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx))

      return { ...componentProps, token }
    }

    // New: We bind our methods
    constructor (props) {
      super(props)

      this.syncLogout = this.syncLogout.bind(this)
    }

    // New: Add event listener when a restricted Page Component mounts
    componentDidMount () {
      window.addEventListener('storage', this.syncLogout)
    }

    // New: Remove event listener when the Component unmount and
    // delete all data
    componentWillUnmount () {
      window.removeEventListener('storage', this.syncLogout)
      window.localStorage.removeItem('logout')
    }

    // New: Method to redirect the user when the event is called
    syncLogout (event) {
      if (event.key === 'logout') {
        Router.push('/login')
      }
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
}


export const withOutAuth = WrappedComponent =>
  class extends Component {
    static displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps (ctx) {
      const token = noAuth(ctx)

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx))

      return { ...componentProps, token }
    }

    // New: We bind our methods
    constructor (props) {
      super(props)
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
}