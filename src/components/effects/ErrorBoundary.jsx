import { Component } from 'react';

// Catches render errors (e.g. WebGL not available) and shows a fallback.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('[HALOCLINE] 3D scene unavailable, using fallback.', error);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}