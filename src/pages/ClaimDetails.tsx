import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useClaims } from '../context/ClaimsContext'
import { repairShops, getRepairShopById } from '../data/repairShops'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Car, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  Download,
  Edit,
  MessageSquare,
  BookOpen,
  MapPin,
  Star,
  Wrench
} from 'lucide-react'

const ClaimDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getClaim, updateClaim, state } = useClaims()
  const [isUpdating, setIsUpdating] = useState(false)
  const [showRepairShopSelector, setShowRepairShopSelector] = useState(false)
  
  const claim = id ? getClaim(id) : null

  // Debug logging
  console.log('ClaimDetails - ID from params:', id)
  console.log('ClaimDetails - All claims:', state.claims)
  console.log('ClaimDetails - Found claim:', claim)

  if (!claim) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Claim Not Found</h2>
        <p className="text-gray-600 mb-6">
          The claim you're looking for doesn't exist or may have been removed.
        </p>
        <div className="text-sm text-gray-500 mb-6">
          <p>Requested ID: {id}</p>
          <p>Available claims: {state.claims.length}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'processing':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'processing':
        return 'status-processing'
      case 'approved':
        return 'status-approved'
      case 'rejected':
        return 'status-rejected'
      default:
        return 'status-pending'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusUpdate = async (newStatus: 'pending' | 'processing' | 'approved' | 'rejected') => {
    setIsUpdating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    updateClaim(claim.id, { 
      status: newStatus,
      processingTime: claim.processingTime || 3
    })
    
    setIsUpdating(false)
  }

  const getDamageTypeIcon = (type: string) => {
    switch (type) {
      case 'scratch': return '🔨'
      case 'dent': return '💥'
      case 'structural': return '🏗️'
      case 'glass': return '🪟'
      case 'paint': return '🎨'
      default: return '🚗'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Repair shop helper functions
  const getCurrentRepairShop = () => {
    return claim.repairShopId ? getRepairShopById(claim.repairShopId) || repairShops[0] : repairShops[0]
  }

  const handleRepairShopChange = async (shopId: string) => {
    setIsUpdating(true)
    try {
      await updateClaim(claim.id, { repairShopId: shopId })
      setShowRepairShopSelector(false)
    } catch (error) {
      console.error('Error updating repair shop:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claim Details</h1>
            <p className="text-gray-600">Policy: {claim.policyNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon(claim.status)}
            <span className={`status-badge ${getStatusColor(claim.status)}`}>
              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Vehicle Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer & Vehicle Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-medium text-gray-900">{claim.customerName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{claim.customerEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{claim.customerPhone}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium text-gray-900">
                      {claim.vehicleYear} {claim.vehicleMake} {claim.vehicleModel}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Accident Date</p>
                    <p className="font-medium text-gray-900">{formatDate(claim.accidentDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Total Estimated Cost</p>
                    <p className="font-medium text-gray-900">${claim.totalEstimatedCost.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Accident Description</h3>
              <p className="text-gray-600">{claim.accidentDescription}</p>
            </div>
          </div>

          {/* Repair Shop Assignment */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Repair Shop Assignment</h2>
              <button
                onClick={() => setShowRepairShopSelector(!showRepairShopSelector)}
                className="btn-secondary flex items-center space-x-2"
                disabled={isUpdating}
              >
                <Edit className="h-4 w-4" />
                <span>Change Shop</span>
              </button>
            </div>

            {(() => {
              const currentShop = getCurrentRepairShop()
              return (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Wrench className="h-5 w-5 text-primary-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{currentShop.name}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{currentShop.address}, {currentShop.city}, {currentShop.state} {currentShop.zipCode}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{currentShop.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{currentShop.email}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {getRatingStars(currentShop.rating)}
                              </div>
                              <span className="text-sm text-gray-600">
                                {currentShop.rating} ({currentShop.reviewCount} reviews)
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Distance:</span> {currentShop.distance} mi away
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Est. Wait Time:</span> {currentShop.estimatedWaitTime}
                            </div>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              currentShop.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {currentShop.isOpen ? 'Open Now' : 'Closed'}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            {currentShop.specialties.map((specialty, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Repair Shop Selector */}
                  {showRepairShopSelector && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h4 className="font-medium text-gray-900 mb-4">Select Alternative Repair Shop</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {repairShops
                          .filter(shop => shop.id !== currentShop.id)
                          .map((shop) => (
                            <div key={shop.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h5 className="font-medium text-gray-900">{shop.name}</h5>
                                    <div className="flex items-center space-x-1">
                                      {getRatingStars(shop.rating)}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <div>{shop.address}, {shop.city}</div>
                                    <div className="flex items-center space-x-4 mt-1">
                                      <span>{shop.distance} mi away</span>
                                      <span>Est. {shop.estimatedWaitTime}</span>
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        shop.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {shop.isOpen ? 'Open' : 'Closed'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRepairShopChange(shop.id)}
                                  className="btn-primary text-sm px-3 py-1"
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? 'Updating...' : 'Select'}
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>

          {/* Damage Assessment */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">AI Damage Assessment</h2>
              {claim.aiAnalysisComplete && (
                <span className="text-green-600 text-sm font-medium flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>AI Analysis Complete</span>
                </span>
              )}
            </div>
            
            {claim.damageAssessments.length > 0 ? (
              <div className="space-y-4">
                {claim.damageAssessments.map((assessment) => (
                  <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No damage assessments available</p>
              </div>
            )}
            
            {/* Reference Link to Repair Cost Database */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Need to verify pricing?</span>
                </div>
                <Link 
                  to="/repair-costs" 
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                >
                  <span>View Cost Database</span>
                  <ArrowLeft className="h-3 w-3 rotate-180" />
                </Link>
              </div>
            </div>
          </div>

          {/* Photos */}
          {(claim.photos.length > 0 || claim.videos.length > 0) && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Damage Media</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {claim.photos.map((photo, index) => (
                  <div key={`photo-${index}`} className="relative group">
                    <img
                      src={photo}
                      alt={`Damage photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full">
                        <Download className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                ))}
                {claim.videos.map((video, index) => (
                  <div key={`video-${index}`} className="relative group">
                    <video
                      src={video}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full">
                        <Download className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Actions</h3>
            
            <div className="space-y-3">
              {claim.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('processing')}
                    disabled={isUpdating}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    {isUpdating ? (
                      <AlertTriangle className="h-4 w-4 animate-spin" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <span>Start Processing</span>
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={isUpdating}
                    className="w-full btn-success flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve Claim</span>
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={isUpdating}
                    className="w-full btn-danger flex items-center justify-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject Claim</span>
                  </button>
                </>
              )}
              
              {claim.status === 'processing' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={isUpdating}
                    className="w-full btn-success flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve Claim</span>
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={isUpdating}
                    className="w-full btn-danger flex items-center justify-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject Claim</span>
                  </button>
                </>
              )}
              
              {(claim.status === 'approved' || claim.status === 'rejected') && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">
                    Claim has been {claim.status}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Claim Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Timeline</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Claim Created</p>
                  <p className="text-xs text-gray-600">
                    {formatDate(claim.createdAt)} at {formatTime(claim.createdAt)}
                  </p>
                </div>
              </div>
              
              {claim.aiAnalysisComplete && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">AI Analysis Complete</p>
                    <p className="text-xs text-gray-600">
                      Processing time: {claim.processingTime || 3} minutes
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-xs text-gray-600">
                    {formatDate(claim.updatedAt)} at {formatTime(claim.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/edit-claim/${claim.id}`)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Edit className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Edit Claim</p>
                    <p className="text-sm text-gray-600">Update claim details</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Contact Customer</p>
                    <p className="text-sm text-gray-600">Send email or call</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Download className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Export Report</p>
                    <p className="text-sm text-gray-600">Download PDF report</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClaimDetails 