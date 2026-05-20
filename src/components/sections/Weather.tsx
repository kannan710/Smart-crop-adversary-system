import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
const key = "550071de260ecefdd111b58234639b36";
const API = await fetch("https://api.openweathermap.org/data/2.5/weather?q=coimbatore&appid=550071de260ecefdd111b58234639b36&units=metric");
const data  = await API.json();
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Thermometer, 
  Droplets,
  Wind,
  Eye,
  Gauge
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

interface WeatherData {
  date: string;
  rainfall: number;
  temperature: number;
}

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
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
        setWeatherData(result.weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
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

  const latestWeather = weatherData[weatherData.length - 1];
  const avgTemp = weatherData.reduce((acc, item) => acc + item.temperature, 0) / weatherData.length;
  const totalRainfall = weatherData.reduce((acc, item) => acc + item.rainfall, 0);
  const maxTemp = Math.max(...weatherData.map(item => item.temperature));
  const minTemp = Math.min(...weatherData.map(item => item.temperature));

  // Format data for charts
  const chartData = weatherData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const weatherStats = [
    {
      title: 'Current Temperature',
      value: `${data?.main.temp || 0}°C`,
      icon: Thermometer,
      color: 'orange',
      description: 'Real-time temperature'
    },
    {
      title: 'Today\'s Rainfall',
      value: `0mm`,
      icon: CloudRain,
      color: 'blue',
      description: 'Precipitation today'
    },
    {
      title: 'Average Temperature',
      value: `${(data?.main.temp_max + data?.main.temp_min) / 2}°C`,
      icon: Sun,
      color: 'yellow',
      description: 'Weekly average'
    },
    {
      title: 'Total Rainfall',
      value: `7mm`,
      icon: Cloud,
      color: 'indigo',
      description: 'Weekly total'
    },
    {
      title: 'Humidity',
      value: `${data?.main.humidity}%`,
      icon: Droplets,
      color: 'cyan',
      description: 'Relative humidity'
    },
    {
      title: 'Wind Speed',
      value: `${data?.wind.speed} km/h`,
      icon: Wind,
      color: 'gray',
      description: 'Current wind speed'
    },
    {
      title: 'Visibility',
      value: '10 km',
      icon: Eye,
      color: 'emerald',
      description: 'Atmospheric visibility'
    },
    {
      title: 'Pressure',
      value: `${data?.main.pressure}hpa`,
      icon: Gauge,
      color: 'purple',
      description: 'Atmospheric pressure'
    }
  ];
  console.log(data.main.temp_max);
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <Cloud className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Weather Monitoring</h1>
        </div>
        <p className="text-xl text-gray-600">Real-time weather data and agricultural forecasting</p>
      </motion.div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {weatherStats.map((stat, index) => {
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
                <div className={`text-2xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{stat.title}</h3>
              <p className="text-xs text-gray-600">{stat.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Temperature Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#f97316" 
                strokeWidth={3}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Min: {minTemp}°C</span>
            <span>Avg: {avgTemp.toFixed(1)}°C</span>
            <span>Max: {maxTemp}°C</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Rainfall Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: 'mm', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px' 
                }}
              />
              <Bar 
                dataKey="rainfall" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Total: {totalRainfall}mm over 7 days</span>
          </div>
        </motion.div>
      </div>

      {/* Combined Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Weather Overview - Temperature & Rainfall</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              yAxisId="rainfall"
              stroke="#6b7280"
              fontSize={12}
              label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="temperature"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
              label={{ value: 'Temperature (°C)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px' 
              }}
            />
            <Legend />
            <Bar 
              yAxisId="rainfall"
              dataKey="rainfall" 
              fill="#3b82f6"
              name="Rainfall (mm)"
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="temperature"
              type="monotone" 
              dataKey="temperature" 
              stroke="#f97316" 
              strokeWidth={3}
              name="Temperature (°C)"
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Weather Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Agricultural Weather Insights</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Favorable Conditions</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Temperature range optimal for crop growth</li>
              <li>• Adequate rainfall for irrigation needs</li>
              <li>• Good humidity levels for plant health</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Irrigation Recommendations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Reduce irrigation on high rainfall days</li>
              <li>• Monitor soil moisture after rain events</li>
              <li>• Adjust schedule based on temperature</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Weather Alerts</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Monitor for potential heat stress</li>
              <li>• Watch for excessive rainfall patterns</li>
              <li>• Check for optimal spraying conditions</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Weather;