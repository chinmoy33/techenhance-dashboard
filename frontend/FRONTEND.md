# Data Visualizer Pro Frontend

A modern, feature-rich data visualization dashboard built with React, TypeScript, and Chart.js.

## 🌟 Features

### 1. Authentication

- Email/Password authentication
- Google OAuth integration
- Protected routes for authenticated users
- Session management with Supabase

### 2. Data Management

- CSV file upload and parsing
- Sample data generation
- Dataset organization and management
- Real-time data updates
- Export data in CSV/JSON formats

### 3. Visualization Features

- Multiple chart types:
  - Line charts
  - Bar charts
  - Pie charts
  - Scatter plots
  - Radar charts
  - Histograms
- Interactive chart customization:
  - Zoom functionality
  - Pan controls
  - Data point tooltips
  - Legend customization
  - Color scheme selection
- Range selection for data filtering
- Date-based visualization
- Dynamic axis scaling
- Full-screen mode

### 4. Data Analysis

- Attribute selection and filtering
- Date range filtering
- Data preview tables
- Statistical summaries
- Real-time data filtering
- Automatic data type detection (string/number/date)

### 5. Recommendations System

- Loan applicant analysis
- Risk level assessment
- Credit score calculation
- Filtering and sorting capabilities
- Statistical overview

### 6. Search Functionality

- Advanced customer search
- Transaction history viewing
- Profile information display
- Real-time search results
- Paginated results

### 7. UI/UX Features

- Responsive design for mobile/tablet/desktop
- Dark theme with glassmorphism effects
- Animated transitions
- Loading states and indicators
- Error boundaries
- Toast notifications
- Keyboard shortcuts
- Collapsible sidebar

## 🛠 Technical Stack

- **Framework:** React with TypeScript
- **State Management:** Redux
- **Styling:** Tailwind CSS
- **Charts:** Chart.js with React-Chartjs-2
- **Authentication:** Supabase Auth
- **HTTP Client:** Axios
- **Date Handling:** Day.js
- **Form Management:** React Hook Form
- **Build Tool:** Vite

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChartView/         # Chart rendering components
│   │   ├── chartModules/      # Chart-related modules
│   │   ├── recommendations/   # Recommendation system
│   │   ├── Searchcustomerpage/# Customer search interface
│   │   └── utils/              # Reusable Utility functions
│   │   ├── hooks/              # Custom Hooks for ChartView
│   ├── pages/                 # Main application pages
│   ├── services/             # API and data services
│   ├── store/               # Redux store configuration
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── hooks/               # Custom React hooks
```

## 🚀 Key Component Features

### ChartView

- Dynamic chart type switching
- Attribute selection
- Range filtering
- Export capabilities
- Full-screen mode
- Chart configuration

### DataManager

- File upload handling
- Dataset management
- Data validation
- Sample data generation
- Export functionality

### RangeSelector

- Numeric range selection
- Date range picking
- Custom date formatting
- Real-time updates

### Recommendations

- Risk assessment algorithms
- Filtering controls
- Sorting capabilities
- Statistical analysis
- Profile card display

### SearchCustomerPage

- Real-time search
- Result grouping
- Transaction history
- Profile information
- Pagination

## 🔧 Configuration

The frontend uses several configuration files:

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `eslint.config.js` - ESLint rules

## 🎨 Styling

The project uses a combination of:

- Tailwind CSS for utility-first styling
- CSS Modules for component-specific styles
- Custom CSS variables for theming
- Responsive design breakpoints

## 🔐 Security Features

- JWT token management
- Protected routes
- Input sanitization
- API request validation
- Error boundaries
- Session management

## 🏃‍♂️ Performance Optimizations

- Code splitting
- Lazy loading
- Memoization
- Debounced search
- Throttled chart updates
- Image optimization

## 📱 Responsive Design

- Mobile-first approach
- Tablet-optimized layouts
- Desktop enhancements
- Touch-friendly controls
- Flexible grid system

## 🌐 Browser Support

Supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🛠 Development Tools

- React DevTools
- Redux DevTools
- Chrome DevTools
- VS Code configurations
- TypeScript language service
