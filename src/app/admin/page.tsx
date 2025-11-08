'use client';

import React from 'react';

interface DashboardStats {
  totalForms: number;
  verifiedForms: number;
  todaysForms: number;
}
import { FaUser } from "react-icons/fa";

export default function AdminDashboard(): React.ReactElement {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalForms: 0,
    verifiedForms: 0,
    todaysForms: 0
  });
  const [loading, setLoading] = React.useState<boolean>(true);

  // Fetch dashboard stats
  const fetchDashboardStats = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL }/dashboard/stats`);
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      } else {
        console.error('Failed to fetch dashboard stats:', data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to fetching all forms if stats endpoint doesn't exist
      const formsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/qr-forms`);
      const formsData = await formsResponse.json();
      
      if (formsResponse.ok) {
        setStats({
          totalForms: formsData.forms?.length || 0,
          verifiedForms: 0,
          todaysForms: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold  mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border p-4 bg-gradient-to-r from-cyan-600 to-teal-500 text-white">
          <div className="text-sm opacity-90">Total Forms</div>
          <div className='flex items-center mt-5 mb-3 gap-10'>
            <FaUser className="text-[50px]" />
          <div className="text-3xl font-bold mt-2">
            {loading ? (
              <div className="animate-pulse">Loading...</div>
            ) : (
              stats.totalForms.toLocaleString()
            )}
          </div>
          </div>
         
          {/* <div className="text-xs opacity-90 mt-2">All created QR forms</div> */}
        </div>

      
      </div>
    </div>
  );
}