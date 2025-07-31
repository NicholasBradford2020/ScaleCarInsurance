import React, { useState } from 'react'
import { Search, Download, BookOpen, Calculator, Car, Wrench, DollarSign } from 'lucide-react'

interface RepairCostItem {
  id: string
  damageType: 'scratch' | 'dent' | 'structural' | 'glass' | 'paint' | 'mechanical'
  severity: 'minor' | 'moderate' | 'severe'
  vehicleCategory: 'compact' | 'sedan' | 'suv' | 'luxury' | 'truck'
  description: string
  baseCost: number
  laborHours: number
  partsCost: number
  totalCost: number
  confidence: 'high' | 'medium' | 'low'
  lastUpdated: string
}

const repairCostData: RepairCostItem[] = [
  // Scratches
  {
    id: 'scratch_1',
    damageType: 'scratch',
    severity: 'minor',
    vehicleCategory: 'compact',
    description: 'Surface scratch on door panel',
    baseCost: 150,
    laborHours: 1.5,
    partsCost: 50,
    totalCost: 200,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'scratch_2',
    damageType: 'scratch',
    severity: 'moderate',
    vehicleCategory: 'sedan',
    description: 'Deep scratch requiring paint touch-up',
    baseCost: 300,
    laborHours: 3,
    partsCost: 100,
    totalCost: 400,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'scratch_3',
    damageType: 'scratch',
    severity: 'severe',
    vehicleCategory: 'luxury',
    description: 'Multiple deep scratches requiring full panel repaint',
    baseCost: 800,
    laborHours: 6,
    partsCost: 200,
    totalCost: 1000,
    confidence: 'medium',
    lastUpdated: '2024-01-15'
  },
  // Dents
  {
    id: 'dent_1',
    damageType: 'dent',
    severity: 'minor',
    vehicleCategory: 'compact',
    description: 'Small dent on fender',
    baseCost: 200,
    laborHours: 2,
    partsCost: 0,
    totalCost: 200,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'dent_2',
    damageType: 'dent',
    severity: 'moderate',
    vehicleCategory: 'suv',
    description: 'Medium dent requiring paintless dent repair',
    baseCost: 400,
    laborHours: 4,
    partsCost: 0,
    totalCost: 400,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'dent_3',
    damageType: 'dent',
    severity: 'severe',
    vehicleCategory: 'truck',
    description: 'Large dent requiring panel replacement',
    baseCost: 1200,
    laborHours: 8,
    partsCost: 500,
    totalCost: 1700,
    confidence: 'medium',
    lastUpdated: '2024-01-15'
  },
  // Glass
  {
    id: 'glass_1',
    damageType: 'glass',
    severity: 'minor',
    vehicleCategory: 'sedan',
    description: 'Windshield chip repair',
    baseCost: 100,
    laborHours: 1,
    partsCost: 50,
    totalCost: 150,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'glass_2',
    damageType: 'glass',
    severity: 'moderate',
    vehicleCategory: 'suv',
    description: 'Side window replacement',
    baseCost: 300,
    laborHours: 2,
    partsCost: 200,
    totalCost: 500,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'glass_3',
    damageType: 'glass',
    severity: 'severe',
    vehicleCategory: 'luxury',
    description: 'Full windshield replacement with calibration',
    baseCost: 800,
    laborHours: 4,
    partsCost: 600,
    totalCost: 1400,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  // Structural
  {
    id: 'structural_1',
    damageType: 'structural',
    severity: 'minor',
    vehicleCategory: 'compact',
    description: 'Minor frame alignment',
    baseCost: 500,
    laborHours: 6,
    partsCost: 100,
    totalCost: 600,
    confidence: 'medium',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'structural_2',
    damageType: 'structural',
    severity: 'moderate',
    vehicleCategory: 'sedan',
    description: 'Frame straightening and reinforcement',
    baseCost: 1500,
    laborHours: 12,
    partsCost: 400,
    totalCost: 1900,
    confidence: 'medium',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'structural_3',
    damageType: 'structural',
    severity: 'severe',
    vehicleCategory: 'truck',
    description: 'Major structural repair with new components',
    baseCost: 3500,
    laborHours: 24,
    partsCost: 1200,
    totalCost: 4700,
    confidence: 'low',
    lastUpdated: '2024-01-15'
  },
  // Paint
  {
    id: 'paint_1',
    damageType: 'paint',
    severity: 'minor',
    vehicleCategory: 'compact',
    description: 'Single panel paint touch-up',
    baseCost: 250,
    laborHours: 3,
    partsCost: 100,
    totalCost: 350,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'paint_2',
    damageType: 'paint',
    severity: 'moderate',
    vehicleCategory: 'sedan',
    description: 'Multi-panel paint job with blending',
    baseCost: 800,
    laborHours: 8,
    partsCost: 300,
    totalCost: 1100,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'paint_3',
    damageType: 'paint',
    severity: 'severe',
    vehicleCategory: 'luxury',
    description: 'Full vehicle repaint with premium finish',
    baseCost: 2500,
    laborHours: 20,
    partsCost: 800,
    totalCost: 3300,
    confidence: 'medium',
    lastUpdated: '2024-01-15'
  },
  // Mechanical
  {
    id: 'mechanical_1',
    damageType: 'mechanical',
    severity: 'minor',
    vehicleCategory: 'compact',
    description: 'Bumper bracket replacement',
    baseCost: 150,
    laborHours: 2,
    partsCost: 80,
    totalCost: 230,
    confidence: 'high',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'mechanical_2',
    damageType: 'mechanical',
    severity: 'moderate',
    vehicleCategory: 'suv',
    description: 'Suspension component repair',
    baseCost: 600,
    laborHours: 6,
    partsCost: 300,
    totalCost: 900,
    confidence: 'medium',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'mechanical_3',
    damageType: 'mechanical',
    severity: 'severe',
    vehicleCategory: 'truck',
    description: 'Engine/transmission damage assessment',
    baseCost: 2000,
    laborHours: 16,
    partsCost: 1500,
    totalCost: 3500,
    confidence: 'low',
    lastUpdated: '2024-01-15'
  }
]

const RepairCostDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDamageType, setSelectedDamageType] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'totalCost' | 'confidence' | 'lastUpdated'>('totalCost')

  const filteredData = repairCostData.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.damageType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDamageType = selectedDamageType === 'all' || item.damageType === selectedDamageType
    const matchesSeverity = selectedSeverity === 'all' || item.severity === selectedSeverity
    const matchesVehicleCategory = selectedVehicleCategory === 'all' || item.vehicleCategory === selectedVehicleCategory

    return matchesSearch && matchesDamageType && matchesSeverity && matchesVehicleCategory
  })

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'totalCost':
        return a.totalCost - b.totalCost
      case 'confidence':
        const confidenceOrder = { high: 3, medium: 2, low: 1 }
        return confidenceOrder[b.confidence] - confidenceOrder[a.confidence]
      case 'lastUpdated':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      default:
        return 0
    }
  })

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-blue-100 text-blue-800'
      case 'moderate': return 'bg-orange-100 text-orange-800'
      case 'severe': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDamageTypeIcon = (damageType: string) => {
    switch (damageType) {
      case 'scratch': return <Wrench className="w-4 h-4" />
      case 'dent': return <Car className="w-4 h-4" />
      case 'glass': return <BookOpen className="w-4 h-4" />
      case 'structural': return <Calculator className="w-4 h-4" />
      case 'paint': return <Wrench className="w-4 h-4" />
      case 'mechanical': return <Calculator className="w-4 h-4" />
      default: return <Car className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary-600" />
              Repair Cost Database
            </h1>
            <p className="text-gray-600 mt-2">
              Standardized pricing database for vehicle damage assessment and repair cost estimation
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Database
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{repairCostData.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(repairCostData.reduce((sum, item) => sum + item.totalCost, 0) / repairCostData.length)}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Wrench className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {repairCostData.filter(item => item.confidence === 'high').length}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-2xl font-bold text-gray-900">Jan 15</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by damage type or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedDamageType}
              onChange={(e) => setSelectedDamageType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Damage Types</option>
              <option value="scratch">Scratch</option>
              <option value="dent">Dent</option>
              <option value="glass">Glass</option>
              <option value="structural">Structural</option>
              <option value="paint">Paint</option>
              <option value="mechanical">Mechanical</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="input-field"
            >
              <option value="all">All Severities</option>
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>

            <select
              value={selectedVehicleCategory}
              onChange={(e) => setSelectedVehicleCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Vehicles</option>
              <option value="compact">Compact</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
              <option value="truck">Truck</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field"
            >
              <option value="totalCost">Sort by Cost</option>
              <option value="confidence">Sort by Confidence</option>
              <option value="lastUpdated">Sort by Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Repair Cost Database ({filteredData.length} items)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Damage Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Labor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDamageTypeIcon(item.damageType)}
                      <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                        {item.damageType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{item.vehicleCategory}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(item.severity)}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.baseCost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.laborHours}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.partsCost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ${item.totalCost}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(item.confidence)}`}>
                      {item.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use This Database</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• <strong>Base Cost:</strong> Standard labor rate for the repair type</p>
            <p>• <strong>Labor Hours:</strong> Estimated time required for the repair</p>
            <p>• <strong>Parts Cost:</strong> Cost of replacement parts if needed</p>
            <p>• <strong>Total Cost:</strong> Combined cost of labor and parts</p>
            <p>• <strong>Confidence:</strong> Reliability of the cost estimate</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Updates</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• <strong>Monthly Updates:</strong> Prices are updated based on market rates</p>
            <p>• <strong>Regional Adjustments:</strong> Costs may vary by location</p>
            <p>• <strong>Vehicle-Specific:</strong> Luxury vehicles may have higher rates</p>
            <p>• <strong>Seasonal Factors:</strong> Some repairs may cost more during peak seasons</p>
            <p>• <strong>Technology Changes:</strong> New repair methods may affect pricing</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RepairCostDatabase 