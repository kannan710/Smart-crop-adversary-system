import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Thermometer, 
  Droplets, 
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardData {
  cropData: any[];
  soilData: any;
  weatherData: any[];
}

const Overview: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
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
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Unable to load dashboard data</p>
      </div>
    );
  }

  const avgNDVI = data.cropData.reduce((acc, crop) => acc + crop.ndvi, 0) / data.cropData.length;
  const healthyFields = data.cropData.filter(crop => crop.status === 'Healthy' || crop.status === 'Excellent').length;
  const latestWeather = data.weatherData[data.weatherData.length - 1];

  const stats = [
    {
      title: 'Total Fields',
      value: data.cropData.length,
      icon: Leaf,
      color: 'emerald',
      change: '+2 this week'
    },
    {
      title: 'Healthy Fields',
      value: healthyFields,
      icon: Activity,
      color: 'green',
      change: `${Math.round((healthyFields / data.cropData.length) * 100)}% healthy`
    },
    {
      title: 'Avg NDVI',
      value: avgNDVI.toFixed(2),
      icon: TrendingUp,
      color: 'blue',
      change: '+0.05 vs last week'
    },
    {
      title: 'Soil Moisture',
      value: `${data.soilData.moisture}%`,
      icon: Droplets,
      color: 'cyan',
      change: 'Optimal range'
    },
    {
      title: 'Temperature',
      value: `${latestWeather?.temperature}°C`,
      icon: Thermometer,
      color: 'orange',
      change: `Rainfall: ${latestWeather?.rainfall}mm`
    },
    {
      title: 'Active Alerts',
      value: '3',
      icon: AlertTriangle,
      color: 'red',
      change: '1 critical, 2 warnings'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Agricultural Dashboard</h1>
        <p className="text-xl text-gray-600">Real-time monitoring of your agricultural operations</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                </div>
              </div>
              <p className={`text-sm text-${stat.color}-600 font-medium`}>{stat.change}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Field Activity</h3>
          <div className="space-y-3">
            {data.cropData.slice(0, 4).map((crop, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{crop.crop} Field</p>
                  <p className="text-sm text-gray-600">NDVI: {crop.ndvi}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  crop.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                  crop.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' :
                  crop.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {crop.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Data Collection</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Sensor Network</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Weather Integration</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Alert System</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-600">3 Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;