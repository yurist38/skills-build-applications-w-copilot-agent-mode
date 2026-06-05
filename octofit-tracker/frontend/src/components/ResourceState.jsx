function ResourceState({ loading, error, empty, children }) {
  if (loading) {
    return <div className="status-box">Loading...</div>
  }

  if (error) {
    return <div className="status-box text-danger">{error}</div>
  }

  if (empty) {
    return <div className="status-box">No records found.</div>
  }

  return children
}

export default ResourceState