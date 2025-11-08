'use client';

import React, { useState } from 'react';

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
  const [form, setForm] = useState<QRForm | null>(null);
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
        setForm(data);
      } else {
        setError(data.message || 'Document not found');
        setForm(null);
      }
    } catch (error) {
      console.error('Error searching for document:', error);
      setError('Failed to search for document');
      setForm(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (): void => {
    if (form?.pdfFile) {
      window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/qr-forms/${form._id}/download`);
    }
  };

  const handleVerifyAgain = (): void => {
    setForm(null);
    setReferenceNumber('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2030</span>
                </div>
                <span className="text-sm font-medium text-gray-700">VISION رؤية 2030</span>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-600">بوابة خدمات الغرفة</h1>
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mt-2 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>eservices.ucci.org.sa</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Document Information */}
          {form && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Right Panel - Request Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">تفاصيل الطلب</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">إسم الغرفة:</span>
                    <span className="font-medium text-gray-800">{form.roomName || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">الرقم الموحد (700):</span>
                    <span className="font-medium text-gray-800">{form.facility700}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">رقم الطلب:</span>
                    <span className="font-medium text-gray-800">{form.requestNumber || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">مقدم الطلب:</span>
                    <span className="font-medium text-gray-800">{form.applicantName || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">مبلغ الطلب:</span>
                    <span className="font-medium text-gray-800">{form.requestAmount || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">رقم السجل التجاري:</span>
                    <span className="font-medium text-gray-800">{form.recordNumber || 'غير محدد'}</span>
                  </div>
                </div>
              </div>

              {/* Left Panel - Facility Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">تفاصيل المنشأة</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">إسم المنشأة:</span>
                    <span className="font-medium text-gray-800">{form.facilityName || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">نوع الطلب:</span>
                    <span className="font-medium text-gray-800">{form.requestType || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">تاريخ ووقت إنشاء الطلب:</span>
                    <span className="font-medium text-gray-800">{form.creationDate || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">تاريخ صلاحية الطلب:</span>
                    <span className="font-medium text-gray-800">{form.expiryDate || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">حالة الطلب:</span>
                    <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                      form.requestStatus === 'تم قبول الطلب وساري' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {form.requestStatus || 'غير محدد'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {form && (
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              {form.pdfFile && (
                <button
                  onClick={handleDownloadPDF}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>تحميل</span>
                </button>
              )}
              <button
                onClick={handleVerifyAgain}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                التحقق مرة أخري
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Right Side */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-2 rtl:space-x-reverse mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded"></div>
                </div>
                <span className="text-sm">تطوير وتشغيل</span>
              </div>
              <p className="text-sm text-blue-100">عالم النظم و البرامج</p>
            </div>

            {/* Center */}
            <div className="text-center">
              <p className="text-sm mb-2">للإستفسار والدعم الفني</p>
              <p className="text-lg font-semibold">00966112641362</p>
            </div>

            {/* Left Side */}
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start space-x-4 rtl:space-x-reverse mb-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">SSL</span>
                </div>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs">S</span>
                </div>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📷</span>
                </div>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📺</span>
                </div>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs">🐦</span>
                </div>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📘</span>
                </div>
              </div>
              <p className="text-sm text-blue-100">يفضل استخدام متصفح جوجل كروم</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
