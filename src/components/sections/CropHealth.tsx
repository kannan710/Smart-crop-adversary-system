import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface CropData {
  date: string;
  crop: string;
  ndvi: number;
  moisture: number;
  status: string;
}
const HISTORICAL_DATA = [
  {
    date: "2022-10-13",
    crop: "Wheat",
    ndvi: 0.75,
    moisture: 23,
    status: "Healthy",
  },
  {
    date: "2022-07-05",
    crop: "Rice",
    ndvi: 0.68,
    moisture: 45,
    status: "Good",
  },
  {
    date: "2022-06-07",
    crop: "Corn",
    ndvi: 0.45,
    moisture: 12,
    status: "Stressed",
  },
  {
    date: "2023-11-06",
    crop: "Wheat",
    ndvi: 0.82,
    moisture: 28,
    status: "Excellent",
  },
  {
    date: "2023-06-11",
    crop: "Rice",
    ndvi: 0.71,
    moisture: 42,
    status: "Good",
  },
  {
    date: "2023-07-05",
    crop: "Corn",
    ndvi: 0.45,
    moisture: 12,
    status: "Stressed",
  },
  {
    date: "2024-01-03",
    crop: "Wheat",
    ndvi: 0.75,
    moisture: 23,
    status: "Healthy",
  },
  {
    date: "2024-07-15",
    crop: "Rice",
    ndvi: 0.68,
    moisture: 45,
    status: "Good",
  },
  {
    date: "2024-06-05",
    crop: "Corn",
    ndvi: 0.45,
    moisture: 12,
    status: "Stressed",
  },
];

const CropHealth: React.FC = () => {
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/demo-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let predictArray = [];
        for (let i = 0; i < 5; i++) {
          const payloadArr = [
            {
              crop: "Rice",
              ndvi: 0.79,
              moisture: 47,
              temperature: 29,
            },
            {
              crop: "Wheat",
              ndvi: 0.75,
              moisture: 58,
              temperature: 25,
            },
            {
              crop: "Corn",
              ndvi: 0.75,
              moisture: 42,
              temperature: 33,
            },
            {
              crop: "Rice",
              ndvi: 0.8,
              moisture: 48,
              temperature: 31,
            },
            {
              crop: "Wheat",
              ndvi: 0.79,
              moisture: 60,
              temperature: 24,
            },
          ];
          try {
            const predict = await fetch("http://localhost:5000/api/predict", {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded', // alternative for form data
              },
              body: JSON.stringify(payloadArr[i]), // body data type must match "Content-Type" header
            });
            const predictRes = await predict.json();
            predictArray.push(predictRes);
          } catch (err) {
            console.log(err);
          }
        }

        const result = await response.json();
        predictArray[0].date = "2027-07-15";
        predictArray[1].date = "2027-10-27";
        predictArray[2].date = "2027-06-13";
        predictArray[3].date = "2027-06-7";
        predictArray[4].date = "2027-11-15";
        // predictArray[0]["date"] = "5/6/2027 - 28";
        result.cropData = predictArray;
        console.log(predictArray);
        setCropData(result.cropData);
      } catch (error) {
        console.error("Error fetching crop data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Healthy":
        return "bg-emerald-100 text-emerald-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Stressed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNDVIIndicator = (ndvi: number) => {
    if (ndvi >= 0.7) return { icon: TrendingUp, color: "text-green-500" };
    if (ndvi >= 0.5) return { icon: TrendingUp, color: "text-blue-500" };
    return { icon: TrendingDown, color: "text-yellow-500" };
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
          <Leaf className="h-8 w-8 text-emerald-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">
            Crop Health Monitoring by Historical Data
          </h1>
        </div>
        <p className="text-xl text-gray-600">
          NDVI-based crop health analysis and monitoring
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-200">
          <h2 className="text-xl font-bold text-emerald-900">
            Field Data Overview
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NDVI Index
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moisture %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {HISTORICAL_DATA.map((crop, index) => {
                const { icon: TrendIcon, color } = getNDVIIndicator(crop.ndvi);
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(crop.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Leaf className="h-4 w-4 text-emerald-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {crop.crop}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono font-bold">
                        {crop.ndvi.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${crop.moisture}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {crop.moisture}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          crop.status
                        )}`}
                      >
                        {crop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TrendIcon className={`h-5 w-5 ${color}`} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <Leaf className="h-8 w-8 text-emerald-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">
            Crop Health Monitoring By Predicted Data
          </h1>
        </div>
        <p className="text-xl text-gray-600">
          NDVI-based crop health analysis and monitoring
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-200">
          <h2 className="text-xl font-bold text-emerald-900">
            Field Data Overview
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NDVI Index
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moisture %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cropData.map((crop, index) => {
                const { icon: TrendIcon, color } = getNDVIIndicator(crop.ndvi);
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(crop.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Leaf className="h-4 w-4 text-emerald-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {crop.crop}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono font-bold">
                        {crop.ndvi.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${crop.moisture}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {crop.moisture}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          crop.status
                        )}`}
                      >
                        {crop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TrendIcon className={`h-5 w-5 ${color}`} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Average NDVI</h3>
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {(
              cropData.reduce((acc, crop) => acc + crop.ndvi, 0) /
              cropData.length
            ).toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">Indicates healthy vegetation</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Healthy Fields</h3>
            <Leaf className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {
              cropData.filter(
                (crop) =>
                  crop.status === "Healthy" || crop.status === "Excellent"
              ).length
            }
          </div>
          <p className="text-sm text-gray-600">
            Out of {cropData.length} total fields
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Fields at Risk</h3>
            <AlertCircle className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {cropData.filter((crop) => crop.status === "Stressed").length}
          </div>
          <p className="text-sm text-gray-600">Require immediate attention</p>
        </motion.div>
      </div>
    </div>
  );
};

export default CropHealth;
