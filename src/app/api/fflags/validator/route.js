import { NextResponse } from 'next/server';
import { validateFlags } from '@/lib/server/fflagService';

/**
 * POST /api/fflags/validator
 * Validates Fast Flags configuration
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    
    if (!body || !Array.isArray(body.flags)) {
      return NextResponse.json(
        { 
          error: 'Invalid request body. Expected { flags: string[] }',
          details: 'The request must contain a "flags" array with flag strings'
        },
        { status: 400 }
      );
    }

    const { flags } = body;

    // Validate input size (prevent abuse)
    if (flags.length > 1000) {
      return NextResponse.json(
        { 
          error: 'Too many flags to validate',
          details: 'Maximum 1000 flags allowed per request'
        },
        { status: 400 }
      );
    }

    // Validate each flag string length
    const maxFlagLength = 10000; // 10KB per flag
    for (let i = 0; i < flags.length; i++) {
      if (typeof flags[i] !== 'string') {
        return NextResponse.json(
          { 
            error: `Invalid flag at index ${i}`,
            details: 'All flags must be strings'
          },
          { status: 400 }
        );
      }
      
      if (flags[i].length > maxFlagLength) {
        return NextResponse.json(
          { 
            error: `Flag at index ${i} is too long`,
            details: `Maximum ${maxFlagLength} characters allowed per flag`
          },
          { status: 400 }
        );
      }
    }

    // Perform validation
    const validationResults = validateFlags(flags);

    // Add summary statistics
    const summary = {
      total: flags.length,
      valid: validationResults.valid.length,
      invalid: validationResults.invalid.length,
      validationRate: flags.length > 0 
        ? Math.round((validationResults.valid.length / flags.length) * 100) 
        : 0
    };

    return NextResponse.json({
      ...validationResults,
      summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/fflags/validator:', error);
    
    // Handle JSON parsing errors specifically
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON in request body',
          details: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'An internal server error occurred during validation',
        details: 'Please try again later or contact support if the problem persists'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/fflags/validator
 * Returns validator information and usage examples
 */
export async function GET() {
  return NextResponse.json({
    name: 'Fast Flag Validator API',
    version: '1.0.0',
    description: 'Validates Roblox Fast Flags configuration for syntax, format, and type correctness',
    endpoints: {
      validate: {
        method: 'POST',
        path: '/api/fflags/validator',
        description: 'Validate an array of flag strings',
        body: {
          flags: ['{"FFlagExampleFlag": true}', '{"FIntExampleNumber": 100}']
        }
      }
    },
    limits: {
      maxFlags: 1000,
      maxFlagLength: 10000
    },
    supportedFlagTypes: [
      {
        prefix: 'FFlag',
        type: 'boolean',
        example: '{"FFlagExampleFlag": true}'
      },
      {
        prefix: 'FInt',
        type: 'number',
        example: '{"FIntExampleNumber": 100}'
      },
      {
        prefix: 'FString',
        type: 'string',
        example: '{"FStringExampleText": "value"}'
      },
      {
        prefix: 'DFFlag',
        type: 'boolean',
        example: '{"DFFlagExampleFlag": false}'
      }
    ],
    validationRules: [
      'Must be valid JSON format',
      'Must contain exactly one key-value pair',
      'Flag name must start with valid prefix (FFlag, FInt, FString, DFFlag, etc.)',
      'Value type must match flag prefix expectation',
      'Flag object cannot be empty'
    ]
  });
}