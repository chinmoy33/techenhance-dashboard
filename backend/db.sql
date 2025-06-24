CREATE TABLE IF NOT EXISTS datasets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO datasets (name, data, type) VALUES 
(
  'Sales Data',
  '[
    {"month": "Jan", "sales": 1200, "revenue": 15000},
    {"month": "Feb", "sales": 1900, "revenue": 23000},
    {"month": "Mar", "sales": 3000, "revenue": 35000},
    {"month": "Apr", "sales": 5000, "revenue": 58000},
    {"month": "May", "sales": 4200, "revenue": 48000},
    {"month": "Jun", "sales": 3800, "revenue": 42000}
  ]'::jsonb,
  'time_series'
);

INSERT INTO datasets (name, data, type, created_at, updated_at) VALUES
(
  'Product Categories',
  '[
    { "category": "Electronics", "value": 35 },
    { "category": "Clothing", "value": 25 },
    { "category": "Books", "value": 15 },
    { "category": "Home & Garden", "value": 15 },
    { "category": "Sports", "value": 10 }
  ]'::jsonb,
  'categorical',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'Age Distribution',
  '[
    {"age": 18, "count": 67},
    {"age": 19, "count": 84},
    {"age": 20, "count": 56},
    {"age": 21, "count": 71},
    {"age": 22, "count": 93},
    {"age": 23, "count": 42},
    {"age": 24, "count": 58},
    {"age": 25, "count": 76},
    {"age": 26, "count": 61},
    {"age": 27, "count": 45},
    {"age": 28, "count": 97},
    {"age": 29, "count": 62},
    {"age": 30, "count": 88},
    {"age": 31, "count": 41},
    {"age": 32, "count": 54},
    {"age": 33, "count": 73},
    {"age": 34, "count": 80},
    {"age": 35, "count": 50},
    {"age": 36, "count": 78},
    {"age": 37, "count": 61},
    {"age": 38, "count": 64},
    {"age": 39, "count": 43},
    {"age": 40, "count": 91},
    {"age": 41, "count": 59},
    {"age": 42, "count": 39},
    {"age": 43, "count": 55},
    {"age": 44, "count": 68},
    {"age": 45, "count": 47},
    {"age": 46, "count": 74},
    {"age": 47, "count": 82},
    {"age": 48, "count": 65},
    {"age": 49, "count": 60},
    {"age": 50, "count": 40},
    {"age": 51, "count": 86},
    {"age": 52, "count": 33},
    {"age": 53, "count": 52},
    {"age": 54, "count": 46},
    {"age": 55, "count": 89},
    {"age": 56, "count": 38},
    {"age": 57, "count": 70},
    {"age": 58, "count": 48},
    {"age": 59, "count": 66},
    {"age": 60, "count": 49},
    {"age": 61, "count": 75},
    {"age": 62, "count": 63},
    {"age": 63, "count": 51},
    {"age": 64, "count": 69},
    {"age": 65, "count": 44},
    {"age": 66, "count": 53 },
    {"age": 67, "count": 87}
  ]'::jsonb,
  'distribution',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

--For Recommendation Table

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    salary INTEGER,
    creditScore INTEGER,
    employmentYears INTEGER,
    loanType TEXT,
    requestedAmount INTEGER,
    riskLevel TEXT,
    employmentType TEXT,
    monthlyExpenses INTEGER,
    assets INTEGER,
    previousLoans INTEGER,
    avatar TEXT
);

-- Step 2: Insert data
INSERT INTO recommendations (id, name, email, phone, age, salary, creditScore, employmentYears, loanType, requestedAmount, riskLevel, employmentType, monthlyExpenses, assets, previousLoans, avatar) VALUES
('1', 'Sarah Johnson', 'sarah.johnson@email.com', '+1 (555) 123-4567', 32, 85000, 780, 8, 'house', 450000, 'low', 'Full-time', 3200, 120000, 1, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('2', 'Michael Chen', 'michael.chen@email.com', '+1 (555) 234-5678', 28, 62000, 720, 5, 'car', 35000, 'low', 'Full-time', 2800, 45000, 0, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('3', 'Emily Rodriguez', 'emily.rodriguez@email.com', '+1 (555) 345-6789', 35, 92000, 820, 12, 'business', 150000, 'low', 'Self-employed', 4100, 280000, 2, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('4', 'David Thompson', 'david.thompson@email.com', '+1 (555) 456-7890', 41, 68000, 680, 15, 'personal', 25000, 'medium', 'Full-time', 3600, 85000, 3, 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('5', 'Lisa Anderson', 'lisa.anderson@email.com', '+1 (555) 567-8901', 29, 78000, 750, 6, 'house', 380000, 'low', 'Full-time', 2900, 95000, 1, 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('6', 'James Wilson', 'james.wilson@email.com', '+1 (555) 678-9012', 33, 55000, 640, 9, 'car', 28000, 'medium', 'Full-time', 3100, 32000, 2, 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('7', 'Maria Garcia', 'maria.garcia@email.com', '+1 (555) 789-0123', 38, 110000, 800, 14, 'business', 200000, 'low', 'Self-employed', 4800, 350000, 1, 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('8', 'Robert Taylor', 'robert.taylor@email.com', '+1 (555) 890-1234', 26, 48000, 600, 3, 'personal', 15000, 'high', 'Full-time', 2400, 18000, 1, 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop');
