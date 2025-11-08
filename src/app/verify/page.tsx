// app/verify/page.tsx
'use client';

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

type QRForm = {
  _id: string;
  referenceNumber: string;
  passportNumber: string;
  facility700: string;
  roomName?: string;
  facilityName?: string;
  requestNumber?: string;
  requestType?: string;
  applicantName?: string;
  creationDate?: string;
  requestAmount?: string;
  expiryDate?: string;
  recordNumber?: string;
  requestStatus?: string;
  qrCodeUrl?: string;
  createdAt: string;
  isInitialFormComplete: boolean;
  isVerificationComplete: boolean;
  pdfFile?: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
  };
};

export default function DocumentVerifyPage(): React.ReactElement {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async (): Promise<void> => {
    if (!referenceNumber.trim()) {
      setError('Please enter a reference number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/qr-forms/search/${referenceNumber}`);
      const data = await response.json();

      if (response.ok) {
        // Redirect to dynamic page with the document ID
        window.location.href = `/verify/${data._id}`;
      } else {
        setError(data.message || 'Document not found');
      }
    } catch (error) {
      console.error('Error searching for document:', error);
      setError('Failed to search for document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <Navbar />

      <main className="max-w-7xl mx-auto min-h-[500px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Section Title */}
          <div className="flex items-center mb-6">
            <div className="w-1 h-12 bg-blue-600 rounded ml-4"></div>
            <h2 className="text-3xl font-bold text-gray-800">التحقق من الوثائق</h2>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              خدمة تتيح التحقق من الوثائق التي تم تصديقها إلكترونيا عبر بوابة خدمات المشتركين. وللتحقق من شهادة الاشتراك الرجاء ادخال الرقم المرجعي الخاص بالوثيقة.
            </p>
          </div>

          {/* Search Form */}
          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="أدخل الرقم المرجعي"
                  className="flex-1 text-black border border-gray-300 rounded-lg px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري البحث...' : 'البحث'}
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
              )}
            </div>
          </div>

          {/* QR Code Instructions */}
          <div className="text-center mt-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 inline-block">
              <p className="text-blue-800 font-medium mb-2">أو قم بمسح QR Code</p>
              <p className="text-blue-600 text-sm">
                يمكنك مسح رمز QR Code الموجود على الوثيقة للتحقق تلقائياً
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}