import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';

const router = express.Router();
export default router;

const app = express();
const PORT = 3001;
const JWT_SECRET = 'agrisense_secret_key_2025';

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Hardcoded users
const USERS = [
  { username: 'farmer', password: '1234', role: 'farmer' },
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'demo', password: 'demo', role: 'demo' }
];

// Sample data
const DEMO_CROP_DATA = [
  { date: '2026-11-10', crop: 'Wheat', ndvi: 0.75, moisture: 23, status: 'Excellent' },
  { date: '2026-06-02', crop: 'Rice', ndvi: 0.80, moisture: 45, status: 'Excellent' },
  { date: '2026-06-03', crop: 'Corn', ndvi: 0.55, moisture: 12, status: 'Good' },
  { date: '2027-01-04', crop: 'Wheat', ndvi: 0.82, moisture: 28, status: 'Excellent' },
  { date: '2027-07-05', crop: 'Rice', ndvi: 0.71, moisture: 42, status: 'Excellent' },
  { date: '2026-07-03', crop: 'Corn', ndvi: 0.72, moisture: 12, status: 'Excellent' },

];

const DEMO_SOIL_DATA = {
  moisture: 23,
  ph: 6.5,
  temperature: 29,
  nitrogen: 45,
  phosphorus: 32,
  potassium: 28
};

const DEMO_WEATHER_DATA = [
  { date: '2025-01-01', rainfall: 12, temperature: 28 },
  { date: '2025-01-02', rainfall: 8, temperature: 30 },
  { date: '2025-01-03', rainfall: 0, temperature: 35 },
  { date: '2025-01-04', rainfall: 15, temperature: 26 },
  { date: '2025-01-05', rainfall: 5, temperature: 29 },
  { date: '2025-01-06', rainfall: 18, temperature: 24 },
  { date: '2025-01-07', rainfall: 22, temperature: 22 }
];

const DEMO_ALERTS = [
  {
    id: 1,
    type: 'warning',
    title: 'Drought Stress Detected',
    message: 'Corn crops showing signs of water stress. Consider irrigation.',
    severity: 'high',
    timestamp: '2025-01-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'info',
    title: 'Optimal Growing Conditions',
    message: 'Wheat crops experiencing ideal NDVI values.',
    severity: 'low',
    timestamp: '2025-01-15T09:15:00Z'
  },
  {
    id: 3,
    type: 'danger',
    title: 'Pest Outbreak Risk',
    message: 'High risk of pest outbreak in rice fields. Monitor closely.',
    severity: 'critical',
    timestamp: '2025-01-15T11:45:00Z'
  }
];

// Auth middleware


// Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { username: user.username, role: user.role }
  });
});

app.get('/api/demo-data', (req, res) => {
  res.json({
    cropData: DEMO_CROP_DATA,
    soilData: DEMO_SOIL_DATA,
    weatherData: DEMO_WEATHER_DATA
  });
});

app.post('/api/upload', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const csvData = req.file.buffer.toString();
  
  parse(csvData, {
    columns: true,
    skip_empty_lines: true
  }, (err, records) => {
    if (err) {
      return res.status(400).json({ error: 'Error parsing CSV file' });
    }

    // Basic data processing
    const summary = {
      totalRecords: records.length,
      columns: records.length > 0 ? Object.keys(records[0]) : [],
      dataTypes: {}
    };

    if (records.length > 0) {
      Object.keys(records[0]).forEach(key => {
        const sampleValue = records[0][key];
        if (!isNaN(sampleValue) && !isNaN(parseFloat(sampleValue))) {
          summary.dataTypes[key] = 'number';
        } else {
          summary.dataTypes[key] = 'string';
        }
      });
    }

    res.json({
      data: records,
      summary
    });
  });
});

app.get('/api/alerts', (req, res) => {
  res.json(DEMO_ALERTS);
});

app.get('/api/reports/generate', (req, res) => {
  // Simulate PDF generation
  const reportData = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFields: 12,
      healthyFields: 8,
      fieldAtRisk: 4,
      avgNDVI: 0.68,
      avgMoisture: 28.5
    },
    recommendations: [
      'Increase irrigation in field sections with NDVI < 0.5',
      'Apply nitrogen fertilizer to improve crop health',
      'Monitor pest activity in high-risk areas'
    ]
  };

  res.json(reportData);
});

// app.get('/api/chat', (req, res) => {
  
// });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



const qaFilePath = path.join(process.cwd(), "adminQA.json");

function loadAdminQA() {
  try {
    const data = fs.readFileSync(qaFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Crop calendar (India / Tamil Nadu based)
const cropCalendar = {
  kharif: ["Rice", "Maize", "Cotton", "Groundnut", "Sugarcane"],
  rabi: ["Wheat", "Chickpea", "Mustard", "Barley"],
  summer: ["Green gram", "Black gram", "Watermelon", "Cucumber"]
};

// Fertilizer schedule templates
const fertilizerSchedule = {
  rice: "Rice: Apply Basal NPK before transplanting, Top dressing at tillering and panicle initiation.",
  maize: "Maize: Apply NPK as basal, Nitrogen at knee-high stage.",
  cotton: "Cotton: Basal NPK + Nitrogen split doses at flowering.",
  groundnut: "Groundnut: Gypsum at flowering, balanced NPK."
};

// Weather-based manual tips
function getWeatherTip(message) {
  const msg = message.toLowerCase();

  if (msg.includes("rain")) {
    return "🌧️ Rainy weather: Ensure proper drainage. Avoid fertilizer application during heavy rain.";
  }

  if (msg.includes("hot") || msg.includes("heat")) {
    return "🔥 Hot weather: Increase irrigation frequency. Mulching helps reduce soil moisture loss.";
  }

  if (msg.includes("cold") || msg.includes("winter")) {
    return "❄️ Cold weather: Protect young crops from frost. Irrigate lightly in mornings.";
  }

  return null;
}

// Main chat route
app.post("/chat", (req, res) => {
  try {
    const message = (req.body.message || "").toLowerCase().trim();

    if (!message) {
      return res.json({ reply: "Please send a valid message." });
    }

    // 1️⃣ Admin Q&A matching
    const adminQA = loadAdminQA();
    for (const item of adminQA) {
      if (message.includes(item.question.toLowerCase())) {
        return res.json({ reply: item.answer });
      }
    }

    // 2️⃣ Crop calendar
    if (message.includes("kharif")) {
      return res.json({
        reply: "🌾 Kharif Crops: " + cropCalendar.kharif.join(", ")
      });
    }

    if (message.includes("rabi")) {
      return res.json({
        reply: "🌾 Rabi Crops: " + cropCalendar.rabi.join(", ")
      });
    }

    if (message.includes("summer")) {
      return res.json({
        reply: "🌾 Summer Crops: " + cropCalendar.summer.join(", ")
      });
    }

    // 3️⃣ Fertilizer schedule
    for (const crop in fertilizerSchedule) {
      if (message.includes(crop)) {
        return res.json({
          reply: "🧪 Fertilizer Guide: " + fertilizerSchedule[crop]
        });
      }
    }

    // 4️⃣ Weather-based tips
    const weatherTip = getWeatherTip(message);
    if (weatherTip) {
      return res.json({ reply: weatherTip });
    }

    // 5️⃣ Tamil agriculture responses
    if (message.includes("rice") || message.includes("nel")) {
      return res.json({
        reply: "🌾 நெல்: நல்ல வடிகால் வசதி, சரியான உர மேலாண்மை முக்கியம்."
      });
    }

    if (message.includes("water") || message.includes("irrigation")) {
      return res.json({
        reply: "💧 பாசனம்: மண்ணின் ஈரப்பதத்தை பார்த்து நீர் பாய்ச்சவும்."
      });
    }

    // 6️⃣ General agriculture help
    if (message.includes("crop")) {
      return res.json({
        reply: "Please tell crop name and season for better guidance."
      });
    }

    if (message.includes("fertilizer")) {
      return res.json({
        reply: "Please mention crop name for fertilizer recommendation."
      });
    }

    // 7️⃣ Strong default reply (NO useless generic replies)
    return res.json({
      reply:
        "I can help with crops, seasons (Kharif/Rabi/Summer), fertilizer, weather tips, and Tamil agriculture info. Please be specific."
    });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});