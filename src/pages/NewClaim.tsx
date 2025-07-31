/**
 * NewClaim.tsx
 * 
 * This component provides a comprehensive multi-step form for creating new insurance claims.
 * It includes AI-powered damage analysis, media upload capabilities, and progress persistence.
 * 
 * Key Features:
 * - Multi-step form with validation
 * - Photo and video upload with preview
 * - AI damage analysis simulation
 * - Progress saving and loading
 * - Import existing ticket data
 * - Individual assessment approval/rejection
 * - Cost database integration
 * - Default repair shop assignment
 * 
 * State Management:
 * - Form data for claim details
 * - Media arrays for photos and videos
 * - AI analysis state and results
 * - Progress persistence
 * - Import functionality
 */

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClaims, InProgressClaim } from '../context/ClaimsContext'
import { Upload, Camera, X, Loader2, CheckCircle, Car, FileText, Search, ArrowRight, BookOpen, Save, RefreshCw } from 'lucide-react'
import { DamageAssessment, Claim } from '../context/ClaimsContext'

/**
 * NewClaim Component
 * 
 * Main component for creating new insurance claims with AI-powered analysis.
 * Provides a step-by-step interface for claim submission with progress persistence.
 */
const NewClaim: React.FC = () => {
  const navigate = useNavigate()
  const { addClaim, saveInProgressClaim, getInProgressClaim, deleteInProgressClaim } = useClaims()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Fixed session ID for persistence across page reloads
  // This ensures that saved progress is always associated with the same session
  const sessionId = 'new-claim-session'
  
  // Form data state - contains all the basic claim information
  const [formData, setFormData] = useState({
    policyNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    accidentDate: '',
    accidentDescription: ''
  })
  
  // Media state - stores base64 encoded photos and videos
  const [photos, setPhotos] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  
  // AI Analysis state - tracks the analysis process and results
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [damageAssessments, setDamageAssessments] = useState<DamageAssessment[]>([])
  
  // Form navigation and validation state
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [approvedAssessments, setApprovedAssessments] = useState<Set<string>>(new Set())
  
  // Import ticket functionality - allows importing data from existing tickets
  const [showImportModal, setShowImportModal] = useState(false)
  const [importSearchTerm, setImportSearchTerm] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<Claim | null>(null)
  
  // Persistence functionality - tracks save state and progress
  const [lastSaved, setLastSaved] = useState<string>('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [hasSavedProgress, setHasSavedProgress] = useState(false)

  // Mock existing tickets for import functionality
  // In a real application, this data would come from an API
  const existingTickets: Claim[] = [
    {
      id: 'ticket_001',
      policyNumber: 'POL-2024-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '(555) 123-4567',
      vehicleMake: 'Toyota',
      vehicleModel: 'Camry',
      vehicleYear: 2022,
      accidentDate: '2024-01-15',
      accidentDescription: 'Rear-end collision at traffic light. Vehicle sustained damage to rear bumper and trunk area.',
      photos: [],
      videos: [],
      status: 'pending',
      damageAssessments: [],
      totalEstimatedCost: 0,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      aiAnalysisComplete: false
    },
    {
      id: 'ticket_002',
      policyNumber: 'POL-2024-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      customerPhone: '(555) 987-6543',
      vehicleMake: 'Honda',
      vehicleModel: 'Civic',
      vehicleYear: 2021,
      accidentDate: '2024-01-20',
      accidentDescription: 'Side impact collision. Driver side door and fender damaged. Airbags deployed.',
      photos: [],
      videos: [],
      status: 'processing',
      damageAssessments: [],
      totalEstimatedCost: 0,
      createdAt: '2024-01-20T14:15:00Z',
      updatedAt: '2024-01-20T14:15:00Z',
      aiAnalysisComplete: false
    },
    {
      id: 'ticket_003',
      policyNumber: 'POL-2024-003',
      customerName: 'Michael Brown',
      customerEmail: 'michael.brown@email.com',
      customerPhone: '(555) 456-7890',
      vehicleMake: 'Ford',
      vehicleModel: 'F-150',
      vehicleYear: 2023,
      accidentDate: '2024-01-25',
      accidentDescription: 'Parking lot incident. Minor scratches and dents on passenger side. No structural damage.',
      photos: [],
      videos: [],
      status: 'approved',
      damageAssessments: [],
      totalEstimatedCost: 0,
      createdAt: '2024-01-25T09:45:00Z',
      updatedAt: '2024-01-25T09:45:00Z',
      aiAnalysisComplete: false
    }
  ]

  // Filter existing tickets based on search term for import functionality
  const filteredTickets = existingTickets.filter(ticket =>
    ticket.policyNumber.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
    ticket.customerName.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
    ticket.vehicleMake.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
    ticket.vehicleModel.toLowerCase().includes(importSearchTerm.toLowerCase())
  )

  /**
   * Load saved data on component mount
   * 
   * Retrieves any previously saved progress and restores the form state.
   * This allows users to continue working on a claim after leaving the page.
   */
  useEffect(() => {
    const savedData = getInProgressClaim(sessionId)
    if (savedData) {
      setFormData(prev => ({ ...prev, ...savedData.formData }))
      setPhotos(savedData.photos)
      setVideos(savedData.videos || [])
      setDamageAssessments(savedData.damageAssessments)
      setAnalysisComplete(savedData.analysisComplete)
      setApprovedAssessments(savedData.approvedAssessments)
      setLastSaved(savedData.lastSaved)
      setHasUnsavedChanges(false)
      setHasSavedProgress(true)
    } else {
      setHasSavedProgress(false)
    }
  }, [sessionId, getInProgressClaim])

  /**
   * Auto-save functionality
   * 
   * Automatically saves progress every 30 seconds if there are unsaved changes.
   * This ensures that user work is not lost due to browser crashes or accidental navigation.
   */
  useEffect(() => {
    const saveData = () => {
      const inProgressData: InProgressClaim = {
        id: sessionId,
        formData,
        photos,
        videos,
        damageAssessments,
        analysisComplete,
        approvedAssessments,
        lastSaved: new Date().toISOString()
      }
      saveInProgressClaim(inProgressData)
      setLastSaved(new Date().toISOString())
      setHasUnsavedChanges(false)
    }

    // Save every 30 seconds if there are changes
    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        saveData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [formData, photos, videos, damageAssessments, analysisComplete, approvedAssessments, hasUnsavedChanges, sessionId, saveInProgressClaim])

  /**
   * Save on page unload
   * 
   * Saves progress when the user is about to leave the page.
   * This is a safety mechanism to prevent data loss during navigation.
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasUnsavedChanges) {
        const inProgressData: InProgressClaim = {
          id: sessionId,
          formData,
          photos,
          videos,
          damageAssessments,
          analysisComplete,
          approvedAssessments,
          lastSaved: new Date().toISOString()
        }
        saveInProgressClaim(inProgressData)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [formData, photos, videos, damageAssessments, analysisComplete, approvedAssessments, hasUnsavedChanges, sessionId, saveInProgressClaim])

  /**
   * Save Progress
   * 
   * Manually saves the current form state to localStorage.
   * Called when user clicks the save button or through auto-save.
   */
  const saveProgress = () => {
    const inProgressData: InProgressClaim = {
      id: sessionId,
      formData,
      photos,
      videos,
      damageAssessments,
      analysisComplete,
      approvedAssessments,
      lastSaved: new Date().toISOString()
    }
    saveInProgressClaim(inProgressData)
    setLastSaved(new Date().toISOString())
    setHasUnsavedChanges(false)
    setHasSavedProgress(true)
  }

  /**
   * Clear Saved Progress
   * 
   * Removes any saved progress from localStorage and resets the form.
   * Used when user wants to start fresh.
   */
  const clearSavedProgress = () => {
    deleteInProgressClaim(sessionId)
    setLastSaved('')
    setHasUnsavedChanges(false)
    setHasSavedProgress(false)
  }

  /**
   * Load Saved Progress
   * 
   * Retrieves and restores saved progress from localStorage.
   * Called when user clicks the "Load Progress" button.
   */
  const loadSavedProgress = () => {
    const savedData = getInProgressClaim(sessionId)
    if (savedData) {
      setFormData(prev => ({ ...prev, ...savedData.formData }))
      setPhotos(savedData.photos)
      setVideos(savedData.videos || [])
      setDamageAssessments(savedData.damageAssessments)
      setAnalysisComplete(savedData.analysisComplete)
      setApprovedAssessments(savedData.approvedAssessments)
      setLastSaved(savedData.lastSaved)
      setHasUnsavedChanges(false)
      setHasSavedProgress(true)
      // Reset to step 1 if we have form data
      if (Object.keys(savedData.formData).length > 0) {
        setCurrentStep(1)
      }
    }
  }

  /**
   * Handle Import Ticket
   * 
   * Imports data from an existing ticket to pre-fill the form.
   * This allows users to create new claims based on existing ticket information.
   * 
   * @param ticket - The existing ticket to import data from
   */
  const handleImportTicket = (ticket: Claim) => {
    setFormData({
      policyNumber: ticket.policyNumber,
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      customerPhone: ticket.customerPhone,
      vehicleMake: ticket.vehicleMake,
      vehicleModel: ticket.vehicleModel,
      vehicleYear: ticket.vehicleYear,
      accidentDate: ticket.accidentDate,
      accidentDescription: ticket.accidentDescription
    })
    
    if (ticket.photos.length > 0) {
      setPhotos(ticket.photos)
    }
    
    if (ticket.damageAssessments.length > 0) {
      setDamageAssessments(ticket.damageAssessments)
      setAnalysisComplete(ticket.aiAnalysisComplete)
      // Auto-approve all imported assessments
      setApprovedAssessments(new Set(ticket.damageAssessments.map(a => a.id)))
    }
    
    setSelectedTicket(ticket)
    setShowImportModal(false)
    setImportSearchTerm('')
  }

  /**
   * Clear Imported Data
   * 
   * Resets the form to its initial state, clearing all imported data.
   * Used when user wants to start fresh after importing a ticket.
   */
  const clearImportedData = () => {
    setFormData({
      policyNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: new Date().getFullYear(),
      accidentDate: '',
      accidentDescription: ''
    })
    setPhotos([])
    setVideos([])
    setDamageAssessments([])
    setAnalysisComplete(false)
    setSelectedTicket(null)
    setApprovedAssessments(new Set())
  }

  /**
   * Handle Input Change
   * 
   * Updates form data when user types in input fields.
   * Also clears validation errors and marks form as having unsaved changes.
   * 
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setHasUnsavedChanges(true)
  }

  /**
   * Handle Media Upload
   * 
   * Processes uploaded files (images and videos) and converts them to base64 strings.
   * Uses a counter-based approach to ensure all files are processed before updating state.
   * This prevents race conditions when multiple files are uploaded simultaneously.
   * 
   * @param e - File input change event
   */
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos: string[] = []
      const newVideos: string[] = []
      let processedFiles = 0
      const totalFiles = files.length
      
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            if (file.type.startsWith('image/')) {
              newPhotos.push(e.target.result as string)
            } else if (file.type.startsWith('video/')) {
              newVideos.push(e.target.result as string)
            }
            
            processedFiles++
            
            // Check if all files have been processed
            if (processedFiles === totalFiles) {
              if (newPhotos.length > 0) {
                setPhotos(prev => [...prev, ...newPhotos])
              }
              if (newVideos.length > 0) {
                setVideos(prev => [...prev, ...newVideos])
              }
              setHasUnsavedChanges(true)
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
    // Reset the file input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Remove Photo
   * 
   * Removes a specific photo from the photos array by index.
   * 
   * @param index - Index of the photo to remove
   */
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setHasUnsavedChanges(true)
  }

  /**
   * Remove Video
   * 
   * Removes a specific video from the videos array by index.
   * 
   * @param index - Index of the video to remove
   */
  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index))
    setHasUnsavedChanges(true)
  }

  /**
   * Simulate AI Analysis
   * 
   * Simulates AI-powered damage analysis by generating mock assessments.
   * In a real application, this would call an AI service to analyze uploaded media.
   * 
   * Features:
   * - 3-second processing simulation
   * - Generates realistic damage assessments
   * - Auto-approves all assessments initially
   * - Uses unique IDs for each assessment
   */
  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate mock damage assessments with cost database references
    const mockAssessments: DamageAssessment[] = [
      {
        id: `damage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_1`,
        type: 'dent',
        severity: 'moderate',
        location: 'Front bumper',
        estimatedCost: 850,
        confidence: 0.92
      },
      {
        id: `damage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_2`,
        type: 'scratch',
        severity: 'minor',
        location: 'Driver side door',
        estimatedCost: 320,
        confidence: 0.88
      },
      {
        id: `damage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_3`,
        type: 'paint',
        severity: 'minor',
        location: 'Hood',
        estimatedCost: 450,
        confidence: 0.85
      }
    ]
    
    setDamageAssessments(mockAssessments)
    // Auto-approve all assessments initially
    setApprovedAssessments(new Set(mockAssessments.map(a => a.id)))
    setAnalysisComplete(true)
    setIsAnalyzing(false)
  }

  /**
   * Validate Form
   * 
   * Validates all required form fields and sets error messages.
   * Returns true if all validations pass, false otherwise.
   * 
   * @returns boolean - Whether the form is valid
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.policyNumber) newErrors.policyNumber = 'Policy number is required'
    if (!formData.customerName) newErrors.customerName = 'Customer name is required'
    if (!formData.customerEmail) newErrors.customerEmail = 'Email is required'
    if (!formData.customerPhone) newErrors.customerPhone = 'Phone number is required'
    if (!formData.vehicleMake) newErrors.vehicleMake = 'Vehicle make is required'
    if (!formData.vehicleModel) newErrors.vehicleModel = 'Vehicle model is required'
    if (!formData.accidentDate) newErrors.accidentDate = 'Accident date is required'
    if (!formData.accidentDescription) newErrors.accidentDescription = 'Accident description is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle Submit
   * 
   * Processes the final claim submission after validation.
   * Creates a new claim with approved assessments and default repair shop assignment.
   * Clears saved progress and navigates to the dashboard.
   */
  const handleSubmit = () => {
    if (!validateForm()) return
    
    // Only include approved assessments
    const approvedAssessmentsList = damageAssessments.filter(assessment => 
      approvedAssessments.has(assessment.id)
    )
    
    const totalEstimatedCost = approvedAssessmentsList.reduce((sum, assessment) => sum + assessment.estimatedCost, 0)
    
    const newClaim = {
      ...formData,
      photos,
      videos,
      status: 'pending' as const,
      damageAssessments: approvedAssessmentsList,
      totalEstimatedCost,
      repairShopId: 'shop_001', // Default to Premium Auto Body & Paint
      aiAnalysisComplete: analysisComplete,
      processingTime: isAnalyzing ? undefined : 3 // 3 minutes for demo
    }
    
    addClaim(newClaim)
    
    // Clear saved progress after successful submission
    clearSavedProgress()
    
    // Debug logging
    console.log('NewClaim - Submitted claim data:', newClaim)
    console.log('NewClaim - Navigate to dashboard')
    
    navigate('/')
  }

  const getDamageTypeIcon = (type: DamageAssessment['type']) => {
    switch (type) {
      case 'scratch': return '🔨'
      case 'dent': return '💥'
      case 'structural': return '🏗️'
      case 'glass': return '🪟'
      case 'paint': return '🎨'
      default: return '🚗'
    }
  }

  const getSeverityColor = (severity: DamageAssessment['severity']) => {
    switch (severity) {
      case 'minor': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const toggleAssessmentApproval = (assessmentId: string) => {
    setApprovedAssessments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(assessmentId)) {
        newSet.delete(assessmentId)
      } else {
        newSet.add(assessmentId)
      }
      return newSet
    })
    setHasUnsavedChanges(true)
  }

  const getCostDatabaseReference = (assessment: DamageAssessment) => {
    // Mock cost database reference - in real app this would come from actual database
    const references = {
      'dent': { category: 'Body Repair', itemCode: 'DENT-001', confidence: 'high' },
      'scratch': { category: 'Paint & Body', itemCode: 'SCRATCH-001', confidence: 'high' },
      'paint': { category: 'Paint & Body', itemCode: 'PAINT-001', confidence: 'medium' },
      'structural': { category: 'Structural', itemCode: 'STRUCT-001', confidence: 'low' },
      'glass': { category: 'Glass', itemCode: 'GLASS-001', confidence: 'high' }
    }
    return references[assessment.type] || { category: 'General', itemCode: 'GEN-001', confidence: 'medium' }
  }

  const getApprovedTotalCost = () => {
    return damageAssessments
      .filter(assessment => approvedAssessments.has(assessment.id))
      .reduce((sum, assessment) => sum + assessment.estimatedCost, 0)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Insurance Claim</h1>
          <p className="text-gray-600 mt-2">Submit a new claim with AI-powered damage assessment</p>
        </div>
        
        {/* Persistence Controls */}
        <div className="flex items-center space-x-3">
          {lastSaved && (
            <div className="text-sm text-gray-500">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </div>
          )}
          {hasUnsavedChanges && (
            <div className="text-sm text-orange-600 font-medium">
              Unsaved changes
            </div>
          )}
          {hasSavedProgress && (
            <button
              onClick={loadSavedProgress}
              className="btn-secondary flex items-center space-x-2"
              title="Load previously saved progress"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Load Progress</span>
            </button>
          )}
          <button
            onClick={saveProgress}
            className="btn-secondary flex items-center space-x-2"
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-4 w-4" />
            <span>Save Progress</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-0.5 mx-2 ${
                currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
        <div className="ml-4 text-sm text-gray-600">
          {currentStep === 1 && 'Basic Information'}
          {currentStep === 2 && 'Upload Photos'}
          {currentStep === 3 && 'AI Analysis & Review'}
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Customer & Vehicle Information</h2>
            <button
              onClick={() => setShowImportModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Import Existing Ticket</span>
            </button>
          </div>

          {/* Imported Ticket Info */}
          {selectedTicket && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      Imported from Ticket: {selectedTicket.policyNumber}
                    </p>
                    <p className="text-sm text-blue-700">
                      Customer: {selectedTicket.customerName} • Vehicle: {selectedTicket.vehicleYear} {selectedTicket.vehicleMake} {selectedTicket.vehicleModel}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearImportedData}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Imported Data
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Number *
              </label>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleInputChange}
                className={`input-field ${errors.policyNumber ? 'border-red-500' : ''}`}
                placeholder="Enter policy number"
              />
              {errors.policyNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.policyNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={`input-field ${errors.customerName ? 'border-red-500' : ''}`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className={`input-field ${errors.customerEmail ? 'border-red-500' : ''}`}
                placeholder="Enter email address"
              />
              {errors.customerEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className={`input-field ${errors.customerPhone ? 'border-red-500' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Make *
              </label>
              <input
                type="text"
                name="vehicleMake"
                value={formData.vehicleMake}
                onChange={handleInputChange}
                className={`input-field ${errors.vehicleMake ? 'border-red-500' : ''}`}
                placeholder="e.g., Toyota, Honda, Ford"
              />
              {errors.vehicleMake && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleMake}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Model *
              </label>
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleInputChange}
                className={`input-field ${errors.vehicleModel ? 'border-red-500' : ''}`}
                placeholder="e.g., Camry, Civic, F-150"
              />
              {errors.vehicleModel && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Year
              </label>
              <input
                type="number"
                name="vehicleYear"
                value={formData.vehicleYear}
                onChange={handleInputChange}
                className="input-field"
                min="1990"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accident Date *
              </label>
              <input
                type="date"
                name="accidentDate"
                value={formData.accidentDate}
                onChange={handleInputChange}
                className={`input-field ${errors.accidentDate ? 'border-red-500' : ''}`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.accidentDate && (
                <p className="text-red-500 text-sm mt-1">{errors.accidentDate}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accident Description *
            </label>
            <textarea
              name="accidentDescription"
              value={formData.accidentDescription}
              onChange={handleInputChange}
              rows={4}
              className={`input-field ${errors.accidentDescription ? 'border-red-500' : ''}`}
              placeholder="Describe what happened during the accident..."
            />
            {errors.accidentDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.accidentDescription}</p>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setCurrentStep(2)}
              className="btn-primary"
              disabled={!formData.policyNumber || !formData.customerName}
            >
              Next: Upload Photos
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Media Upload */}
      {currentStep === 2 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Damage Photos & Videos</h2>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
              
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Camera className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Upload damage photos & videos</p>
                  <p className="text-gray-600">Drag and drop or click to select multiple photos and videos</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Media
                </button>
              </div>
            </div>

            {photos.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Uploaded Photos ({photos.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Damage photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Uploaded Videos ({videos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={video}
                        controls
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeVideo(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="btn-primary"
              disabled={photos.length === 0 && videos.length === 0}
            >
              Next: AI Analysis
            </button>
          </div>
        </div>
      )}

      {/* Step 3: AI Analysis */}
      {currentStep === 3 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Damage Analysis</h2>
          
          {!analysisComplete && !isAnalyzing && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Car className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for AI Analysis</h3>
              <p className="text-gray-600 mb-6">
                Our AI will analyze the uploaded photos to assess damage and estimate repair costs.
              </p>
              <button
                onClick={simulateAIAnalysis}
                className="btn-primary"
              >
                Start AI Analysis
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Damage...</h3>
              <p className="text-gray-600">
                AI is processing your photos to identify damage and estimate costs.
              </p>
            </div>
          )}

          {analysisComplete && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Analysis Complete</span>
              </div>

                             <div>
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg font-medium text-gray-900">Damage Assessment</h3>
                   <div className="flex items-center space-x-2 text-sm text-gray-600">
                     <span>Approved: {approvedAssessments.size}/{damageAssessments.length}</span>
                     <button
                       onClick={() => setApprovedAssessments(new Set(damageAssessments.map(a => a.id)))}
                       className="text-primary-600 hover:text-primary-700 font-medium"
                     >
                       Approve All
                     </button>
                     <span>•</span>
                     <button
                       onClick={() => setApprovedAssessments(new Set())}
                       className="text-gray-600 hover:text-gray-700 font-medium"
                     >
                       Clear All
                     </button>
                   </div>
                 </div>
                 <div className="space-y-4">
                   {damageAssessments.map((assessment) => {
                     const isApproved = approvedAssessments.has(assessment.id)
                     const costRef = getCostDatabaseReference(assessment)
                     
                     return (
                       <div key={assessment.id} className={`border rounded-lg p-4 transition-all duration-200 ${
                         isApproved 
                           ? 'border-green-200 bg-green-50' 
                           : 'border-gray-200 bg-white'
                       }`}>
                         <div className="flex items-start space-x-4">
                           {/* Approval Toggle */}
                           <div className="flex-shrink-0 pt-1">
                             <button
                               onClick={() => toggleAssessmentApproval(assessment.id)}
                               className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                 isApproved
                                   ? 'bg-green-500 border-green-500 text-white'
                                   : 'border-gray-300 hover:border-green-400'
                               }`}
                             >
                               {isApproved && (
                                 <CheckCircle className="w-4 h-4" />
                               )}
                             </button>
                           </div>
                           
                           {/* Damage Info */}
                           <div className="flex-1">
                             <div className="flex items-center justify-between mb-2">
                               <div className="flex items-center space-x-3">
                                 <span className="text-2xl">{getDamageTypeIcon(assessment.type)}</span>
                                 <div>
                                   <p className="font-medium text-gray-900 capitalize">
                                     {assessment.type} - {assessment.location}
                                   </p>
                                   <p className="text-sm text-gray-600">
                                     Confidence: {Math.round(assessment.confidence * 100)}%
                                   </p>
                                 </div>
                               </div>
                               <div className="text-right">
                                 <p className="text-lg font-bold text-gray-900">
                                   ${assessment.estimatedCost.toLocaleString()}
                                 </p>
                                 <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(assessment.severity)}`}>
                                   {assessment.severity}
                                 </span>
                               </div>
                             </div>
                             
                             {/* Cost Database Reference */}
                             <div className="bg-white rounded-lg p-3 border border-gray-200">
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-2">
                                   <BookOpen className="w-4 h-4 text-blue-600" />
                                   <span className="text-sm font-medium text-gray-900">Cost Database Reference</span>
                                 </div>
                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                   costRef.confidence === 'high' ? 'bg-green-100 text-green-800' :
                                   costRef.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                   'bg-red-100 text-red-800'
                                 }`}>
                                   {costRef.confidence} confidence
                                 </span>
                               </div>
                               <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                 <div>
                                   <span className="font-medium">Category:</span> {costRef.category}
                                 </div>
                                 <div>
                                   <span className="font-medium">Item Code:</span> {costRef.itemCode}
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     )
                   })}
                 </div>
               </div>

                             <div className="bg-gray-50 rounded-lg p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <span className="text-lg font-medium text-gray-900">Total Estimated Cost</span>
                     <p className="text-sm text-gray-600 mt-1">
                       Based on {approvedAssessments.size} approved assessment{approvedAssessments.size !== 1 ? 's' : ''}
                     </p>
                   </div>
                   <div className="text-right">
                     <span className="text-2xl font-bold text-gray-900">
                       ${getApprovedTotalCost().toLocaleString()}
                     </span>
                     {approvedAssessments.size < damageAssessments.length && (
                       <p className="text-sm text-gray-500 mt-1">
                         ${damageAssessments.reduce((sum, a) => sum + a.estimatedCost, 0).toLocaleString()} total if all approved
                       </p>
                     )}
                   </div>
                 </div>
               </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-success"
                >
                  Submit Claim
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import Ticket Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Import Existing Ticket</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by policy number, customer name, or vehicle..."
                    value={importSearchTerm}
                    onChange={(e) => setImportSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Ticket List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No tickets found matching your search</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleImportTicket(ticket)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <FileText className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{ticket.policyNumber}</p>
                              <p className="text-sm text-gray-600">{ticket.customerName}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Vehicle:</span> {ticket.vehicleYear} {ticket.vehicleMake} {ticket.vehicleModel}
                            </div>
                            <div>
                              <span className="font-medium">Status:</span> 
                              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                ticket.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                                ticket.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {ticket.accidentDescription}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewClaim 