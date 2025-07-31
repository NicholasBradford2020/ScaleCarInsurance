/**
 * ClaimsContext.tsx
 * 
 * This file provides the core state management for the AI-powered car insurance claims system.
 * It defines the data models, manages claim lifecycle, and handles persistence to localStorage.
 * 
 * Key Features:
 * - TypeScript interfaces for type safety
 * - React Context API for global state management
 * - useReducer for predictable state updates
 * - localStorage persistence for claims and in-progress data
 * - Support for both completed claims and draft claims
 * - Media handling (photos and videos)
 * - AI damage assessment integration
 * - Repair shop assignment tracking
 */

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

/**
 * DamageAssessment Interface
 * 
 * Represents an individual damage assessment performed by AI analysis.
 * Each assessment includes type, severity, location, cost estimate, and confidence level.
 */
export interface DamageAssessment {
  id: string                    // Unique identifier for the assessment
  type: 'scratch' | 'dent' | 'structural' | 'glass' | 'paint'  // Type of damage
  severity: 'minor' | 'moderate' | 'severe'                    // Severity level
  location: string              // Description of where the damage is located
  estimatedCost: number         // Estimated repair cost in dollars
  confidence: number            // AI confidence level (0-100)
}

/**
 * Claim Interface
 * 
 * Represents a complete insurance claim with all associated data.
 * This is the main data structure for processed and submitted claims.
 */
export interface Claim {
  id: string                    // Unique claim identifier
  policyNumber: string          // Insurance policy number
  customerName: string          // Customer's full name
  customerEmail: string         // Customer's email address
  customerPhone: string         // Customer's phone number
  vehicleMake: string           // Vehicle manufacturer (e.g., "Toyota")
  vehicleModel: string          // Vehicle model (e.g., "Camry")
  vehicleYear: number           // Vehicle year (e.g., 2020)
  accidentDate: string          // Date of the accident (ISO string)
  accidentDescription: string   // Customer's description of the accident
  photos: string[]              // Array of base64 encoded photo data
  videos: string[]              // Array of base64 encoded video data
  status: 'pending' | 'processing' | 'approved' | 'rejected'  // Current claim status
  damageAssessments: DamageAssessment[]  // AI-generated damage assessments
  totalEstimatedCost: number    // Total estimated repair cost
  repairShopId?: string         // ID of assigned repair shop (optional)
  createdAt: string             // Claim creation timestamp
  updatedAt: string             // Last update timestamp
  aiAnalysisComplete: boolean   // Whether AI analysis has been completed
  processingTime?: number       // Time taken for AI analysis (in minutes)
}

/**
 * InProgressClaim Interface
 * 
 * Represents a claim that is currently being worked on but not yet submitted.
 * This allows users to save their progress and return to it later.
 */
export interface InProgressClaim {
  id: string                    // Unique identifier for the draft
  formData: Partial<Claim>      // Partial claim data (form fields)
  photos: string[]              // Uploaded photos (base64)
  videos: string[]              // Uploaded videos (base64)
  damageAssessments: DamageAssessment[]  // AI assessments (if completed)
  analysisComplete: boolean     // Whether AI analysis is complete
  approvedAssessments: Set<string>  // Set of approved assessment IDs
  lastSaved: string             // Last save timestamp
}

/**
 * ClaimsState Interface
 * 
 * Defines the structure of the global claims state managed by the context.
 */
interface ClaimsState {
  claims: Claim[]               // Array of all submitted claims
  inProgressClaims: InProgressClaim[]  // Array of draft claims
  loading: boolean              // Loading state indicator
  error: string | null          // Error message if any
}

/**
 * ClaimsAction Union Type
 * 
 * Defines all possible actions that can be dispatched to the reducer.
 * Each action has a type and optional payload for state updates.
 */
type ClaimsAction =
  | { type: 'ADD_CLAIM'; payload: Claim }
  | { type: 'UPDATE_CLAIM'; payload: { id: string; updates: Partial<Claim> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CLAIMS'; payload: Claim[] }
  | { type: 'SAVE_IN_PROGRESS'; payload: InProgressClaim }
  | { type: 'DELETE_IN_PROGRESS'; payload: string }
  | { type: 'LOAD_IN_PROGRESS'; payload: InProgressClaim[] }

/**
 * Initial State
 * 
 * Default state when the application first loads.
 */
const initialState: ClaimsState = {
  claims: [],
  inProgressClaims: [],
  loading: false,
  error: null
}

/**
 * Claims Reducer
 * 
 * Pure function that handles all state updates based on dispatched actions.
 * Ensures predictable state changes and maintains data integrity.
 * 
 * @param state - Current state
 * @param action - Action to perform
 * @returns New state
 */
const claimsReducer = (state: ClaimsState, action: ClaimsAction): ClaimsState => {
  switch (action.type) {
    case 'ADD_CLAIM':
      // Add a new claim to the beginning of the claims array
      return {
        ...state,
        claims: [action.payload, ...state.claims]
      }
    case 'UPDATE_CLAIM':
      // Update an existing claim with new data and update timestamp
      return {
        ...state,
        claims: state.claims.map(claim =>
          claim.id === action.payload.id
            ? { ...claim, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : claim
        )
      }
    case 'SET_LOADING':
      // Update loading state
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_ERROR':
      // Set or clear error message
      return {
        ...state,
        error: action.payload
      }
    case 'LOAD_CLAIMS':
      // Load claims from storage
      return {
        ...state,
        claims: action.payload
      }
    case 'SAVE_IN_PROGRESS':
      // Save or update an in-progress claim (replaces existing if same ID)
      return {
        ...state,
        inProgressClaims: [
          ...state.inProgressClaims.filter(claim => claim.id !== action.payload.id),
          action.payload
        ]
      }
    case 'DELETE_IN_PROGRESS':
      // Remove an in-progress claim
      return {
        ...state,
        inProgressClaims: state.inProgressClaims.filter(claim => claim.id !== action.payload)
      }
    case 'LOAD_IN_PROGRESS':
      // Load in-progress claims from storage
      return {
        ...state,
        inProgressClaims: action.payload
      }
    default:
      return state
  }
}

/**
 * ClaimsContextType Interface
 * 
 * Defines the shape of the context value provided to consumers.
 * Includes state, dispatch function, and all utility functions.
 */
interface ClaimsContextType {
  state: ClaimsState
  dispatch: React.Dispatch<ClaimsAction>
  addClaim: (claim: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateClaim: (id: string, updates: Partial<Claim>) => void
  getClaim: (id: string) => Claim | undefined
  saveInProgressClaim: (inProgressClaim: InProgressClaim) => void
  getInProgressClaim: (id: string) => InProgressClaim | undefined
  deleteInProgressClaim: (id: string) => void
  loadFromStorage: () => void
  saveToStorage: () => void
}

// Create the React Context
const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined)

/**
 * ClaimsProvider Component
 * 
 * Provides the claims context to the application.
 * Manages state, handles persistence, and provides utility functions.
 * 
 * @param children - React components that will consume the context
 */
export const ClaimsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(claimsReducer, initialState)

  // Load data from localStorage when component mounts
  useEffect(() => {
    loadFromStorage()
  }, [])

  // Save data to localStorage whenever claims or in-progress data changes
  useEffect(() => {
    saveToStorage()
  }, [state.claims, state.inProgressClaims])

  /**
   * Load Data from localStorage
   * 
   * Retrieves saved claims and in-progress data from browser storage.
   * Handles conversion of Set objects back from arrays for approvedAssessments.
   */
  const loadFromStorage = () => {
    try {
      const savedClaims = localStorage.getItem('car-insurance-claims')
      const savedInProgress = localStorage.getItem('car-insurance-in-progress')
      
      if (savedClaims) {
        const claims = JSON.parse(savedClaims)
        dispatch({ type: 'LOAD_CLAIMS', payload: claims })
      }
      
      if (savedInProgress) {
        const inProgress = JSON.parse(savedInProgress)
        // Convert approvedAssessments back to Set objects (localStorage can't store Sets directly)
        const parsedInProgress = inProgress.map((claim: any) => ({
          ...claim,
          approvedAssessments: new Set(claim.approvedAssessments || [])
        }))
        dispatch({ type: 'LOAD_IN_PROGRESS', payload: parsedInProgress })
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }

  /**
   * Save Data to localStorage
   * 
   * Persists claims and in-progress data to browser storage.
   * Converts Set objects to arrays for localStorage compatibility.
   */
  const saveToStorage = () => {
    try {
      localStorage.setItem('car-insurance-claims', JSON.stringify(state.claims))
      
      // Convert Sets to arrays for localStorage storage (localStorage can't store Sets)
      const inProgressForStorage = state.inProgressClaims.map(claim => ({
        ...claim,
        approvedAssessments: Array.from(claim.approvedAssessments)
      }))
      localStorage.setItem('car-insurance-in-progress', JSON.stringify(inProgressForStorage))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  /**
   * Add New Claim
   * 
   * Creates a new claim with auto-generated ID and timestamps.
   * 
   * @param claimData - Claim data without ID and timestamps
   */
  const addClaim = (claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Debug logging for development
    console.log('ClaimsContext - Generated claim ID:', newClaim.id)
    console.log('ClaimsContext - Adding claim:', newClaim)
    
    dispatch({ type: 'ADD_CLAIM', payload: newClaim })
  }

  /**
   * Update Existing Claim
   * 
   * Updates a claim with new data and automatically updates the timestamp.
   * 
   * @param id - Claim ID to update
   * @param updates - Partial data to update
   */
  const updateClaim = (id: string, updates: Partial<Claim>) => {
    dispatch({ type: 'UPDATE_CLAIM', payload: { id, updates } })
  }

  /**
   * Get Claim by ID
   * 
   * Retrieves a specific claim by its ID.
   * 
   * @param id - Claim ID to find
   * @returns Claim object or undefined if not found
   */
  const getClaim = (id: string) => {
    console.log('ClaimsContext - Looking for claim with ID:', id)
    console.log('ClaimsContext - Available claims:', state.claims.map(c => c.id))
    const foundClaim = state.claims.find(claim => claim.id === id)
    console.log('ClaimsContext - Found claim:', foundClaim)
    return foundClaim
  }

  /**
   * Save In-Progress Claim
   * 
   * Saves or updates a draft claim that's being worked on.
   * 
   * @param inProgressClaim - The draft claim to save
   */
  const saveInProgressClaim = (inProgressClaim: InProgressClaim) => {
    dispatch({ type: 'SAVE_IN_PROGRESS', payload: inProgressClaim })
  }

  /**
   * Get In-Progress Claim by ID
   * 
   * Retrieves a specific draft claim by its ID.
   * 
   * @param id - Draft claim ID to find
   * @returns InProgressClaim object or undefined if not found
   */
  const getInProgressClaim = (id: string) => {
    return state.inProgressClaims.find(claim => claim.id === id)
  }

  /**
   * Delete In-Progress Claim
   * 
   * Removes a draft claim from storage.
   * 
   * @param id - Draft claim ID to delete
   */
  const deleteInProgressClaim = (id: string) => {
    dispatch({ type: 'DELETE_IN_PROGRESS', payload: id })
  }

  // Context value object
  const value: ClaimsContextType = {
    state,
    dispatch,
    addClaim,
    updateClaim,
    getClaim,
    saveInProgressClaim,
    getInProgressClaim,
    deleteInProgressClaim,
    loadFromStorage,
    saveToStorage
  }

  return (
    <ClaimsContext.Provider value={value}>
      {children}
    </ClaimsContext.Provider>
  )
}

/**
 * useClaims Hook
 * 
 * Custom hook to consume the ClaimsContext.
 * Provides type safety and error handling for context usage.
 * 
 * @returns ClaimsContextType - The context value
 * @throws Error if used outside of ClaimsProvider
 */
export const useClaims = () => {
  const context = useContext(ClaimsContext)
  if (context === undefined) {
    throw new Error('useClaims must be used within a ClaimsProvider')
  }
  return context
} 