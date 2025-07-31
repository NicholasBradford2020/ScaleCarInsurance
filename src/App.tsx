
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import NewClaim from './pages/NewClaim'
import ClaimDetails from './pages/ClaimDetails'
import ClaimsApproval from './pages/ClaimsApproval'
import RepairShops from './pages/RepairShops'
import RepairCostDatabase from './pages/RepairCostDatabase'
import EditClaim from './pages/EditClaim'
import { ClaimsProvider } from './context/ClaimsContext'

function App() {
  return (
    <ClaimsProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new-claim" element={<NewClaim />} />
              <Route path="/claim/:id" element={<ClaimDetails />} />
              <Route path="/edit-claim/:id" element={<EditClaim />} />
              <Route path="/claims-approval" element={<ClaimsApproval />} />
              <Route path="/repair-shops" element={<RepairShops />} />
              <Route path="/repair-costs" element={<RepairCostDatabase />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ClaimsProvider>
  )
}

export default App 