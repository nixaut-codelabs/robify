const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://robify.vercel.app/api'
  : typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}/api`
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
 * Get flags statistics from the API.
 * @returns {Promise<object>} The statistics object.
 */
export async function getFlagsStats() {
  return fetchJson(`${API_BASE_URL}/fflags`);
}

/**
 * Get a single flag by its name from the API.
 * @param {string} name - The name of the flag to retrieve.
 * @returns {Promise<object|null>} The flag object or null if not found.
 */
export async function getFlagByName(name) {
  if (!name) return null;
  return fetchJson(`${API_BASE_URL}/fflags/get?flag=${encodeURIComponent(name)}`);
}

/**
 * Get multiple flags by their names using a POST request.
 * @param {string[]} names - An array of flag names.
 * @returns {Promise<object[]>} An array of flag objects.
 */
export async function getFlagsByNames(names) {
  if (!names || names.length === 0) return [];
  return fetchJson(`${API_BASE_URL}/fflags/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ flags: names }),
  });
}

/**
 * Search for flags with various filters and pagination.
 * @param {string} query - The search term.
 * @param {object} options - The search and filter options.
 * @param {string} [options.category] - Filter by category.
 * @param {string} [options.type] - Filter by type.
 * @param {string} [options.status] - Filter by status.
 * @param {string} [options.impact] - Filter by impact.
 * @param {string} [options.platform] - Filter by platform.
 * @param {number} [options.limit=100] - Number of results to return.
 * @param {number} [options.offset=0] - Offset for pagination.
 * @returns {Promise<object>} An object containing the flags and pagination info.
 */
export async function searchFlags(query = '', options = {}) {
  const {
    category,
    type,
    status,
    impact,
    platform,
    limit = 100,
    offset = 0
  } = options;

  const params = new URLSearchParams();
  if (query) params.append('flag', query);
  if (category && category !== 'All') params.append('category', category);
  if (type && type !== 'All') params.append('type', type);
  if (status && status !== 'All') params.append('status', status);
  if (impact && impact !== 'All') params.append('impact', impact);
  if (platform && platform !== 'All') params.append('platform', platform);
  if (limit) params.append('limit', limit);
  if (offset) params.append('offset', offset);

  const url = `${API_BASE_URL}/fflags/search?${params.toString()}`;
  return fetchJson(url);
}

/**
 * Validates a list of flags by calling the validator API endpoint.
 * @param {string[]} flags - An array of strings, where each string is a JSON representation of a flag.
 * @returns {Promise<object>} The validation results from the API.
 */
export async function validateFlags(flags) {
    if (!Array.isArray(flags) || flags.length === 0) {
        return { valid: [], invalid: [] };
    }

    return fetchJson(`${API_BASE_URL}/fflags/validator`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flags }),
    });
}
/**
 * Get a paginated list of flags.
 * @param {number} page - The page number to retrieve.
 * @returns {Promise<object>} An object containing the flags and pagination info.
 */
export async function getFlagsByPage(page = 1) {
  const url = `${API_BASE_URL}/fflags/list?page=${page}`;
  return fetchJson(url);
}