import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import CropHealth from './sections/CropHealth';
import SoilData from './sections/SoilData';
import Weather from './sections/Weather';
import Alerts from './sections/Alerts';
import Reports from './sections/Reports';
import Upload from './sections/Upload';
import Overview from './sections/Overview';
import Bot from './sections/Bot';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/crop-health" element={<CropHealth />} />
            <Route path="/soil" element={<SoilData />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/bot" element={<Bot />} />
          </Routes>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;