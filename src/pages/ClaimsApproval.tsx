import React, { useState, useMemo } from 'react'
import { useClaims } from '../context/ClaimsContext'
import { Link } from 'react-router-dom'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  SortAsc, 
  SortDesc,
  Eye,
  DollarSign,
  Calendar,
  User,
  Car,
  CheckSquare,
  ArrowRight,
  Camera,
  Video
} from 'lucide-react'
import { Claim } from '../context/ClaimsContext'

const ClaimsApproval: React.FC = () => {
  const { state, updateClaim } = useClaims()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'cost' | 'customer'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedClaims, setSelectedClaims] = useState<Set<string>>(new Set())


  // Filter and sort claims
  const filteredClaims = useMemo(() => {
    let claims = state.claims.filter(claim => {
      const matchesSearch = 
        claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.vehicleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || claim.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    // Sort claims
    claims.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'cost':
          comparison = a.totalEstimatedCost - b.totalEstimatedCost
          break
        case 'customer':
          comparison = a.customerName.localeCompare(b.customerName)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return claims
  }, [state.claims, searchTerm, statusFilter, sortBy, sortOrder])

  const handleSelectClaim = (claimId: string) => {
    setSelectedClaims(prev => {
      const newSet = new Set(prev)
      if (newSet.has(claimId)) {
        newSet.delete(claimId)
      } else {
        newSet.add(claimId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedClaims.size === filteredClaims.length) {
      setSelectedClaims(new Set())
    } else {
      setSelectedClaims(new Set(filteredClaims.map(claim => claim.id)))
    }
  }

  const handleBulkAction = (action: 'approve' | 'reject') => {
    selectedClaims.forEach(claimId => {
      updateClaim(claimId, { 
        status: action === 'approve' ? 'approved' : 'rejected',
        updatedAt: new Date().toISOString()
      })
    })
    setSelectedClaims(new Set())

  }

  const getStatusIcon = (status: Claim['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'processing': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-orange-100 text-orange-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const pendingClaims = filteredClaims.filter(claim => claim.status === 'pending')
  const processingClaims = filteredClaims.filter(claim => claim.status === 'processing')
  const totalValue = filteredClaims.reduce((sum, claim) => sum + claim.totalEstimatedCost, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Claims Approval</h1>
          <p className="text-gray-600 mt-2">Review and approve pending insurance claims</p>
        </div>
        <Link
          to="/"
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowRight className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Claims</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingClaims.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing Claims</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{processingClaims.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{selectedClaims.size}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="cost">Cost</option>
                <option value="customer">Customer</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedClaims.size > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedClaims.size} claim(s) selected
              </span>
              <button
                onClick={() => setSelectedClaims(new Set())}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleBulkAction('approve')}
                className="btn-primary flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve Selected</span>
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="btn-secondary flex items-center space-x-2"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject Selected</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claims Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedClaims.size === filteredClaims.length && filteredClaims.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedClaims.has(claim.id)}
                      onChange={() => handleSelectClaim(claim.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {claim.policyNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {claim.accidentDescription.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {claim.photos.length > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Camera className="h-4 w-4" />
                          <span>{claim.photos.length}</span>
                        </div>
                      )}
                      {claim.videos.length > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Video className="h-4 w-4" />
                          <span>{claim.videos.length}</span>
                        </div>
                      )}
                      {claim.photos.length === 0 && claim.videos.length === 0 && (
                        <span className="text-sm text-gray-400">No media</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {claim.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {claim.customerEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Car className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {claim.vehicleYear} {claim.vehicleMake}
                        </div>
                        <div className="text-sm text-gray-500">
                          {claim.vehicleModel}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        ${claim.totalEstimatedCost.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {getStatusIcon(claim.status)}
                      <span className="ml-1">{claim.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/claim/${claim.id}`}
                        className="text-primary-600 hover:text-primary-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      {claim.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateClaim(claim.id, { status: 'approved' })}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => updateClaim(claim.id, { status: 'rejected' })}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClaims.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClaimsApproval 