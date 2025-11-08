'use client';

import React from 'react';
import VerificationFormModal from './VerificationFormModal';
import { MdOutlineDelete } from "react-icons/md";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { BsTable } from "react-icons/bs";

type Row = {
  id: number;
  roomName: string;
  facilityName: string;
  facilityNumber: string;
  requestNumber: string;
  requestType: string;
  applicantName: string;
  creationDate: string;
  requestAmount: string;
  expiryDate: string;
  recordNumber: string;
  requestStatus: string;
  qrCodeUrl: string;
  createdAt: string;
  referenceNumber: string;
  passportNumber: string;
};

const sampleRows: Row[] = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  roomName: '',
  facilityName: '',
  facilityNumber: String(700000000 + Math.floor(Math.random() * 999999)),
  requestNumber: String(705000000 + Math.floor(Math.random() * 999999)),
  requestType: '',
  applicantName: '',
  creationDate: '',
  requestAmount: '',
  expiryDate: '',
  recordNumber: '',
  requestStatus: '',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=example',
  createdAt: '2025-10-14 20:26:23',
  referenceNumber: String(1100000 + Math.floor(Math.random() * 999999)),
  passportNumber: 'G' + String(6000000 + Math.floor(Math.random() * 999999)),
}));

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

export default function FormDataPage(): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [referenceNumber, setReferenceNumber] = React.useState('');
  const [passportNumber, setPassportNumber] = React.useState('');
  const [facility700, setFacility700] = React.useState('');
  const [isVerificationOpen, setIsVerificationOpen] = React.useState(false);
  const [forms, setForms] = React.useState<QRForm[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedForms, setSelectedForms] = React.useState<string[]>([]);
  const [currentForm, setCurrentForm] = React.useState<QRForm | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [entriesPerPage, setEntriesPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState<string>('createdAt');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [showAllData, setShowAllData] = React.useState(false);
console.log(currentForm,"currentForm");
  function openModal(): void {
    setIsModalOpen(true);
  }

  function closeModal(): void {
    setIsModalOpen(false);
  }

  async function handleSave(): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/qr-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceNumber,
          passportNumber,
          facility700,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create QR form');
      }

      console.log('QR form created successfully:', data);
      setIsModalOpen(false);

      // Reset form
      setReferenceNumber('');
      setPassportNumber('');
      setFacility700('');

      // Refresh the table data
      fetchForms();
    } catch (error) {
      console.error('Error creating QR form:', error);
      alert(error instanceof Error ? error.message : 'Failed to create QR form');
    }
  }

  // Fetch forms from backend
  const fetchForms = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/qr-forms`);
      const data = await response.json();

      if (response.ok) {
        setForms(data.forms || []);
        setCurrentForm(data.forms[0] || null);
      } else {
        console.error('Failed to fetch forms:', data.message);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load forms on component mount
  React.useEffect(() => {
    fetchForms();
  }, []);

  function openVerification(form?: QRForm): void {
    if (form) {
      setCurrentForm(form);
    }
    setIsVerificationOpen(true);
  }

  function closeVerification(): void {
    setIsVerificationOpen(false);
    setCurrentForm(null);
  }

  // Handle checkbox selection
  const handleCheckboxChange = (formId: string, checked: boolean): void => {
    if (checked) {
      setSelectedForms(prev => [...prev, formId]);
    } else {
      setSelectedForms(prev => prev.filter(id => id !== formId));
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      setSelectedForms(sortedAndFilteredForms.map(form => form._id));
    } else {
      setSelectedForms([]);
    }
  };

  // Delete selected forms
  const handleDeleteSelected = async (): Promise<void> => {
    if (selectedForms.length === 0) {
      alert('Please select forms to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedForms.length} form(s)?`)) {
      return;
    }

    try {
      const deletePromises = selectedForms.map(id =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/qr-forms/${id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);
      setSelectedForms([]);
      fetchForms(); // Refresh the table
    } catch (error) {
      console.error('Error deleting forms:', error);
      alert('Failed to delete forms');
    }
  };

  // Download QR code
  const handleDownloadQR = async (form: QRForm): Promise<void> => {
    if (!form.qrCodeUrl) {
      alert('No QR code available for this form');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = form.qrCodeUrl;
      link.download = `qr-code-${form.referenceNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code');
    }
  };

  // Filter forms based on search term (reference number)
  const filteredForms = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return forms;
    }
    return forms.filter(form =>
      form.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [forms, searchTerm]);

  // Sort forms
  const sortedAndFilteredForms = React.useMemo(() => {
    const sorted = [...filteredForms];

    sorted.sort((a, b) => {
      const aValue = a[sortField as keyof QRForm] || '';
      const bValue = b[sortField as keyof QRForm] || '';

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredForms, sortField, sortDirection]);

  // Calculate paginated forms
  const paginatedForms = React.useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return sortedAndFilteredForms.slice(startIndex, endIndex);
  }, [sortedAndFilteredForms, currentPage, entriesPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedAndFilteredForms.length / entriesPerPage);

  // Handle entries per page change
  const handleEntriesPerPageChange = (value: number): void => {
    setEntriesPerPage(value);
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle data visibility toggle - show/hide ALL toggleable columns
  const toggleAllDataVisibility = (): void => {
    setShowAllData(prev => !prev);
  };

  // Handle sort
  const handleSort = (field: string): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">قائمة النماذج</h1>
          <div className="text-sm text-gray-500"><span></span>تائج البحث / العناوين</div>
        </div>

      </div>

      <div className="border  border-gray-200 overflow-hidden">
        <div className="flex items-center border-b bg-gray-100 border-gray-300 justify-between gap-2 py-3">
          <div className="flex px-2 items-center gap-2">
            <BsTable size={20} />
            <span className="text-lg font-medium">قائمة نماذج القائمة1</span>
          </div>
          <div className="flex items-center px-2 gap-2">
            <button
              onClick={openModal}
              className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              + جديد QR
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedForms.length === 0}
              className="px-3 py-2 rounded bg-red-600 flex items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              حذف متعدد ({selectedForms.length})
            </button>
          </div>
        </div>
        <div className="p-3 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm">
            Show
            <select
              className="mx-2 border border-gray-300 rounded px-1 py-0.5"
              value={entriesPerPage}
              onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            entries
          </div>
          <input
            className="border border-gray-300 rounded px-2 py-1 w-full sm:w-64"
            placeholder="Search by Reference Number"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Responsive Desktop Table */}
        <div className="w-full hidden lg:block overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-white text-black">
              <tr>
                <th className="p-2 text-left border border-gray-200 sticky left-0 bg-white z-20">
                  <input
                    type="checkbox"
                    checked={selectedForms.length === paginatedForms.length && paginatedForms.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>

                {/* Room Name - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="text-sm">Room Name</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Facility Name - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="">Facility Name</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Facility Number - always visible */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('facility700')}>
                    <span className="">Facility Number</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={sortField === 'facility700' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={sortField === 'facility700' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Request Number - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="">Request Number</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Request Type - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="">Request Type</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Applicant Name - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="">Applicant Name</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Creation Date - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="">Created Date</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Request Amount - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="">Request Amount</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Expiry Date - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="">Expiry Date</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Record Number - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="">Record Number</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Request Status - toggleable */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={toggleAllDataVisibility}>
                    <span className="">Request Status</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={showAllData ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* QR Code - always visible */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">QR Code</span>
                    <div className="flex ">
                      <FaArrowUpLong size={10} className="text-gray-400" />
                      <FaArrowDownLong size={10} className="text-gray-400" />
                    </div>
                  </div>
                </th>

                {/* Date - always visible */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('createdAt')}>
                    <span className="">Date</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={sortField === 'createdAt' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={sortField === 'createdAt' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Reference Number - always visible */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('referenceNumber')}>
                    <span className="">Reference Number</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={sortField === 'referenceNumber' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={sortField === 'referenceNumber' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Passport Number - always visible */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('passportNumber')}>
                    <span className="">Passport Number</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={sortField === 'passportNumber' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={sortField === 'passportNumber' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Download File - always visible */}
                <th className="p-2 text-left border border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="">Download File</span>
                    <div className="flex ">
                      <FaArrowUpLong
                        size={10}
                        className={sortField === 'passportNumber' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                      <FaArrowDownLong
                        size={10}
                        className={sortField === 'passportNumber' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}
                      />
                    </div>
                  </div>
                </th>

                {/* Actions - always visible */}
                <th className="p-2 text-left border border-gray-200 sticky right-0 bg-white z-20">
                  <div className="flex items-center gap-1">
                    <span className="">Actions</span>
                    <div className="flex ">
                      <FaArrowUpLong size={10} className="text-gray-400" />
                      <FaArrowDownLong size={10} className="text-gray-400" />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={19} className="p-4 text-center text-gray-500 border border-gray-200">
                    Loading...
                  </td>
                </tr>
              ) : paginatedForms.length === 0 ? (
                <tr>
                  <td colSpan={19} className="p-4 text-center text-gray-500 border border-gray-200">
                    {searchTerm ? 'No forms found matching your search' : 'No forms found'}
                  </td>
                </tr>
              ) : (
                paginatedForms.map((form, index) => (
                  <tr
                    key={form._id}
                    className={`border-t border-gray-200 ${index % 2 === 1 ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    <td className="p-2 border border-gray-200 h-12 sticky left-0 bg-white z-20">
                      <input
                        type="checkbox"
                        checked={selectedForms.includes(form._id)}
                        onChange={(e) => handleCheckboxChange(form._id, e.target.checked)}
                      />
                    </td>

                    {/* Room Name */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.roomName || '-') : '-'}>
                        {showAllData ? (form.roomName || '-') : '-'}
                      </div>
                    </td>

                    {/* Facility Name */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.facilityName || '-') : '-'}>
                        {showAllData ? (form.facilityName || '-') : '-'}
                      </div>
                    </td>

                    {/* Facility Number - always visible */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={form.facility700}>
                        {form.facility700}
                      </div>
                    </td>

                    {/* Request Number */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.requestNumber || '-') : '-'}>
                        {showAllData ? (form.requestNumber || '-') : '-'}
                      </div>
                    </td>

                    {/* Request Type */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.requestType || '-') : '-'}>
                        {showAllData ? (form.requestType || '-') : '-'}
                      </div>
                    </td>

                    {/* Applicant Name */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.applicantName || '-') : '-'}>
                        {showAllData ? (form.applicantName || '-') : '-'}
                      </div>
                    </td>

                    {/* Creation Date */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.creationDate || '-') : '-'}>
                        {showAllData ? (form.creationDate || '-') : '-'}
                      </div>
                    </td>

                    {/* Request Amount */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.requestAmount || '-') : '-'}>
                        {showAllData ? (form.requestAmount || '-') : '-'}
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.expiryDate || '-') : '-'}>
                        {showAllData ? (form.expiryDate || '-') : '-'}
                      </div>
                    </td>

                    {/* Record Number */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.recordNumber || '-') : '-'}>
                        {showAllData ? (form.recordNumber || '-') : '-'}
                      </div>
                    </td>

                    {/* Request Status */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={showAllData ? (form.requestStatus || '-') : '-'}>
                        {showAllData ? (form.requestStatus || '-') : '-'}
                      </div>
                    </td>

                    {/* QR Code - always visible */}
                    <td className="p-2 border border-gray-200 h-12">
                      {form.qrCodeUrl ? (
                        <img src={form.qrCodeUrl} alt="qr" className="w-30 h-30 object-contain" />
                      ) : (
                        <span className="text-gray-400 text-xs">No QR</span>
                      )}
                    </td>

                    {/* Date - always visible */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={new Date(form.createdAt).toLocaleDateString()}>
                        {new Date(form.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Reference Number - always visible */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={form.referenceNumber}>
                        {form.referenceNumber}
                      </div>
                    </td>

                    {/* Passport Number - always visible */}
                    <td className="p-2 border border-gray-200 h-12">
                      <div className=" text-xs" title={form.passportNumber}>
                        {form.passportNumber}
                      </div>
                    </td>

                    {/* Download File - always visible */}
                    <td className="p-1 border border-gray-200 h-10 w-auto text-center whitespace-nowrap">
                      {/* PDF download button - you can add this later */}
                    </td>

                    {/* Actions - always visible */}
                    <td className="p-1 border border-gray-200 h-10 sticky right-0 bg-white z-20">
                      <div className="flex flex-col items-center justify-center gap-1">
                        {/* Download QR Button */}
                        <button
                          onClick={() => handleDownloadQR(form)}
                          className="flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-yellow-400 text-white text-xs w-full cursor-pointer hover:bg-yellow-500 transition"
                          disabled={!form.qrCodeUrl}
                        >
                          {/* Download Icon (SVG) */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                          </svg>
                          تحميل QR
                        </button>

                        {/* Add Verification Button */}
                        <button
                          onClick={() => openVerification(form)}
                          className="flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-green-600 text-white text-xs w-full cursor-pointer hover:bg-green-700 transition"
                        >
                          {/* Plus Icon (SVG) */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          إضافة + بيانات التحقق
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading...
            </div>
          ) : paginatedForms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No forms found matching your search' : 'No forms found'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedForms.map((form, index) => (
                <div
                  key={form._id}
                  className={`p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedForms.includes(form._id)}
                        onChange={(e) => handleCheckboxChange(form._id, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="font-semibold text-sm">Ref: {form.referenceNumber}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadQR(form)}
                        className="px-2 py-1 rounded bg-yellow-400 text-white text-xs"
                        disabled={!form.qrCodeUrl}
                      >
                        QR
                      </button>
                      <button
                        onClick={() => openVerification(form)}
                        className="px-2 py-1 rounded bg-green-600 text-white text-xs"
                      >
                        تحقق
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Passport:</span> {form.passportNumber}
                    </div>
                    <div>
                      <span className="font-medium">Facility:</span> {form.facility700}
                    </div>
                    <div>
                      <span className="font-medium">Request No:</span> {showAllData ? (form.requestNumber || '-') : '-'}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {showAllData ? (form.requestStatus || '-') : '-'}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Applicant:</span> {showAllData ? (form.applicantName || '-') : '-'}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Created:</span> {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                    {form.qrCodeUrl && (
                      <div className="col-span-2 flex justify-center mt-2">
                        <img src={form.qrCodeUrl} alt="qr" className="w-12 h-12 object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination and Summary Info */}
        <div className="p-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, sortedAndFilteredForms.length)} of {sortedAndFilteredForms.length} entries
            {searchTerm && (
              <span> (filtered from {forms.length} total entries)</span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border border-gray-300 rounded text-sm ${currentPage === page ? 'bg-blue-600 text-white' : ''
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="absolute  inset-0 flex items-start justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded shadow-lg overflow-hidden" dir="rtl">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="font-bold cursor-pointer">إضافة نموذج جديد</div>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">×</button>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-base mb-1">رقم المرجع</label>
                    <input
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="1653542"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-base mb-1">رقم جواز السفر</label>
                    <input
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="HJ411328"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-base mb-1">(700) رقم المنشأة</label>
                  <input
                    value={facility700}
                    onChange={(e) => setFacility700(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="7003134525"
                  />
                </div>
              </div>

              <div className="px-4 py-3 flex w-full items-center gap-2">
                <button onClick={handleSave} className="px-3 py-2 cursor-pointer rounded bg-blue-600 text-white">حفظ النموذج</button>
                <button onClick={closeModal} className="px-3 py-2 cursor-pointer rounded bg-gray-200">إغلاق</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <VerificationFormModal
        open={isVerificationOpen}
        onClose={closeVerification}
        onSave={() => {
          fetchForms(); // Refresh the table
        }}
        formId={currentForm?._id}
        initialData={currentForm ? {
          facilityName: currentForm.facilityName || '',
          roomName: currentForm.roomName || '',
          facility700: currentForm.facility700 || '',
          requestNumber: currentForm.requestNumber || '',
          applicantName: currentForm.applicantName || '',
          requestType: currentForm.requestType || '',
          creationDate: currentForm.creationDate || '',
          requestAmount: currentForm.requestAmount || '',
          expiryDate: currentForm.expiryDate || '',
          recordNumber: currentForm.recordNumber || '',
          requestStatus: currentForm.requestStatus || '',
        } : undefined}
      />
    </div>
  );
}