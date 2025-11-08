'use client';

import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, string>) => void;
  formId?: string;
  initialData?: Record<string, string>;
};

export default function VerificationFormModal(props: Props): React.ReactElement | null {
  const { open, onClose, onSave, formId, initialData } = props;
console.log(initialData,"initialData");
  const [form, setForm] = React.useState<Record<string, string>>({
    facilityName: '',
    roomName: '',
    facility700: '',
    requestNumber: '',
    applicantName: '',
    requestType: '',
    creationDate: '',
    requestAmount: '',
    expiryDate: '',
    recordNumber: '',
    requestStatus: '',
  });

  const [fileName, setFileName] = React.useState<string>('');

  React.useEffect(() => {
    if (!open) return;

    if (initialData) {
      // ✅ Properly include all fields including recordNumber & requestStatus
      setForm({
        facilityName: initialData.facilityName || '',
        roomName: initialData.roomName || '',
        facility700: initialData.facility700 || '',
        requestNumber: initialData.requestNumber || '',
        applicantName: initialData.applicantName || '',
        requestType: initialData.requestType || '',
        creationDate:
          initialData.creationDate ||
          new Date().toLocaleString('en-GB', { hour12: false }),
        requestAmount: initialData.requestAmount || '',
        expiryDate: initialData.expiryDate || '',
        recordNumber: initialData.recordNumber || '', // ✅ fixed
        requestStatus: initialData.requestStatus || '', // ✅ fixed
      });
    } else {
      // Default values when creating new form
      setForm({
        facilityName: '',
        roomName: '',
        facility700: '',
        requestNumber: '',
        applicantName: '',
        requestType: '',
        creationDate: new Date().toLocaleString('en-GB', { hour12: false }), // ✅ default current date/time
        requestAmount: '',
        expiryDate: '',
        recordNumber: '',
        requestStatus: '',
      });
    }

    setFileName('');
  }, [open, initialData]);

  function handleChange(key: string, value: string): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(): Promise<void> {
    if (!formId) {
      onSave(form);
      onClose();
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (fileInput?.files?.[0]) {
        formData.append('pdfFile', fileInput.files[0]);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/qr-forms/${formId}/verification`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update verification data');
      }

      console.log('Verification data updated successfully:', data);
      onSave(form);
      onClose();
    } catch (error) {
      console.error('Error updating verification data:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update verification data'
      );
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* ✅ Scrollable container on mobile only */}
      <div className="absolute inset-0 flex items-start justify-center p-4 overflow-y-auto md:overflow-visible">
        <div
          className="w-full max-w-4xl bg-white rounded shadow-lg overflow-hidden"
          dir="rtl"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
            <div className="font-bold text-base md:text-lg">إضافة نموذج جديد</div>
            <button
              onClick={onClose}
              className="text-gray-500 font-bold text-xl hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* ✅ Make content scrollable on mobile */}
          <div className="p-4 space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-base mb-1">اسم المنشأة</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.facilityName}
                  onChange={(e) => handleChange('facilityName', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-base mb-1">اسم الغرفة</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.roomName}
                  onChange={(e) => handleChange('roomName', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-base mb-1">رقم الطلب</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.requestNumber}
                  onChange={(e) => handleChange('requestNumber', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-base mb-1">(700) رقم المنشأة</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  placeholder="7038783275"
                  value={form.facility700}
                  onChange={(e) => handleChange('facility700', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-base mb-1">اسم مقدم الطلب</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.applicantName}
                  onChange={(e) => handleChange('applicantName', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-base mb-1">نوع الطلب</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.requestType}
                  onChange={(e) => handleChange('requestType', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-base mb-1">
                  تاريخ ووقت إنشاء الطلب
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.creationDate}
                  onChange={(e) => handleChange('creationDate', e.target.value)}
                  placeholder="DD/MM/YYYY, HH:MM:SS"
                />
              </div>

              <div>
                <label className="block font-bold text-base mb-1">مبلغ الطلب</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.requestAmount}
                  onChange={(e) => handleChange('requestAmount', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-base mb-1">
                  تاريخ صلاحية الطلب
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-base mb-1">
                  رقم السجل التجاري
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.recordNumber}
                  onChange={(e) => handleChange('recordNumber', e.target.value)}
                />
              </div>

              {/* ✅ حالة الطلب + رفع ملف PDF */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2 items-end">
                <div>
                  <label className="block font-bold text-base mb-1">حالة الطلب</label>
                  <input
                    className="w-full border rounded px-3 py-2 "
                    value={form.requestStatus}
                    onChange={(e) => handleChange('requestStatus', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-bold text-base mb-1">رفع ملف PDF</label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 pr-24"
                      placeholder="No file chosen"
                      value={fileName}
                      readOnly
                    />
                    <label className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded cursor-pointer">
                      Choose File
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) =>
                          setFileName(
                            e.target.files?.[0] ? e.target.files[0].name : ''
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="px-4 py-3 flex flex-col sm:flex-row justify-start w-full items-center gap-2 sticky bottom-0 bg-white border-t">
            <button
              onClick={handleSave}
              className="px-4 py-2 w-full sm:w-auto cursor-pointer rounded bg-blue-600 text-white"
            >
              حفظ النموذج
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 w-full sm:w-auto cursor-pointer rounded bg-gray-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
