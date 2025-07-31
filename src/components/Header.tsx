import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Car, Shield, BarChart3, BookOpen, CheckSquare, Wrench } from 'lucide-react'

const Header: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/new-claim', label: 'New Claim', icon: Car },
    { path: '/claims-approval', label: 'Approve Claims', icon: CheckSquare },
    { path: '/repair-shops', label: 'Repair Shops', icon: Wrench },
    { path: '/repair-costs', label: 'Cost Database', icon: BookOpen },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Claims</h1>
              <p className="text-xs text-gray-500">Powered by AI</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Claims Agent</p>
              <p className="text-xs text-gray-500">Agent ID: AGT-001</p>
            </div>
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 