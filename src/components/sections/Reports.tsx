import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Leaf,
  Thermometer,
  Droplets,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const { token } = useAuth();

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/reports/generate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setReportData(data);
      
      // Simulate PDF download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `agrisense-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    {
      title: 'Crop Health Summary',
      description: 'Comprehensive analysis of NDVI values, crop status, and field conditions',
      icon: Leaf,
      color: 'green'
    },
    {
      title: 'Soil Analysis Report',
      description: 'Detailed soil metrics including pH, moisture, temperature, and nutrients',
      icon: Thermometer,
      color: 'orange'
    },
    {
      title: 'Weather Impact Analysis',
      description: 'Weather patterns, rainfall distribution, and agricultural implications',
      icon: Droplets,
      color: 'blue'
    },
    {
      title: 'Alert & Risk Assessment',
      description: 'Critical alerts, risk factors, and recommended interventions',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const summaryStats = [
    { label: 'Total Fields Monitored', value: '12', icon: BarChart3 },
    { label: 'Healthy Fields', value: '8', icon: TrendingUp },
    { label: 'Fields at Risk', value: '4', icon: AlertTriangle },
    { label: 'Average NDVI', value: '0.68', icon: Leaf }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Report Generation</h1>
        </div>
        <p className="text-xl text-gray-600">Comprehensive agricultural monitoring reports and analytics</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600">{stat.value}</div>
              </div>
              <h3 className="text-sm font-medium text-gray-900">{stat.label}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Report Generation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Comprehensive Report</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create a detailed analysis report including crop health metrics, soil conditions, 
            weather impact, and actionable recommendations for your agricultural operations.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-6">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            Report Period: {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date().toLocaleDateString()}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateReport}
          disabled={loading}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Generate & Download Report
            </>
          )}
        </motion.button>

        {reportData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-green-800 font-medium">
              ✓ Report generated successfully! Check your downloads folder.
            </p>
            <p className="text-green-600 text-sm mt-1">
              Generated at: {new Date(reportData.generatedAt).toLocaleString()}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Available Report Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Available Report Types</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportTypes.map((report, index) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={report.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`p-3 rounded-xl bg-${report.color}-100 flex-shrink-0`}>
                  <Icon className={`h-6 w-6 text-${report.color}-600`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Report Preview */}
      {reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Report Summary</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fields:</span>
                  <span className="font-medium">{reportData.summary.totalFields}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Healthy Fields:</span>
                  <span className="font-medium text-green-600">{reportData.summary.healthyFields}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fields at Risk:</span>
                  <span className="font-medium text-red-600">{reportData.summary.fieldAtRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average NDVI:</span>
                  <span className="font-medium">{reportData.summary.avgNDVI}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Moisture:</span>
                  <span className="font-medium">{reportData.summary.avgMoisture}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {reportData.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;