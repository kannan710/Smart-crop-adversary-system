import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Download,
  Table
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UploadResult {
  data: any[];
  summary: {
    totalRecords: number;
    columns: string[];
    dataTypes: Record<string, string>;
  };
}

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv') {
      setError('Please select a CSV file');
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setUploadResult(result);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      'Date,Crop,NDVI,Moisture,Status',
      '2025-01-01,Wheat,0.75,23,Healthy',
      '2025-01-02,Rice,0.68,45,Good',
      '2025-01-03,Corn,0.45,12,Stressed',
      '2025-01-04,Wheat,0.82,28,Excellent'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-crop-data.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <UploadIcon className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Data Upload</h1>
        </div>
        <p className="text-xl text-gray-600">Upload CSV files for analysis and monitoring</p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Agricultural Data</h2>
          <p className="text-gray-600">Upload your CSV files to analyze crop health, soil data, and weather information</p>
        </div>

        {/* File Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <UploadIcon className="h-8 w-8 text-blue-600" />
            </div>
            
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-600">{file.name}</span>
                <button
                  onClick={resetUpload}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your CSV file here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">Supports CSV files up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <UploadIcon className="h-5 w-5 inline-block mr-2" />
                Upload & Analyze
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadSampleCSV}
            className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Download className="h-5 w-5 inline-block mr-2" />
            Download Sample CSV
          </motion.button>
        </div>
      </motion.div>

      {/* Upload Results */}
      {uploadResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Upload Summary</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{uploadResult.summary.totalRecords}</div>
                <div className="text-sm text-green-700">Total Records</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{uploadResult.summary.columns.length}</div>
                <div className="text-sm text-blue-700">Data Columns</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.values(uploadResult.summary.dataTypes).filter(type => type === 'number').length}
                </div>
                <div className="text-sm text-purple-700">Numeric Fields</div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Column Information</h4>
              <div className="flex flex-wrap gap-2">
                {uploadResult.summary.columns.map((column, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      uploadResult.summary.dataTypes[column] === 'number'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {column} ({uploadResult.summary.dataTypes[column]})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <Table className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Uploaded Data Preview</h3>
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {uploadResult.summary.columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadResult.data.slice(0, 10).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {uploadResult.summary.columns.map((column, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {uploadResult.data.length > 10 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
                Showing first 10 rows of {uploadResult.data.length} total records
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* File Format Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">CSV Format Guidelines</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Supported Data Types</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Crop Health: Date, Crop Type, NDVI, Moisture, Status</li>
              <li>• Soil Data: Date, pH, Temperature, Nitrogen, Phosphorus, Potassium</li>
              <li>• Weather: Date, Temperature, Rainfall, Humidity, Wind Speed</li>
              <li>• Sensor Data: Timestamp, Sensor ID, Value, Location</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Format Requirements</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• First row must contain column headers</li>
              <li>• Date format: YYYY-MM-DD or MM/DD/YYYY</li>
              <li>• Numeric values: Use decimal points (not commas)</li>
              <li>• Text values: Avoid special characters in headers</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Upload;