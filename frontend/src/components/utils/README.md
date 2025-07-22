# Utility Functions Documentation

## 📊 Overview

The utils folder contains core utility functions that handle data processing, chart generation, date manipulation, and scoring algorithms. These utilities are used throughout the application to maintain consistent data handling and visualization logic.

## 🔄 File Structure and Dependencies

```mermaid
graph TD
    subgraph Utils
        CD[chartDataUtils.ts]
        CO[chartOptions.ts]
        DU[dateUtils.ts]
        SA[ScoreApplicants.ts]
    end

    subgraph Components
        CV[ChartView]
        AS[AttributeSelector]
        RS[RangeSelector]
        RC[Recommendations]
    end

    subgraph Hooks
        HC[useChartData]
        HS[useChartState]
        HSA[useSortApplicants]
    end

    DU --> AS
    DU --> CV
    DU --> RS

    CD --> HC
    CO --> HC

    SA --> RC
    SA --> HSA

    classDef utils fill:#f9f,stroke:#333,stroke-width:2px
    classDef components fill:#bbf,stroke:#333,stroke-width:2px
    classDef hooks fill:#bfb,stroke:#333,stroke-width:2px

    class CD,CO,DU,SA utils
    class CV,AS,RS,RC components
    class HC,HS,HSA hooks
```

## 📝 Detailed File Descriptions

### 1. `chartDataUtils.ts`

Core functions for chart data processing and generation.

```mermaid
graph TD
    A[Raw Data] --> B[analyzeSelectedAttributes]
    B --> C[getCompatibleChartTypes]
    B --> D[generateChartData]
    D --> E[Pie/Doughnut]
    D --> F[Line/Bar]
    D --> G[Scatter]
    D --> H[Radar]
    D --> I[Histogram]
```

**Key Functions:**

- `analyzeSelectedAttributes`: Determines data types in selected columns
- `getCompatibleChartTypes`: Suggests suitable chart types based on data
- `generateCategoricalChartData`: Processes data for pie/doughnut charts
- `generateLineBarChartData`: Handles line and bar chart data
- `generateScatterChartData`: Prepares scatter plot data
- `generateRadarChartData`: Creates radar chart datasets
- `generateHistogramChartData`: Builds frequency distribution data

### 2. `chartOptions.ts`

Configurations for Chart.js visualizations.

```mermaid
graph LR
    A[Chart Type] --> B[getChartOptions]
    B --> C[Scales Config]
    B --> D[Plugin Config]
    B --> E[Interaction Config]
    B --> F[Animation Config]
```

**Features:**

- Responsive design options
- Zoom and pan configurations
- Custom tooltips and legends
- Axis formatting and scaling
- Animation settings

### 3. `dateUtils.ts`

Date parsing and validation utilities.

```mermaid
graph TD
    A[Input String] --> B[isDateString]
    B --> C{Pattern Match}
    C -->|Yes| D[Parse Date]
    C -->|No| E[Return False]
    D --> F{Validate Range}
    F -->|Valid| G[Return True]
    F -->|Invalid| H[Return False]
```

**Capabilities:**

- Multiple date format detection
- Date string validation
- Format conversion
- Range validation
- Supports formats:
  - DD/MM/YYYY
  - YYYY-MM-DD
  - MM/DD/YYYY
  - Text formats (e.g., "January 15, 2021")

### 4. `ScoreApplicants.ts`

Risk assessment and scoring algorithms.

```mermaid
graph TD
    A[Applicant Data] --> B[scoreApplicant]
    B --> C[Calculate Credit Score]
    B --> D[Assess Income]
    B --> E[Evaluate History]
    C --> F[Risk Score]
    D --> F
    E --> F
```

**Scoring Factors:**

- Credit history analysis
- Income evaluation
- Loan type consideration
- Risk level determination

## 🔄 Integration Examples

### Chart Data Processing Flow:

```mermaid
sequenceDiagram
    participant Component
    participant Utils
    participant Hooks

    Component->>Utils: Send raw data
    Utils->>Utils: Analyze data types
    Utils->>Utils: Check compatibility
    Utils->>Utils: Generate chart data
    Utils->>Hooks: Return processed data
    Hooks->>Component: Update visualization
```

### Date Processing Flow:

```mermaid
sequenceDiagram
    participant Input
    participant DateUtils
    participant Component

    Input->>DateUtils: Date string
    DateUtils->>DateUtils: Check format
    DateUtils->>DateUtils: Validate
    DateUtils->>DateUtils: Parse
    DateUtils->>Component: Return result
```

## 🔗 Dependencies

- **External Libraries:**
  - Chart.js
  - date-fns
  - lodash (for data manipulation)

## 🛠 Usage Guidelines

1. **Data Processing:**

   ```typescript
   import { analyzeSelectedAttributes } from "../utils/chartDataUtils";
   const { numeric, categorical } = analyzeSelectedAttributes(
     dataset,
     attributes
   );
   ```

2. **Date Validation:**

   ```typescript
   import { isDateString } from "../utils/dateUtils";
   const isValid = isDateString(dateValue);
   ```

3. **Chart Options:**

   ```typescript
   import { getChartOptions } from "../utils/chartOptions";
   const options = getChartOptions(chartType, config);
   ```

4. **Risk Scoring:**
   ```typescript
   import { scoreApplicant } from "../utils/ScoreApplicants";
   const riskScore = scoreApplicant(applicantData);
   ```

## 🔍 Debugging Tips

1. Check data types before processing
2. Verify date formats match expected patterns
3. Ensure chart data structure matches Chart.js requirements
4. Validate scoring inputs for completeness

## 🚀 Performance Considerations

- Use memoization for expensive calculations
- Implement throttling for real-time updates
- Consider data chunking for large datasets
- Cache processed results when possible
