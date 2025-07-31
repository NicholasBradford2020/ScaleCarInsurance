# AI-Powered Car Insurance Claims System

[![Build Status](https://github.com/YOUR_USERNAME/car-insurance-claims-system/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/car-insurance-claims-system/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

A modern, React-based web application for streamlining car insurance claims processing with AI-powered damage analysis, automated cost estimation, and integrated repair shop management.

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🎯 Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📦 Installation](#-installation)
- [🏗️ Project Structure](#️-project-structure)
- [📋 Usage Guide](#-usage-guide)
- [🔧 Configuration](#-configuration)
- [🧪 Testing](#-testing)
- [📊 Data Models](#-data-models)
- [🔒 Security Considerations](#-security-considerations)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [🆘 Support](#-support)
- [🔮 Future Enhancements](#-future-enhancements)

## 🚀 Features

### Core Functionality
- **Multi-step Claim Creation**: Intuitive form-based claim submission with validation
- **AI Damage Analysis**: Automated assessment of vehicle damage from uploaded media
- **Cost Database Integration**: Standardized repair cost references and estimates
- **Media Upload**: Support for both photos and videos with preview capabilities
- **Progress Persistence**: Auto-save functionality to prevent data loss
- **Import Existing Tickets**: Pre-fill forms using existing claim data

### Claims Management
- **Dashboard Overview**: Real-time statistics and recent claims display
- **Claims Approval System**: Dedicated interface for reviewing and approving claims
- **Individual Assessment Control**: Approve or reject specific damage assessments
- **Status Tracking**: Monitor claim progress from pending to approved/rejected

### Repair Shop Integration
- **Local Shop Directory**: Comprehensive database of approved repair shops
- **Shop Assignment**: Automatic assignment with ability to change to alternatives
- **Shop Details**: Ratings, specialties, certifications, and operational hours
- **Distance-based Sorting**: Find the closest available repair shops

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with Tailwind CSS styling
- **Real-time Updates**: Live data updates without page refreshes
- **Error Handling**: Comprehensive validation and error messaging

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API with useReducer
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Persistence**: localStorage for client-side storage
- **Development**: Hot reload with TypeScript compilation

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/car-insurance-claims-system.git
   cd car-insurance-claims-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3005` to view the application

### 🎯 Live Demo

Visit the live demo: [https://your-username.github.io/car-insurance-claims-system](https://your-username.github.io/car-insurance-claims-system)

### 📱 Features Preview

- **Dashboard**: Real-time statistics and claim overview
- **New Claims**: Multi-step form with AI analysis
- **Claims Approval**: Bulk operations and individual reviews
- **Repair Shops**: Local directory with ratings and details
- **Cost Database**: Standardized repair cost references

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   └── ClaimCard.tsx   # Claim display component
├── context/            # React Context for state management
│   └── ClaimsContext.tsx # Main state management
├── data/               # Static data and mock data
│   └── repairShops.ts  # Repair shop database
├── pages/              # Main application pages
│   ├── Dashboard.tsx           # Main dashboard
│   ├── NewClaim.tsx            # Claim creation form
│   ├── ClaimDetails.tsx        # Individual claim view
│   ├── ClaimsApproval.tsx      # Claims approval interface
│   ├── RepairShops.tsx         # Repair shop directory
│   └── RepairCostDatabase.tsx  # Cost reference database
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 📋 Usage Guide

### Creating a New Claim

1. **Navigate to "New Claim"** from the dashboard
2. **Fill in customer and vehicle information** in Step 1
3. **Upload photos and videos** of the damage in Step 2
4. **Run AI analysis** to automatically assess damage
5. **Review and approve assessments** in Step 3
6. **Submit the claim** to complete the process

### Managing Claims

- **View all claims** on the dashboard
- **Click on a claim** to see detailed information
- **Use the approval interface** to review pending claims
- **Change repair shop assignments** as needed

### Finding Repair Shops

- **Browse the repair shop directory** for local options
- **Filter by specialty, rating, or distance**
- **View detailed shop information** including hours and certifications
- **Select a featured shop** for quick access

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Car Insurance Claims System
VITE_API_BASE_URL=http://localhost:3000/api
```

### Customization

- **Styling**: Modify `tailwind.config.js` for theme customization
- **Data**: Update mock data in `src/data/` for different scenarios
- **Validation**: Adjust form validation rules in `NewClaim.tsx`

## 🧪 Testing

### Running Tests

```bash
npm run test
```

### Type Checking

```bash
npm run type-check
```

## 📊 Data Models

### Claim Structure
```typescript
interface Claim {
  id: string
  policyNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  accidentDate: string
  accidentDescription: string
  photos: string[]
  videos: string[]
  status: 'pending' | 'processing' | 'approved' | 'rejected'
  damageAssessments: DamageAssessment[]
  totalEstimatedCost: number
  repairShopId?: string
  createdAt: string
  updatedAt: string
  aiAnalysisComplete: boolean
  processingTime?: number
}
```

### Damage Assessment
```typescript
interface DamageAssessment {
  id: string
  type: 'scratch' | 'dent' | 'structural' | 'glass' | 'paint'
  severity: 'minor' | 'moderate' | 'severe'
  location: string
  estimatedCost: number
  confidence: number
}
```

## 🔒 Security Considerations

- **Client-side Storage**: Data is stored in localStorage (not suitable for production)
- **Input Validation**: All user inputs are validated before processing
- **File Upload**: Media files are converted to base64 for storage
- **Error Handling**: Comprehensive error boundaries and validation

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your web server

3. **Configure your server** to serve the React app

### Recommended Hosting

- **Vercel**: Easy deployment with automatic builds
- **Netlify**: Simple drag-and-drop deployment
- **AWS S3 + CloudFront**: Scalable static hosting
- **Firebase Hosting**: Google's hosting solution

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

### Code Style

- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Add JSDoc comments for complex functions
- Maintain consistent formatting with Prettier

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. **Check the documentation** in this README
2. **Review the code comments** for implementation details
3. **Open an issue** on GitHub for bugs or feature requests
4. **Contact the development team** for urgent matters

## 🔮 Future Enhancements

### Planned Features
- **Backend Integration**: Real API endpoints for data persistence
- **User Authentication**: Secure login and role-based access
- **Real AI Integration**: Connect to actual AI damage analysis services
- **Mobile App**: React Native version for field agents
- **Reporting**: Advanced analytics and reporting dashboard
- **Integration APIs**: Connect with insurance company systems

### Technical Improvements
- **Database Integration**: Replace localStorage with proper database
- **Real-time Updates**: WebSocket integration for live updates
- **Offline Support**: Service worker for offline functionality
- **Performance Optimization**: Code splitting and lazy loading
- **Accessibility**: WCAG compliance improvements

---

**Built with ❤️ for modern insurance claims processing** 