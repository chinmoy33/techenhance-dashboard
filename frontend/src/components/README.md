# Data Visualizer Pro - Components Documentation

## 📊 Project Summary

Data Visualizer Pro is a sophisticated data analysis and visualization platform with integrated AI-powered recommendations. The components directory houses the core building blocks of the application's user interface and business logic.

## 🏗 Component Architecture

```mermaid
graph TD
    subgraph Core Components
        App[App.tsx] --> Layout[Layout Components]
        Layout --> Header[Header]
        Layout --> Sidebar[Sidebar]
        Layout --> Main[Main Content]
    end

    subgraph Feature Modules
        Main --> DataViz[Data Visualization]
        Main --> RecSystem[Recommendation System]
        Main --> LeadMgmt[Lead Management]
        Main --> Search[Search System]
    end

    subgraph Data Visualization
        DataViz --> ChartView[ChartView]
        DataViz --> AttributeSelector[AttributeSelector]
        DataViz --> RangeSelector[RangeSelector]
    end

    subgraph Recommendation System
        RecSystem --> RecList[Recommendations List]
        RecSystem --> RecCard[Recommendation Card]
        RecSystem --> LeadForm[Contact Form]
        RecSystem --> RecHistory[History View]
    end
```

## 🔧 Important Modules & Functions

### 1. Data Visualization Components

```mermaid
graph LR
    CV[ChartView] --> AS[AttributeSelector]
    CV --> RS[RangeSelector]
    CV --> CC[ChartContainer]
    
    AS --> CD[useChartData]
    RS --> CD
    CC --> CD
```

**Key Features:**
- Dynamic chart type selection
- Attribute filtering and mapping
- Range-based data filtering
- Real-time updates
- Export capabilities

### 2. Recommendation System

```mermaid
sequenceDiagram
    participant UI as RecommendationComponent
    participant Service as RecommendationService
    participant API as Backend API
    participant DB as Supabase

    UI->>Service: Request Recommendations
    Service->>API: GET /api/recommendations
    API->>DB: Query Eligible Clients
    DB-->>API: Return Client Data
    API-->>Service: Process & Return Data
    Service-->>UI: Update UI State
```

**Key Components:**
- Recommendations.tsx: Main recommendation view
- LoanApplicantCard.tsx: Individual recommendation display
- ContactForm.tsx: Lead capture form
- RecommendationTable.tsx: Historical view

## 🚀 Setup Instructions

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Environment Configuration**
```bash
# .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_anon_key
VITE_CORE_API=http://localhost:3001
VITE_REC_API=http://localhost:3002
```

3. **Start Development Server**
```bash
npm run dev
```

## 📍 Component File Structure

```
components/
├── ChartView/
│   ├── ChartView.tsx         # Main chart component
│   ├── ChartContainer.tsx    # Chart rendering
│   └── README.md            # Chart documentation
├── recommendations/
│   ├── Recommendations.tsx   # Main recommendation component
│   ├── LoanApplicantCard.tsx # Individual recommendation
│   ├── ContactForm.tsx       # Lead form
│   └── README.md            # Recommendation docs
├── Leadtracking/
│   ├── LeadTable.tsx        # Lead management
│   └── LeadStats.tsx        # Lead analytics
├── Search/
│   └── SearchCustomer.tsx   # Customer search
└── shared/
    ├── Header.tsx           # App header
    ├── Sidebar.tsx          # Navigation
    └── utils/               # Shared utilities
```

## 🔄 State Management

### Redux Store Structure
```typescript
interface RootState {
  ui: {
    showContactForm: boolean;
    showFilters: boolean;
  };
  leads: {
    items: Lead[];
    hasClicked: boolean;
  };
  recommendations: {
    items: Recommendation[];
    loading: boolean;
  };
}
```

### Data Flow
```mermaid
graph TD
    Action[User Action] --> Dispatch[Dispatch Action]
    Dispatch --> Reducer[Redux Reducer]
    Reducer --> State[State Update]
    State --> UI[UI Re-render]
    
    State --> Service[API Service]
    Service --> Backend[Backend API]
    Backend --> Service
    Service --> State
```

## 📊 Component Integration

### 1. Chart Integration
```typescript
interface ChartProps {
  data: Dataset;
  type: ChartType;
  options: ChartOptions;
}
```

### 2. Recommendation Integration
```typescript
interface RecommendationProps {
  applicant: RecommendationData;
  onContact: (id: number) => void;
}
```

## 🛠 Development Tools

1. **VS Code Extensions**
   - ESLint
   - Prettier
   - TypeScript
   - Tailwind CSS IntelliSense

2. **Browser Tools**
   - React DevTools
   - Redux DevTools
   - Chrome DevTools

## 🔐 Security Considerations

1. **Input Validation**
   - Form data validation
   - Type checking
   - XSS prevention

2. **Authentication**
   - Protected routes
   - Token management
   - Session handling

## 🎨 Styling Guidelines

1. **Tailwind CSS Classes**
   - Utility-first approach
   - Component-specific styles
   - Responsive design patterns

2. **Theme Configuration**
   - Color schemes
   - Typography
   - Spacing system

## 🚀 Performance Optimization

1. **React Optimization**
   - Memoization
   - Code splitting
   - Lazy loading
   - Virtual scrolling

2. **Data Management**
   - Caching strategies
   - Pagination
   - Debouncing/Throttling
