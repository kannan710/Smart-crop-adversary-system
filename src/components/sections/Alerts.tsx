import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock,
  Bell,
  Filter,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Alert {
  id: number;
  type: 'warning' | 'info' | 'danger' | 'success';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { token } = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/alerts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        setAlerts(result);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [token]);

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'critical') return AlertTriangle;
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'danger': return AlertCircle;
      case 'info': return Info;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getAlertColor = (type: string, severity: string) => {
    if (severity === 'critical') return 'red';
    switch (type) {
      case 'warning': return 'yellow';
      case 'danger': return 'red';
      case 'info': return 'blue';
      case 'success': return 'green';
      default: return 'gray';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  const alertCounts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <Bell className="h-8 w-8 text-yellow-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Alert Management</h1>
        </div>
        <p className="text-xl text-gray-600">Predictive alerts and risk assessment for agricultural operations</p>
      </motion.div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(alertCounts).map(([key, count], index) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setFilter(key)}
            className={`p-4 rounded-2xl transition-all transform hover:scale-105 ${
              filter === key 
                ? 'bg-emerald-500 text-white shadow-lg' 
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white'
            } shadow-md`}
          >
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-sm font-medium capitalize">
              {key === 'all' ? 'Total' : key}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'All systems are operating normally.' 
                  : `No ${filter} severity alerts at this time.`
                }
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => {
              const Icon = getAlertIcon(alert.type, alert.severity);
              const color = getAlertColor(alert.type, alert.severity);
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full bg-${color}-100 flex-shrink-0`}>
                      <Icon className={`h-6 w-6 text-${color}-600`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {alert.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{alert.message}</p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTimestamp(alert.timestamp)}
                      </div>
                    </div>
                    
                    <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Alert Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Critical Actions</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Implement immediate irrigation for stressed crops</li>
            <li>• Deploy pest control measures in affected areas</li>
            <li>• Monitor field conditions every 2 hours</li>
          </ul>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Info className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Preventive Measures</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Schedule regular soil testing</li>
            <li>• Maintain optimal irrigation schedules</li>
            <li>• Monitor weather forecasts daily</li>
          </ul>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">System Health</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• All sensors operational: 98% uptime</li>
            <li>• Data collection frequency: Every 15 minutes</li>
            <li>• Last system check: 2 minutes ago</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Alerts;