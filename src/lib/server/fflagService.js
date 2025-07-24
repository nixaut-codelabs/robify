import fs from 'fs';
import path from 'path';

// Platform configuration with GitHub URLs
const PLATFORM_CONFIG = {
  'Windows': {
    name: 'Windows',
    icon: '🪟',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    sources: [
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/PCClientBootstrapper.json',
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/PCDesktopClient.json',
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/PCStudioApp.json',
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/PCStudioBootstrapper.json',
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/UWPApp.json'
    ]
  },
  'macOS': {
    name: 'macOS',
    icon: '🍎',
    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    sources: [
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/MacClientBootstrapper.json',
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/MacDesktopClient.json',
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/MacStudioApp.json',
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/MacStudioBootstrapper.json'
    ]
  },
  'Android': {
    name: 'Android',
    icon: '🤖',
    color: 'bg-green-500/20 text-green-300 border-green-500/30',
    sources: [
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/AndroidApp.json'
    ]
  },
  'iOS': {
    name: 'iOS',
    icon: '📱',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    sources: [
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/iOSApp.json'
    ]
  },
  'Xbox': {
    name: 'Xbox',
    icon: '🎮',
    color: 'bg-green-600/20 text-green-400 border-green-600/30',
    sources: [
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/XboxClient.json'
    ]
  },
  'PlayStation': {
    name: 'PlayStation',
    icon: '🎯',
    color: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    sources: [
      'https://raw.githubusercontent.com/MaximumADHD/Roblox-FFlag-Tracker/refs/heads/main/PlayStationClient.json'
    ]
  }
};

// Get all URLs from platform config
const FFLAG_URLS = Object.values(PLATFORM_CONFIG).flatMap(platform => platform.sources);

// In-memory cache for flags
let flagsCache = new Map();
let lastUpdated = null;
let updateInterval = null;

// Load local flags metadata
function loadLocalFlagsMetadata() {
  try {
    const flagsPath = path.join(process.cwd(), 'flags.json');
    const flagsData = fs.readFileSync(flagsPath, 'utf8');
    const flags = JSON.parse(flagsData);
    
    const metadata = new Map();
    flags.forEach(flag => {
      metadata.set(flag.name, {
        description: flag.description,
        category: flag.category,
        impact: flag.impact,
        status: flag.status
      });
    });
    
    return metadata;
  } catch (error) {
    console.error('Error loading local flags metadata:', error);
    return new Map();
  }
}

// Get platform from URL
function getPlatformFromUrl(url) {
  for (const [platformKey, platform] of Object.entries(PLATFORM_CONFIG)) {
    if (platform.sources.includes(url)) {
      return platformKey;
    }
  }
  return 'Unknown';
}

// Fetch flags from a single URL
async function fetchFlagsFromUrl(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Robify-FFlag-Fetcher/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, platform: getPlatformFromUrl(url) };
  } catch (error) {
    console.error(`Error fetching flags from ${url}:`, error);
    return { data: {}, platform: 'Unknown' };
  }
}

// Fetch all flags from all sources
async function fetchAllFlags() {
  console.log('Fetching flags from all sources...');
  
  const allFlags = new Map();
  const localMetadata = loadLocalFlagsMetadata();
  
  // Fetch from all URLs concurrently
  const promises = FFLAG_URLS.map(url => fetchFlagsFromUrl(url));
  const results = await Promise.allSettled(promises);
  
  // Merge all results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const { data: flags, platform } = result.value;
      Object.entries(flags).forEach(([name, value]) => {
        if (!allFlags.has(name)) {
          // Get metadata from local flags.json if available
          const metadata = localMetadata.get(name) || {
            description: null,
            category: null,
            impact: 'Unknown',
            status: 'Unknown'
          };
          
          allFlags.set(name, {
            name,
            value,
            type: typeof value === 'boolean' ? 'Bool' :
                  typeof value === 'number' ? 'Int' : 'String',
            defaultValue: value,
            ...metadata,
            platforms: [platform]
          });
        } else {
          // Add platform to existing flag
          const existingFlag = allFlags.get(name);
          if (!existingFlag.platforms.includes(platform)) {
            existingFlag.platforms.push(platform);
          }
        }
      });
    }
  });
  
  console.log(`Successfully fetched ${allFlags.size} flags from ${results.filter(r => r.status === 'fulfilled').length}/${FFLAG_URLS.length} sources`);
  
  // Save to file if debug flag is set
  if (process.env.DEBUG_SAVE_FLAGS === 'true') {
    try {
      const flagsObject = {};
      for (const [key, value] of allFlags.entries()) {
        flagsObject[key] = value.value;
      }
      const outputPath = path.join(process.cwd(), 'all_flags.json');
      fs.writeFileSync(outputPath, JSON.stringify(flagsObject, null, 2));
      console.log(`Saved ${allFlags.size} flags to all_flags.json`);
    } catch (error) {
      console.error('Error saving flags to file:', error);
    }
  }

  return allFlags;
}

// Update flags cache
async function updateFlagsCache() {
  try {
    const newFlags = await fetchAllFlags();
    flagsCache = newFlags;
    lastUpdated = new Date().toISOString();
    
    console.log(`Flags cache updated at ${lastUpdated} with ${flagsCache.size} flags`);
  } catch (error) {
    console.error('Error updating flags cache:', error);
  }
}

// Start automatic updates every 5 minutes
export function startFlagUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  
  // Initial update
  updateFlagsCache();
  
  // Set up interval for every 5 minutes (300000 ms)
  updateInterval = setInterval(updateFlagsCache, 5 * 60 * 1000);
  
  console.log('Flag update service started - updating every 5 minutes');
}

// Stop automatic updates
export function stopFlagUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
    console.log('Flag update service stopped');
  }
}

// Get all flags
export function getAllFlags() {
  return Array.from(flagsCache.values());
}

// Get flag by name
export function getFlagByName(name) {
  return flagsCache.get(name) || null;
}

// Get multiple flags by names
export function getFlagsByNames(names) {
  const results = [];
  names.forEach(name => {
    const flag = flagsCache.get(name);
    if (flag) {
      results.push(flag);
    }
  });
  return results;
}

// Get flags statistics
export function getFlagsStats() {
  const flags = Array.from(flagsCache.values());
  
  // Count by category
  const categoryStats = {};
  flags.forEach(flag => {
    const category = flag.category || 'Unknown';
    categoryStats[category] = (categoryStats[category] || 0) + 1;
  });
  
  // Count by type
  const typeStats = {};
  flags.forEach(flag => {
    typeStats[flag.type] = (typeStats[flag.type] || 0) + 1;
  });
  
  // Count by status
  const statusStats = {};
  flags.forEach(flag => {
    const status = flag.status || 'Unknown';
    statusStats[status] = (statusStats[status] || 0) + 1;
  });
  
  // Count by impact
  const impactStats = {};
  flags.forEach(flag => {
    const impact = flag.impact || 'Unknown';
    impactStats[impact] = (impactStats[impact] || 0) + 1;
  });
  
  // Count by platform
  const platformStats = {};
  flags.forEach(flag => {
    if (flag.platforms && flag.platforms.length > 0) {
      flag.platforms.forEach(platform => {
        platformStats[platform] = (platformStats[platform] || 0) + 1;
      });
    } else {
      platformStats['Unknown'] = (platformStats['Unknown'] || 0) + 1;
    }
  });
  
  return {
    total: flags.length,
    lastUpdated,
    categories: categoryStats,
    types: typeStats,
    statuses: statusStats,
    impacts: impactStats,
    platforms: platformStats,
    sources: FFLAG_URLS.length
  };
}

// Get platform configuration
export function getPlatformConfig() {
  return PLATFORM_CONFIG;
}

// Search flags
export function searchFlags(query, options = {}) {
  const flags = Array.from(flagsCache.values());
  const {
    category,
    type,
    status,
    impact,
    platform,
    limit = 100,
    offset = 0
  } = options;
  
  let filtered = flags;
  
  // Apply filters
  if (category && category !== 'All') {
    filtered = filtered.filter(flag =>
      (category === 'Unknown' && !flag.category) || flag.category === category
    );
  }
  
  if (type && type !== 'All') {
    filtered = filtered.filter(flag => flag.type === type);
  }
  
  if (status && status !== 'All') {
    filtered = filtered.filter(flag =>
      (status === 'Unknown' && !flag.status) || flag.status === status
    );
  }
  
  if (impact && impact !== 'All') {
    filtered = filtered.filter(flag =>
      (impact === 'Unknown' && !flag.impact) || flag.impact === impact
    );
  }
  
  if (platform && platform !== 'All') {
    filtered = filtered.filter(flag =>
      flag.platforms && flag.platforms.includes(platform)
    );
  }
  
  // Apply search query
  if (query) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(flag =>
      flag.name.toLowerCase().includes(searchTerm) ||
      (flag.description && flag.description.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply pagination
  const total = filtered.length;
  const paginatedResults = filtered.slice(offset, offset + limit);
  
  return {
    flags: paginatedResults,
    total,
    limit,
    offset,
    hasMore: offset + limit < total
  };
}

/**
 * Validate Fast Flags configuration with auto-fix for simple errors
 * @param {string[]} flagsInput - Array of flag strings to validate
 * @returns {object} Validation results with valid, invalid, and auto-fixed flags
 */
export function validateFlags(flagsInput) {
  if (!Array.isArray(flagsInput)) {
    throw new Error('Flags input must be an array');
  }

  const results = {
    valid: [],
    invalid: [],
    autoFixed: []
  };

  flagsInput.forEach((flagString, index) => {
    const lineNumber = index + 1;
    const trimmedFlag = flagString.trim();
    
    if (!trimmedFlag) {
      // Skip empty lines
      return;
    }

    const issues = [];
    
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(trimmedFlag);
      
     // Validate structure
     if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
       issues.push('Flag must be a JSON object');
       results.invalid.push({
         line: lineNumber,
         content: trimmedFlag,
         issues: issues
       });
     } else {
       const keys = Object.keys(parsed);
       
       if (keys.length === 0) {
         issues.push('Flag object cannot be empty');
         results.invalid.push({
           line: lineNumber,
           content: trimmedFlag,
           issues: issues
         });
       } else {
         // Iterate over each key-value pair in the JSON object
         keys.forEach(flagName => {
           const originalValue = parsed[flagName];
           const individualIssues = [];
           const autoFixIssues = [];
           let fixedValue = originalValue;
           let wasAutoFixed = false;

           // Validate flag name format
           if (!validateFlagName(flagName)) {
             individualIssues.push('Invalid flag name format. Must start with FFlag, FInt, FString, or DFFlag');
           } else {
             // Try to auto-fix value type issues
             const expectedType = getFlagTypeFromName(flagName);
             const autoFixResult = attemptAutoFix(originalValue, expectedType);
             
             if (autoFixResult.wasFixed) {
               fixedValue = autoFixResult.fixedValue;
               wasAutoFixed = true;
               autoFixIssues.push(autoFixResult.fixDescription);
             } else if (!validateFlagValue(originalValue, expectedType)) {
               individualIssues.push(`Invalid value type. Expected ${expectedType} but got ${typeof originalValue}`);
             }
           }
           
           // Check if flag exists in our database
           const existingFlag = getFlagByName(flagName);
           if (!existingFlag) {
             individualIssues.push('Flag not found in database (may be deprecated or custom)');
           }

           const finalFlagContent = JSON.stringify({ [flagName]: fixedValue });

           if (individualIssues.length === 0) {
             if (wasAutoFixed) {
               results.autoFixed.push({
                 line: lineNumber,
                 content: finalFlagContent,
                 originalContent: JSON.stringify({ [flagName]: originalValue }),
                 parsed: { [flagName]: fixedValue },
                 fixes: autoFixIssues
               });
             } else {
               results.valid.push({
                 line: lineNumber,
                 content: finalFlagContent,
                 parsed: { [flagName]: fixedValue }
               });
             }
           } else {
             results.invalid.push({
               line: lineNumber,
               content: JSON.stringify({ [flagName]: originalValue }),
               issues: individualIssues
             });
           }
         });
       }
     }
      
    } catch (parseError) {
      issues.push(`Invalid JSON format: ${parseError.message}`);
      results.invalid.push({
        line: lineNumber,
        content: trimmedFlag,
        issues: issues
      });
    }
  });

  return results;
}

/**
 * Attempt to auto-fix simple value type errors
 * @param {any} value - Original value
 * @param {string} expectedType - Expected type
 * @returns {object} Fix result
 */
function attemptAutoFix(value, expectedType) {
  const result = {
    wasFixed: false,
    fixedValue: value,
    fixDescription: ''
  };

  switch (expectedType) {
    case 'boolean':
      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue === 'true' || lowerValue === 'tRuE' || lowerValue === 'TRUE') {
          result.wasFixed = true;
          result.fixedValue = true;
          result.fixDescription = `Auto-fixed: converted string "${value}" to boolean true`;
        } else if (lowerValue === 'false' || lowerValue === 'fAlSe' || lowerValue === 'FALSE') {
          result.wasFixed = true;
          result.fixedValue = false;
          result.fixDescription = `Auto-fixed: converted string "${value}" to boolean false`;
        }
      } else if (typeof value === 'number') {
        if (value === 1) {
          result.wasFixed = true;
          result.fixedValue = true;
          result.fixDescription = `Auto-fixed: converted number 1 to boolean true`;
        } else if (value === 0) {
          result.wasFixed = true;
          result.fixedValue = false;
          result.fixDescription = `Auto-fixed: converted number 0 to boolean false`;
        }
      }
      break;

    case 'number':
      if (typeof value === 'string') {
        const trimmedValue = value.trim();
        const numValue = parseInt(trimmedValue, 10);
        if (!isNaN(numValue) && numValue.toString() === trimmedValue) {
          result.wasFixed = true;
          result.fixedValue = numValue;
          result.fixDescription = `Auto-fixed: converted string "${value}" to number ${numValue}`;
        }
      } else if (typeof value === 'boolean') {
        result.wasFixed = true;
        result.fixedValue = value ? 1 : 0;
        result.fixDescription = `Auto-fixed: converted boolean ${value} to number ${result.fixedValue}`;
      }
      break;

    case 'string':
      if (typeof value === 'number' || typeof value === 'boolean') {
        result.wasFixed = true;
        result.fixedValue = String(value);
        result.fixDescription = `Auto-fixed: converted ${typeof value} ${value} to string "${result.fixedValue}"`;
      }
      break;
  }

  return result;
}

/**
 * Validate flag name format
 * @param {string} flagName - The flag name to validate
 * @returns {boolean} True if valid format
 */
function validateFlagName(flagName) {
  if (typeof flagName !== 'string') return false;
  
  // Valid prefixes for Roblox Fast Flags
  const validPrefixes = ['FFlag', 'FInt', 'FString', 'DFFlag', 'SFFlag', 'FLog'];
  
  return validPrefixes.some(prefix => flagName.startsWith(prefix));
}

/**
 * Get expected type from flag name
 * @param {string} flagName - The flag name
 * @returns {string} Expected type
 */
function getFlagTypeFromName(flagName) {
  if (flagName.startsWith('FFlag') || flagName.startsWith('DFFlag') || flagName.startsWith('SFFlag')) {
    return 'boolean';
  } else if (flagName.startsWith('FInt')) {
    return 'number';
  } else if (flagName.startsWith('FString') || flagName.startsWith('FLog')) {
    return 'string';
  }
  return 'unknown';
}

/**
 * Validate flag value against expected type
 * @param {any} value - The flag value
 * @param {string} expectedType - Expected type
 * @returns {boolean} True if valid
 */
function validateFlagValue(value, expectedType) {
  switch (expectedType) {
    case 'boolean':
      return typeof value === 'boolean';
    case 'number':
      return typeof value === 'number' && Number.isInteger(value);
    case 'string':
      return typeof value === 'string';
    default:
      return true; // Allow any type for unknown flag types
  }
}

// Initialize the service
if (typeof window === 'undefined') {
  // Only start on server side
  startFlagUpdates();
}