import { useEffect, useState } from 'react'

import { fetchCollection } from '../api'
import ResourceState from './ResourceState'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection('teams')
      .then(setTeams)
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <p className="eyebrow">Teams</p>
        <h1>Competition groups</h1>
      </div>

      <ResourceState loading={loading} error={error} empty={teams.length === 0}>
        <div className="resource-grid">
          {teams.map((team) => (
            <article className="resource-card" key={team._id}>
              <h2>{team.name}</h2>
              <p>{team.mascot}</p>
              <strong>{team.points} team points</strong>
              <span>{team.members?.length ?? 0} members</span>
            </article>
          ))}
        </div>
      </ResourceState>
    </section>
  )
}

export default Teams