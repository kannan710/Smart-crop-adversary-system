import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Zap, 
  Leaf, 
  BarChart3 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SoilData {
  moisture: number;
  ph: number;
  temperature: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

const SoilDataSection: React.FC = () => {
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/demo-data', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        setSoilData(result.soilData);
      } catch (error) {
        console.error('Error fetching soil data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'moisture':
        if (value >= 20 && value <= 30) return 'text-green-600';
        if (value >= 15 && value <= 35) return 'text-yellow-600';
        return 'text-red-600';
      case 'ph':
        if (value >= 6.0 && value <= 7.0) return 'text-green-600';
        if (value >= 5.5 && value <= 7.5) return 'text-yellow-600';
        return 'text-red-600';
      case 'temperature':
        if (value >= 20 && value <= 30) return 'text-green-600';
        if (value >= 15 && value <= 35) return 'text-yellow-600';
        return 'text-red-600';
      default:
        if (value >= 30) return 'text-green-600';
        if (value >= 20) return 'text-yellow-600';
        return 'text-red-600';
    }
  };

  const getProgressColor = (value: number, type: string) => {
    switch (type) {
      case 'moisture':
        if (value >= 20 && value <= 30) return 'bg-green-500';
        if (value >= 15 && value <= 35) return 'bg-yellow-500';
        return 'bg-red-500';
      case 'ph':
        if (value >= 6.0 && value <= 7.0) return 'bg-green-500';
        if (value >= 5.5 && value <= 7.5) return 'bg-yellow-500';
        return 'bg-red-500';
      case 'temperature':
        if (value >= 20 && value <= 30) return 'bg-green-500';
        if (value >= 15 && value <= 35) return 'bg-yellow-500';
        return 'bg-red-500';
      default:
        if (value >= 30) return 'bg-green-500';
        if (value >= 20) return 'bg-yellow-500';
        return 'bg-red-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!soilData) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Unable to load soil data</p>
      </div>
    );
  }

  const soilMetrics = [
    {
      title: 'Soil Moisture',
      value: `${soilData.moisture}%`,
      icon: Droplets,
      description: 'Current soil moisture level',
      progress: soilData.moisture,
      maxProgress: 100,
      type: 'moisture'
    },
    {
      title: 'pH Level',
      value: soilData.ph.toFixed(1),
      icon: Activity,
      description: 'Soil acidity/alkalinity',
      progress: ((soilData.ph - 5) / 4) * 100, // Scale 5-9 to 0-100
      maxProgress: 100,
      type: 'ph'
    },
    {
      title: 'Temperature',
      value: `${soilData.temperature}°C`,
      icon: Thermometer,
      description: 'Soil temperature',
      progress: soilData.temperature,
      maxProgress: 50,
      type: 'temperature'
    },
    {
      title: 'Nitrogen (N)',
      value: `${soilData.nitrogen}%`,
      icon: Leaf,
      description: 'Nitrogen content',
      progress: soilData.nitrogen,
      maxProgress: 100,
      type: 'nutrient'
    },
    {
      title: 'Phosphorus (P)',
      value: `${soilData.phosphorus}%`,
      icon: Zap,
      description: 'Phosphorus content',
      progress: soilData.phosphorus,
      maxProgress: 100,
      type: 'nutrient'
    },
    {
      title: 'Potassium (K)',
      value: `${soilData.potassium}%`,
      icon: BarChart3,
      description: 'Potassium content',
      progress: soilData.potassium,
      maxProgress: 100,
      type: 'nutrient'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <Thermometer className="h-8 w-8 text-orange-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Soil Data Analysis</h1>
        </div>
        <p className="text-xl text-gray-600">Real-time soil sensor readings and analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {soilMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gray-100">
                  <Icon className="h-6 w-6 text-gray-700" />
                </div>
                <div className={`text-3xl font-bold ${getStatusColor(
                  typeof metric.progress === 'number' ? 
                    metric.type === 'ph' ? soilData.ph : 
                    metric.type === 'moisture' ? soilData.moisture :
                    metric.type === 'temperature' ? soilData.temperature :
                    metric.progress
                  : 0, metric.type
                )}`}>
                  {metric.value}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{metric.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{metric.description}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.progress / metric.maxProgress) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                  className={`h-3 rounded-full ${getProgressColor(
                    metric.type === 'ph' ? soilData.ph : 
                    metric.type === 'moisture' ? soilData.moisture :
                    metric.type === 'temperature' ? soilData.temperature :
                    metric.progress, metric.type
                  )}`}
                ></motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Soil Health Recommendations</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Optimal Conditions</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• pH level is within ideal range (6.0-7.0)</li>
                <li>• Soil moisture is adequate for crop growth</li>
                <li>• Temperature supports root development</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Nutrient Status</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Nitrogen: {soilData.nitrogen >= 40 ? 'Excellent' : soilData.nitrogen >= 30 ? 'Good' : 'Needs improvement'}</li>
                <li>• Phosphorus: {soilData.phosphorus >= 35 ? 'Excellent' : soilData.phosphorus >= 25 ? 'Good' : 'Needs improvement'}</li>
                <li>• Potassium: {soilData.potassium >= 30 ? 'Excellent' : soilData.potassium >= 20 ? 'Good' : 'Needs improvement'}</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Recommended Actions</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Continue current irrigation schedule</li>
                <li>• Monitor temperature fluctuations</li>
                <li>• Consider organic matter addition</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Next Steps</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Schedule soil testing in 2 weeks</li>
                <li>• Adjust fertilizer application based on NPK levels</li>
                <li>• Monitor weather conditions for irrigation planning</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SoilDataSection;