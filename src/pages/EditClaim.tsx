/**
 * EditClaim.tsx
 * 
 * This component provides a comprehensive form for editing existing insurance claims.
 * It pre-populates the form with existing claim data and allows users to modify
 * claim details, media, and damage assessments.
 * 
 * Key Features:
 * - Pre-populated form with existing claim data
 * - Photo and video upload with preview
 * - AI damage analysis simulation
 * - Individual assessment approval/rejection
 * - Cost database integration
 * - Repair shop assignment
 * - Validation and error handling
 * 
 * State Management:
 * - Form data for claim details
 * - Media arrays for photos and videos
 * - AI analysis state and results
 * - Validation errors
 * - Loading states
 */

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useClaims, DamageAssessment, Claim } from '../context/ClaimsContext'
import { Upload, Camera, X, Loader2, CheckCircle, Car, FileText, Search, ArrowRight, BookOpen, Save, RefreshCw, ArrowLeft } from 'lucide-react'

/**
 * EditClaim Component
 * 
 * Main component for editing existing insurance claims.
 * Provides a comprehensive interface for modifying claim data with validation.
 */
const EditClaim: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getClaim, updateClaim } = useClaims()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Get the existing claim data
  const existingClaim = id ? getClaim(id) : null
  
  // Form data state - initialized with existing claim data
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
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  /**
   * Initialize form with existing claim data
   * 
   * Loads the existing claim data and populates the form fields.
   * This runs once when the component mounts.
   */
  useEffect(() => {
    if (existingClaim) {
      setFormData({
        policyNumber: existingClaim.policyNumber,
        customerName: existingClaim.customerName,
        customerEmail: existingClaim.customerEmail,
        customerPhone: existingClaim.customerPhone,
        vehicleMake: existingClaim.vehicleMake,
        vehicleModel: existingClaim.vehicleModel,
        vehicleYear: existingClaim.vehicleYear,
        accidentDate: existingClaim.accidentDate,
        accidentDescription: existingClaim.accidentDescription
      })
      
      setPhotos(existingClaim.photos)
      setVideos(existingClaim.videos)
      setDamageAssessments(existingClaim.damageAssessments)
      setAnalysisComplete(existingClaim.aiAnalysisComplete)
      
      // Auto-approve existing assessments
      if (existingClaim.damageAssessments.length > 0) {
        setApprovedAssessments(new Set(existingClaim.damageAssessments.map(a => a.id)))
      }
      
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [existingClaim])

  /**
   * Handle Input Change
   * 
   * Updates form data when user types in input fields.
   * Also clears validation errors.
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
  }

  /**
   * Handle Media Upload
   * 
   * Processes uploaded files (images and videos) and converts them to base64 strings.
   * Uses a counter-based approach to ensure all files are processed before updating state.
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
  }

  /**
   * Simulate AI Analysis
   * 
   * Simulates AI-powered damage analysis by generating mock assessments.
   * In a real application, this would call an AI service to analyze uploaded media.
   * 
   * @returns Promise<void>
   */
  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate mock damage assessments
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
   * Handle Assessment Toggle
   * 
   * Toggles the approval status of a damage assessment.
   * 
   * @param assessmentId - ID of the assessment to toggle
   */
  const handleAssessmentToggle = (assessmentId: string) => {
    setApprovedAssessments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(assessmentId)) {
        newSet.delete(assessmentId)
      } else {
        newSet.add(assessmentId)
      }
      return newSet
    })
  }

  /**
   * Handle Form Submit
   * 
   * Validates the form and saves the updated claim data.
   * Navigates back to the claim details page on success.
   * 
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !existingClaim) {
      return
    }
    
    setIsSaving(true)
    
    try {
      // Calculate total cost from approved assessments
      const totalCost = damageAssessments
        .filter(assessment => approvedAssessments.has(assessment.id))
        .reduce((sum, assessment) => sum + assessment.estimatedCost, 0)
      
      // Update the claim with new data
      const updatedClaim: Partial<Claim> = {
        ...formData,
        photos,
        videos,
        damageAssessments,
        totalEstimatedCost: totalCost,
        aiAnalysisComplete: analysisComplete,
        updatedAt: new Date().toISOString()
      }
      
      updateClaim(existingClaim.id, updatedClaim)
      
      // Navigate back to claim details
      navigate(`/claim/${existingClaim.id}`)
    } catch (error) {
      console.error('Error updating claim:', error)
      setErrors({ submit: 'Failed to update claim. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Handle Next Step
   * 
   * Validates current step and moves to the next step.
   * 
   * @returns void
   */
  const handleNextStep = () => {
    if (currentStep === 1 && !validateForm()) {
      return
    }
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  /**
   * Handle Previous Step
   * 
   * Moves to the previous step.
   * 
   * @returns void
   */
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  // Show loading state while fetching claim data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading claim data...</p>
        </div>
      </div>
    )
  }

  // Show error if claim not found
  if (!existingClaim) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Claim Not Found</h2>
          <p className="text-gray-600 mb-6">
            The claim you're trying to edit doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/claim/${existingClaim.id}`)}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Claim</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Claim</h1>
              <p className="text-gray-600 mt-1">Update claim details and information</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span>Claim Details</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span>Media Upload</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span>Review & Save</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Claim Details */}
          {currentStep === 1 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Claim Details</h2>
              
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.policyNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.vehicleMake ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter vehicle make"
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter vehicle model"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1900"
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.accidentDate ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.accidentDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe what happened during the accident..."
                />
                {errors.accidentDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.accidentDescription}</p>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Media Upload */}
          {currentStep === 2 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Media Upload</h2>
              
              <div className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Photos ({photos.length} uploaded)
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      multiple
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary flex items-center space-x-2 mx-auto"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Photos & Videos</span>
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      Drag and drop files here, or click to browse
                    </p>
                  </div>

                  {/* Photo Preview */}
                  {photos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Photos</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Preview */}
                  {videos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Videos</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videos.map((video, index) => (
                          <div key={index} className="relative group">
                            <video
                              src={video}
                              controls
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">AI Damage Analysis</h3>
                    {!analysisComplete && (
                      <button
                        type="button"
                        onClick={simulateAIAnalysis}
                        disabled={isAnalyzing || (photos.length === 0 && videos.length === 0)}
                        className="btn-primary flex items-center space-x-2"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Damage'}</span>
                      </button>
                    )}
                  </div>

                  {analysisComplete && damageAssessments.length > 0 && (
                    <div className="space-y-4">
                      {damageAssessments.map((assessment) => (
                        <div
                          key={assessment.id}
                          className={`p-4 border rounded-lg ${
                            approvedAssessments.has(assessment.id)
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => handleAssessmentToggle(assessment.id)}
                                className={`p-2 rounded-full ${
                                  approvedAssessments.has(assessment.id)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                              >
                                {approvedAssessments.has(assessment.id) ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </button>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)} Damage
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    assessment.severity === 'minor' ? 'bg-yellow-100 text-yellow-800' :
                                    assessment.severity === 'moderate' ? 'bg-orange-100 text-orange-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {assessment.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{assessment.location}</p>
                                <p className="text-sm text-gray-600">
                                  Confidence: {Math.round(assessment.confidence * 100)}%
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ${assessment.estimatedCost.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Save */}
          {currentStep === 3 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Save</h2>
              
              <div className="space-y-6">
                {/* Claim Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Claim Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Policy Number</p>
                      <p className="font-medium">{formData.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-medium">{formData.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="font-medium">{formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Media Files</p>
                      <p className="font-medium">{photos.length} photos, {videos.length} videos</p>
                    </div>
                  </div>
                </div>

                {/* Cost Summary */}
                {analysisComplete && damageAssessments.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Summary</h3>
                    <div className="space-y-2">
                      {damageAssessments.map((assessment) => (
                        <div key={assessment.id} className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            {approvedAssessments.has(assessment.id) ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm">
                              {assessment.type} damage - {assessment.location}
                            </span>
                          </div>
                          <span className={`font-medium ${
                            approvedAssessments.has(assessment.id) ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            ${assessment.estimatedCost.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Estimated Cost</span>
                          <span className="text-xl font-bold text-gray-900">
                            ${damageAssessments
                              .filter(assessment => approvedAssessments.has(assessment.id))
                              .reduce((sum, assessment) => sum + assessment.estimatedCost, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{errors.submit}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default EditClaim 