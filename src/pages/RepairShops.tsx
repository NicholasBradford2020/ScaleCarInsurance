import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Clock, 
  Car, 
  ArrowRight,
  Navigation,
  MessageSquare
} from 'lucide-react'
import { repairShops, RepairShop } from '../data/repairShops'

const RepairShops: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState<number>(0)
  const [specialtyFilter] = useState('')
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance')
  const [featuredShopId, setFeaturedShopId] = useState<string>('shop_001')


  // Filter and sort shops
  const filteredShops = useMemo(() => {
    let shops = repairShops.filter(shop => {
      const matchesSearch = 
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      
      const matchesLocation = !locationFilter || 
        shop.city.toLowerCase().includes(locationFilter.toLowerCase())
      
      const matchesRating = shop.rating >= ratingFilter
      
      const matchesSpecialty = !specialtyFilter || 
        shop.specialties.some(specialty => 
          specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
        )
      
      return matchesSearch && matchesLocation && matchesRating && matchesSpecialty
    })

    // Sort shops
    shops.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'distance':
          comparison = a.distance - b.distance
          break
        case 'rating':
          comparison = b.rating - a.rating
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
      }
      return comparison
    })

    return shops
  }, [repairShops, searchTerm, locationFilter, ratingFilter, specialtyFilter, sortBy])

  // Get the featured shop
  const featuredShop = repairShops.find(shop => shop.id === featuredShopId) || repairShops[0]

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  const getSpecialtyBadges = (specialties: string[]) => {
    return specialties.map((specialty, index) => (
      <span
        key={index}
        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
      >
        {specialty}
      </span>
    ))
  }

  const getCertificationBadges = (certifications: string[]) => {
    return certifications.map((cert, index) => (
      <span
        key={index}
        className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
      >
        {cert}
      </span>
    ))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Local Repair Shops</h1>
          <p className="text-gray-600 mt-2">Find certified auto body repair shops in your area</p>
        </div>
        <Link
          to="/"
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowRight className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Featured Shop */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Featured Local Shop</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Change featured shop:</span>
            <select
              value={featuredShopId}
              onChange={(e) => setFeaturedShopId(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {repairShops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{featuredShop.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{featuredShop.address}, {featuredShop.city}, {featuredShop.state} {featuredShop.zipCode}</span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {getRatingStars(featuredShop.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {featuredShop.rating} ({featuredShop.reviewCount} reviews)
                  </span>
                  <span className="text-lg font-semibold text-primary-600 ml-2">
                    {featuredShop.distance} mi away
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  featuredShop.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {featuredShop.isOpen ? 'Open Now' : 'Closed'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h4>
                <div className="flex flex-wrap">
                  {getSpecialtyBadges(featuredShop.specialties)}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications:</h4>
                <div className="flex flex-wrap">
                  {getCertificationBadges(featuredShop.certifications)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{featuredShop.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{featuredShop.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="h-4 w-4" />
                <a href={`https://${featuredShop.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                  {featuredShop.website}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Est. {featuredShop.estimatedWaitTime}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Hours:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {Object.entries(featuredShop.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{day}:</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            <option value="Downtown">Downtown</option>
            <option value="Midtown">Midtown</option>
            <option value="Historic District">Historic District</option>
            <option value="Innovation Park">Innovation Park</option>
            <option value="Suburban Heights">Suburban Heights</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={0}>All Ratings</option>
            <option value={4.5}>4.5+ Stars</option>
            <option value={4.0}>4.0+ Stars</option>
            <option value={3.5}>3.5+ Stars</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="distance">Sort by Distance</option>
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredShops.map((shop) => (
          <div key={shop.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{shop.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{shop.address}, {shop.city}, {shop.state} {shop.zipCode}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    {getRatingStars(shop.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {shop.rating} ({shop.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-primary-600">
                  {shop.distance} mi
                </div>
                <div className={`text-sm ${shop.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {shop.isOpen ? 'Open' : 'Closed'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Specialties */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Specialties:</h4>
                <div className="flex flex-wrap">
                  {getSpecialtyBadges(shop.specialties)}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Certifications:</h4>
                <div className="flex flex-wrap">
                  {getCertificationBadges(shop.certifications)}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{shop.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{shop.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4" />
                  <a href={`https://${shop.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                    {shop.website}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Est. {shop.estimatedWaitTime}</span>
                </div>
              </div>

              {/* Hours */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Hours:</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                  {Object.entries(shop.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}:</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                <button className="btn-primary flex items-center space-x-2 flex-1 justify-center">
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2 flex-1 justify-center">
                  <MessageSquare className="h-4 w-4" />
                  <span>Message</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <Navigation className="h-4 w-4" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <Car className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No repair shops found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or expanding your location.</p>
        </div>
      )}
    </div>
  )
}

export default RepairShops 