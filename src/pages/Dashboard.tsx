import React from 'react'
import { Link } from 'react-router-dom'
import { useClaims } from '../context/ClaimsContext'
import { Plus, Clock, CheckCircle, AlertTriangle, TrendingUp, DollarSign, Car, BookOpen, CheckSquare, Wrench } from 'lucide-react'
import ClaimCard from '../components/ClaimCard'

const Dashboard: React.FC = () => {
  const { state } = useClaims()

  // Calculate statistics
  const totalClaims = state.claims.length
  const pendingClaims = state.claims.filter(claim => claim.status === 'pending').length
  const processingClaims = state.claims.filter(claim => claim.status === 'processing').length
  const approvedClaims = state.claims.filter(claim => claim.status === 'approved').length
  const totalValue = state.claims.reduce((sum, claim) => sum + claim.totalEstimatedCost, 0)
  const avgProcessingTime = state.claims.length > 0 
    ? state.claims.reduce((sum, claim) => sum + (claim.processingTime || 0), 0) / state.claims.length
    : 0

  const stats = [
    {
      title: 'Total Claims',
      value: totalClaims,
      icon: Car,
      color: 'bg-blue-500',
      subtitle: 'All time claims'
    },
    {
      title: 'Pending Review',
      value: pendingClaims,
      icon: Clock,
      color: 'bg-yellow-500',
      subtitle: 'Awaiting review'
    },
    {
      title: 'Processing',
      value: processingClaims,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      subtitle: 'Currently processing'
    },
    {
      title: 'Approved',
      value: approvedClaims,
      icon: CheckCircle,
      color: 'bg-green-500',
      subtitle: 'Successfully processed'
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      subtitle: 'Combined estimated costs'
    },
    {
      title: 'Avg Processing Time',
      value: `${Math.round(avgProcessingTime)} min`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      subtitle: 'AI analysis time'
    }
  ]

  const recentClaims = state.claims.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Claims Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage insurance claims with AI-powered insights</p>
        </div>
        <Link
          to="/new-claim"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Claim</span>
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {stat.subtitle}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Claims */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Claims</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all claims
          </Link>
        </div>
        
        {recentClaims.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No claims yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first claim</p>
            <Link to="/new-claim" className="btn-primary">
              Create First Claim
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </div>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accuracy Rate</span>
              <span className="text-sm font-medium text-gray-900">94.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Processing Speed</span>
              <span className="text-sm font-medium text-gray-900">2.3 min avg</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cost Savings</span>
              <span className="text-sm font-medium text-gray-900">$12,450</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/claims-approval" className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors block">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Review & Approve Claims</p>
                  <p className="text-sm text-gray-600">{pendingClaims} claims awaiting review</p>
                </div>
              </div>
            </Link>
            
            <Link to="/repair-shops" className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors block">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wrench className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Find Repair Shops</p>
                  <p className="text-sm text-gray-600">Locate certified body shops</p>
                </div>
              </div>
            </Link>
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">View Analytics</p>
                  <p className="text-sm text-gray-600">Detailed performance metrics</p>
                </div>
              </div>
            </button>
            
            <Link to="/repair-costs" className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors block">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BookOpen className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Repair Cost Database</p>
                  <p className="text-sm text-gray-600">View standardized pricing</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 