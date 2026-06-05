import { useEffect, useState } from 'react'

import { fetchCollection } from '../api'
import ResourceState from './ResourceState'

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection('activities')
      .then(setActivities)
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="content-panel">
      <div className="section-heading">
        <p className="eyebrow">Activity Log</p>
        <h1>Recent movement</h1>
      </div>

      <ResourceState loading={loading} error={error} empty={activities.length === 0}>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Student</th>
                <th>Duration</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity.type}</td>
                  <td>{activity.user?.name ?? 'Unassigned'}</td>
                  <td>{activity.durationMinutes} min</td>
                  <td>{activity.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResourceState>
    </section>
  )
}

export default Activities