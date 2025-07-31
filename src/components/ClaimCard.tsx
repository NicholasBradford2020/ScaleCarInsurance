import React from 'react'
import { Link } from 'react-router-dom'
import { Claim } from '../context/ClaimsContext'
import { Car, Clock, CheckCircle, XCircle, AlertTriangle, DollarSign, Calendar } from 'lucide-react'

interface ClaimCardProps {
  claim: Claim
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
  const getStatusIcon = (status: Claim['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'processing':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Claim['status']) => {
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
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Link to={`/claim/${claim.id}`}>
      <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Car className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {claim.vehicleYear} {claim.vehicleMake} {claim.vehicleModel}
              </h3>
              <p className="text-sm text-gray-600">
                Policy: {claim.policyNumber} • {claim.customerName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${claim.totalEstimatedCost.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Estimated Cost</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusIcon(claim.status)}
              <span className={`status-badge ${getStatusColor(claim.status)}`}>
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(claim.accidentDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>{claim.damageAssessments.length} damage items</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {claim.aiAnalysisComplete && (
                <span className="text-green-600 text-xs font-medium">AI Analyzed</span>
              )}
              <span className="text-gray-500">
                {formatDate(claim.createdAt)} at {formatTime(claim.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ClaimCard 