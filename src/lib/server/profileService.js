import fs from 'fs';
import path from 'path';

// In-memory cache for profiles
let profilesCache = null;
let lastUpdated = null;

/**
 * Load profiles from the profiles.json file
 * @returns {Array} Array of profile objects
 */
function loadProfilesFromFile() {
  try {
    const profilesPath = path.join(process.cwd(), 'profiles.json');
    const profilesData = fs.readFileSync(profilesPath, 'utf8');
    const profiles = JSON.parse(profilesData);
    
    // Validate profiles structure
    if (!Array.isArray(profiles)) {
      throw new Error('Profiles data must be an array');
    }
    
    // Validate each profile has required fields
    profiles.forEach((profile, index) => {
      if (!profile.id || !profile.name) {
        throw new Error(`Profile at index ${index} is missing required fields (id, name)`);
      }
    });
    
    return profiles;
  } catch (error) {
    console.error('Error loading profiles from file:', error);
    return [];
  }
}

/**
 * Update profiles cache
 */
function updateProfilesCache() {
  try {
    const profiles = loadProfilesFromFile();
    profilesCache = profiles;
    lastUpdated = new Date().toISOString();
    
    console.log(`Profiles cache updated at ${lastUpdated} with ${profilesCache.length} profiles`);
  } catch (error) {
    console.error('Error updating profiles cache:', error);
    profilesCache = [];
  }
}

/**
 * Get all profiles
 * @returns {Array} Array of all profile objects
 */
export function getAllProfiles() {
  if (!profilesCache) {
    updateProfilesCache();
  }
  return profilesCache || [];
}

/**
 * Get a profile by its ID
 * @param {string} id - Profile ID
 * @returns {Object|null} Profile object or null if not found
 */
export function getProfileById(id) {
  if (!profilesCache) {
    updateProfilesCache();
  }
  
  if (!id) return null;
  
  const profile = profilesCache.find(p => p.id === id);
  return profile || null;
}

/**
 * Get a profile by its name
 * @param {string} name - Profile name
 * @returns {Object|null} Profile object or null if not found
 */
export function getProfileByName(name) {
  if (!profilesCache) {
    updateProfilesCache();
  }
  
  if (!name) return null;
  
  const profile = profilesCache.find(p => 
    p.name.toLowerCase() === name.toLowerCase() || 
    p.id.toLowerCase() === name.toLowerCase()
  );
  return profile || null;
}

/**
 * Search profiles by various criteria
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Object} Search results with pagination
 */
export function searchProfiles(query, options = {}) {
  if (!profilesCache) {
    updateProfilesCache();
  }
  
  const {
    category,
    impact,
    difficulty,
    limit = 20,
    offset = 0
  } = options;
  
  let filtered = profilesCache || [];
  
  // Apply filters
  if (category && category !== 'All') {
    filtered = filtered.filter(profile =>
      profile.category && profile.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (impact && impact !== 'All') {
    filtered = filtered.filter(profile =>
      profile.impact && profile.impact.toLowerCase() === impact.toLowerCase()
    );
  }
  
  if (difficulty && difficulty !== 'All') {
    filtered = filtered.filter(profile =>
      profile.difficulty && profile.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }
  
  // Apply search query
  if (query) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm) ||
      profile.description.toLowerCase().includes(searchTerm) ||
      (profile.category && profile.category.toLowerCase().includes(searchTerm)) ||
      (profile.benefits && profile.benefits.some(benefit => 
        benefit.toLowerCase().includes(searchTerm)
      ))
    );
  }
  
  // Apply pagination
  const total = filtered.length;
  const paginatedResults = filtered.slice(offset, offset + limit);
  
  return {
    profiles: paginatedResults,
    total,
    limit,
    offset,
    hasMore: offset + limit < total
  };
}

/**
 * Get profiles statistics
 * @returns {Object} Statistics about profiles
 */
export function getProfilesStats() {
  if (!profilesCache) {
    updateProfilesCache();
  }
  
  const profiles = profilesCache || [];
  
  // Count by category
  const categoryStats = {};
  profiles.forEach(profile => {
    const category = profile.category || 'Unknown';
    categoryStats[category] = (categoryStats[category] || 0) + 1;
  });
  
  // Count by impact
  const impactStats = {};
  profiles.forEach(profile => {
    const impact = profile.impact || 'Unknown';
    impactStats[impact] = (impactStats[impact] || 0) + 1;
  });
  
  // Count by difficulty
  const difficultyStats = {};
  profiles.forEach(profile => {
    const difficulty = profile.difficulty || 'Unknown';
    difficultyStats[difficulty] = (difficultyStats[difficulty] || 0) + 1;
  });
  
  // Count by compatibility
  const compatibilityStats = {};
  profiles.forEach(profile => {
    if (profile.compatibility && Array.isArray(profile.compatibility)) {
      profile.compatibility.forEach(platform => {
        compatibilityStats[platform] = (compatibilityStats[platform] || 0) + 1;
      });
    }
  });
  
  // Calculate total flags across all profiles
  const totalFlags = profiles.reduce((sum, profile) => {
    return sum + (profile.flags ? profile.flags.length : 0);
  }, 0);
  
  return {
    total: profiles.length,
    totalFlags,
    lastUpdated,
    categories: categoryStats,
    impacts: impactStats,
    difficulties: difficultyStats,
    compatibility: compatibilityStats
  };
}

/**
 * Validate a profile object
 * @param {Object} profile - Profile object to validate
 * @returns {Object} Validation result
 */
export function validateProfile(profile) {
  const errors = [];
  const warnings = [];
  
  // Required fields
  if (!profile.id) errors.push('Profile ID is required');
  if (!profile.name) errors.push('Profile name is required');
  if (!profile.description) errors.push('Profile description is required');
  if (!profile.category) errors.push('Profile category is required');
  
  // Validate flags array
  if (!profile.flags || !Array.isArray(profile.flags)) {
    errors.push('Profile must have a flags array');
  } else {
    profile.flags.forEach((flag, index) => {
      if (!flag.name) errors.push(`Flag at index ${index} is missing name`);
      if (flag.value === undefined) errors.push(`Flag at index ${index} is missing value`);
    });
  }
  
  // Validate benefits array
  if (!profile.benefits || !Array.isArray(profile.benefits)) {
    warnings.push('Profile should have a benefits array');
  }
  
  // Validate compatibility array
  if (!profile.compatibility || !Array.isArray(profile.compatibility)) {
    warnings.push('Profile should have a compatibility array');
  }
  
  // Validate enum values
  const validImpacts = ['Low', 'Medium', 'High'];
  const validDifficulties = ['Easy', 'Medium', 'Hard'];
  const validCategories = ['Performance', 'Network', 'Graphics', 'Debug', 'UI', 'Audio'];
  
  if (profile.impact && !validImpacts.includes(profile.impact)) {
    warnings.push(`Invalid impact value: ${profile.impact}. Valid values: ${validImpacts.join(', ')}`);
  }
  
  if (profile.difficulty && !validDifficulties.includes(profile.difficulty)) {
    warnings.push(`Invalid difficulty value: ${profile.difficulty}. Valid values: ${validDifficulties.join(', ')}`);
  }
  
  if (profile.category && !validCategories.includes(profile.category)) {
    warnings.push(`Invalid category value: ${profile.category}. Valid values: ${validCategories.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Force refresh the profiles cache
 */
export function refreshProfilesCache() {
  updateProfilesCache();
  return {
    success: true,
    timestamp: lastUpdated,
    profileCount: profilesCache ? profilesCache.length : 0
  };
}