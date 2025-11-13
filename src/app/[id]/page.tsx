'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../verify/components/Navbar';
import Footer from '../verify/components/Footer';
import { FourSquare } from 'react-loading-indicators';

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

export default function DocumentDetailsPage() {
  const params = useParams();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [downloading, setDownloading] = useState(false); // <-- Added state for loader

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const id = params.id;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/qr-forms/${id}`);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setForm(data);
        } else {
          setError(data.message || 'Document not found');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocument();
    }
  }, [params.id]);

  const handleDownloadPDF = (): void => {
    if (!form?.pdfFile) return;

    // Show loader
    setDownloading(true);

    // Wait 3 seconds, then start download
    setTimeout(() => {
      setDownloading(false);
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/qr-forms/${form._id}/download`);
    }, 3000);
  };

  // Show loading state when fetching document
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100" dir="rtl">
        <Navbar />
        <main className="max-w-7xl mx-auto min-h-[600px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FourSquare color="#0d19ff" size="large" text="" textColor="" />
            <p className="text-gray-600 mt-4">جاري تحميل بيانات الوثيقة...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100" dir="rtl">
        <Navbar />
        <main className="max-w-5xl min-h-[600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-600 mb-2">خطأ</h3>
            <p className="text-gray-600">{error}</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              العودة إلى صفحة التحقق
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100" dir="rtl">
      <Navbar />

      {/* ✅ Fullscreen Loader when downloading */}
      {downloading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40">
          <FourSquare color="#0d19ff" size="large" text="" textColor="" />
          <p className="text-white mt-4 text-lg">جاري تحميل الملف...</p>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between border-b p-8 border-gray-200 pb-4 mb-6">
            {/* Arabic Text - Right aligned */}

            <div className="flex relative">
              <div className='bg-blue-500 p-[2px] h-10 absolute -right-8'></div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800" dir="rtl">
                التحقق من الوثائق
              </h1>
            </div>
            {/* Button - Left aligned */}
            <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
              العودة
            </button>

          </div>
          
          {/* Scrollable content area with fixed height - Scrollbar visible only on desktop */}
          <div className="max-h-[500px] md:overflow-hidden overflow-y-auto 
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-gray-100
              [&::-webkit-scrollbar-thumb]:bg-gray-300
              [&::-webkit-scrollbar-thumb]:rounded-full
              
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
              lg:[&::-webkit-scrollbar-thumb]:bg-gray-300
              lg:[&::-webkit-scrollbar]:block
              [&::-webkit-scrollbar]:hidden">
            <p className="text-black text-2xl border-b border-gray-200 p-8 font-medium">
              خدمة تتيح التحقق من الوثائق التي تم إصدارها إلكترونيا عبر بوابة خدمات المشتركين،
              وللتحقق من شهادة الاشتراك الرجاء إدخال الرقم المرجعي الخاص بالوثيقة.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 p-8 gap-8 mb-8 mt-6">
              <div className="p-2 space-y-4">
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">إسم الغرفة:</span>
                  <span className="font-normal text-xl text-gray-800">{form.roomName || 'غير محدد'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">الرقم الموحد </span><span className='text-black text-xl font-bold'>(700):</span>
                  <span className="font-normal text-xl text-gray-800">{form.facility700}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">رقم الطلب:</span>
                  <span className="font-normal text-xl text-gray-800">{form.requestNumber || 'غير محدد'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">مقدم الطلب:</span>
                  <span className="font-normal text-xl text-gray-800">{form.applicantName || 'غير محدد'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">مبلغ الطلب:</span>
                  <span className="font-normal text-xl text-gray-800">{form.requestAmount || 'غير محدد'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">رقم السجل التجاري:</span>
                  <span className="font-normal text-xl text-gray-800">{form.recordNumber || 'غير محدد'}</span>
                </div>
              </div>

              <div className="p-2 space-y-4">
                <div className="flex mb-14 gap-2">
                  <span className="text-black font-extrabold text-xl">إسم المنشأة:</span>
                  <span className="font-normal text-xl text-gray-800">{form.facilityName || 'غير محدد'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">نوع الطلب:</span>
                  <span className="font-normal text-xl text-gray-800">{form.requestType || 'غير محدد'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">تاريخ ووقت إنشاء الطلب:</span>
                  <span className="font-normal text-xl text-gray-800">{form.creationDate || 'غير محدد'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">تاريخ صلاحية الطلب:</span>
                  <span className="font-normal text-xl text-gray-800">{form.expiryDate || 'غير محدد'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black font-extrabold text-xl">حالة الطلب:</span>
                  <span className="font-normal text-xl text-gray-800">{form.requestStatus || 'غير محدد'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 rtl:space-x-reverse p-8 border-t border-gray-200">
            {form.pdfFile && (
              <button
                onClick={handleDownloadPDF}
                className="px-8 py-3 bg-blue-500 text-white  hover:bg-blue-700 transition-colors cursor-pointer duration-200 flex items-center space-x-2 rtl:space-x-reverse"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>تحميل PDF</span>
              </button>
            )}
            <button className="px-8 py-3 bg-blue-500 text-white  hover:bg-blue-700 transition-colors cursor-pointer duration-200 flex items-center space-x-2 rtl:space-x-reverse">
              التحقق من وثيقة أخرى
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}