import { useEffect, useState } from 'react'

import { fetchCollection } from '../api'
import ResourceState from './ResourceState'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection('users')
      .then(setUsers)
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <p className="eyebrow">Students</p>
        <h1>User profiles</h1>
      </div>

      <ResourceState loading={loading} error={error} empty={users.length === 0}>
        <div className="resource-grid">
          {users.map((user) => (
            <article className="resource-card" key={user._id}>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <strong>{user.points} points</strong>
              <span>{user.team ?? 'No team'}</span>
            </article>
          ))}
        </div>
      </ResourceState>
    </section>
  )
}

export default Users