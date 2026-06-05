import { useEffect, useState } from 'react'

import { fetchCollection } from '../api'
import ResourceState from './ResourceState'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection('leaderboard')
      .then(setEntries)
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <p className="eyebrow">Leaderboard</p>
        <h1>Top performers</h1>
      </div>

      <ResourceState loading={loading} error={error} empty={entries.length === 0}>
        <div className="leaderboard-list">
          {entries.map((entry) => (
            <article className="leaderboard-row" key={entry._id ?? entry.rank}>
              <span className="rank">#{entry.rank}</span>
              <div>
                <h2>{entry.user?.name ?? 'Student'}</h2>
                <p>{entry.user?.team ?? 'Independent'}</p>
              </div>
              <strong>{entry.points} pts</strong>
            </article>
          ))}
        </div>
      </ResourceState>
    </section>
  )
}

export default Leaderboard