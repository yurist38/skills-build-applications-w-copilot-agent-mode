import { useEffect, useState } from 'react'

import { fetchCollection } from '../api'
import ResourceState from './ResourceState'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection('workouts')
      .then(setWorkouts)
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <p className="eyebrow">Workouts</p>
        <h1>Suggested training</h1>
      </div>

      <ResourceState loading={loading} error={error} empty={workouts.length === 0}>
        <div className="resource-grid">
          {workouts.map((workout) => (
            <article className="resource-card" key={workout._id}>
              <h2>{workout.title}</h2>
              <p>{workout.level}</p>
              <strong>{workout.durationMinutes} minutes</strong>
              <span>{workout.activities?.join(', ')}</span>
            </article>
          ))}
        </div>
      </ResourceState>
    </section>
  )
}

export default Workouts