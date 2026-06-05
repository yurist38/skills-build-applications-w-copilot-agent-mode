const codespaceName = import.meta.env.VITE_CODESPACE_NAME

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

export const collectionEndpoint = (collection) => `${apiBaseUrl}/${collection}/`

export const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const candidates = [payload.results, payload.data, payload.items, payload.docs]
  return candidates.find(Array.isArray) ?? []
}

export const fetchCollection = async (collection) => {
  const response = await fetch(collectionEndpoint(collection))

  if (!response.ok) {
    throw new Error(`Request failed for ${collection}: ${response.status}`)
  }

  return normalizeCollection(await response.json())
}