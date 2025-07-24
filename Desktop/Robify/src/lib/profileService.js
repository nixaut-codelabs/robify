const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://robify.vercel.app/api'
  : 'http://localhost:3000/api';

/**
 * A utility function to handle fetch requests and JSON parsing.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The options for the fetch request.
 * @returns {Promise<object>} The JSON response.
 * @throws {Error} If the network response is not ok.
 */
async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch API call failed:', error);
    throw error;
  }
}

/**
 * Get all profiles from the API.
 * @param {Object} options - Query options
 * @returns {Promise<object>} Response with profiles array and metadata
 */
export async function getAllProfiles(options = {}) {
  const params = new URLSearchParams();
  
  if (options.search) params.set('search', options.search);
  if (options.category) params.set('category', options.category);
  if (options.impact) params.set('impact', options.impact);
  if (options.difficulty) params.set('difficulty', options.difficulty);
  if (options.limit) params.set('limit', options.limit.toString());
  if (options.offset) params.set('offset', options.offset.toString());
  
  const queryString = params.toString();
  const url = `${API_BASE_URL}/profiles${queryString ? `?${queryString}` : ''}`;
  
  return fetchJson(url);
}

/**
 * Search profiles with various filters
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<object>} Search results with pagination
 */
export async function searchProfiles(query, options = {}) {
  return getAllProfiles({
    search: query,
    ...options
  });
}

/**
 * Get a single profile by its ID from the API.
 * @param {string} id - The ID of the profile to retrieve.
 * @returns {Promise<object|null>} The profile object or null if not found.
 */
export async function getProfileById(id) {
  if (!id) return null;
  try {
    return await fetchJson(`${API_BASE_URL}/profiles/get?id=${encodeURIComponent(id)}`);
  } catch (error) {
    if (error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

/**
 * Get a single profile by its name from the API.
 * @param {string} name - The name of the profile to retrieve.
 * @returns {Promise<object|null>} The profile object or null if not found.
 */
export async function getProfileByName(name) {
  if (!name) return null;
  try {
    return await fetchJson(`${API_BASE_URL}/profiles/get?name=${encodeURIComponent(name)}`);
  } catch (error) {
    if (error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

/**
 * Get profiles statistics from the API.
 * @returns {Promise<object>} Statistics about profiles
 */
export async function getProfilesStats() {
  return fetchJson(`${API_BASE_URL}/profiles?stats=true`);
}