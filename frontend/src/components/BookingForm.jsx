import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';

const BookingForm = ({ selectedTimeSlot, onBookingSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    serviceType: '',
    duration: '60',
    type: 'video',
    notes: '',
    date: '',
    time: selectedTimeSlot?.time || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const serviceTypes = [
    'Food Safety Consultation',
    'Menu Development',
    'Compliance Audit',
    'Kitchen Design Review',
    'Staff Training',
    'Health Inspection Prep',
    'Cost Analysis',
    'Other'
  ];

  const convertTo24Hour = (time12h) => {
    if (!time12h) return '';
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12).padStart(2, '0');
    
    return `${hours}:${minutes}:00`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.serviceType) newErrors.serviceType = 'Please select a service';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const endpoint = `${apiUrl}/api/booking/`;

      const payload = {
        title: formData.title.trim(),
        service_type: formData.serviceType,
        duration_minutes: parseInt(formData.duration, 10),
        session_type: formData.type,
        date: formData.date,
        time: convertTo24Hour(formData.time),
        notes: formData.notes.trim() || null
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        setErrors({ general: 'Server returned unexpected response.' });
        setIsSubmitting(false);
        return;
      }

      if (res.ok && res.status === 201) {
        onBookingSuccess?.(data);
        navigate('/client_dashboard');
      } else {
        if (res.status === 401) {
          localStorage.removeItem(ACCESS_TOKEN);
          navigate('/login');
        } else if (res.status === 400 || res.status === 422) {
          if (data && typeof data === 'object') {
            setErrors(data);
          } else {
            setErrors({ general: 'Invalid data. Please check your inputs.' });
          }
        } else {
          setErrors({ general: `Failed to book appointment: ${data.message || 'Server error'}` });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.serviceType && formData.date && formData.time && formData.duration;

  return (
    /* Outer Container: Clean Pure White Background */
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 sm:p-8 font-sans text-slate-900">
      
      {/* Form Card Container: White Card with Soft Border & Delicate Shadow */}
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-6 sm:p-10">
        
        {/* Morning Header */}
        <div className="relative mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Schedule Consultation</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">Select your parameters and reserve your morning or afternoon session.</p>
          </div>
        </div>

        {errors.general && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs text-center font-medium">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-2">
              Consultation Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. Kitchen Operations Review"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.title ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-amber-500 focus:ring-amber-100'
              }`}
              required
            />
            {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Service Type & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-2">
                Service Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.serviceType ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-amber-500 focus:ring-amber-100'
                }`}
                required
              >
                <option value="" disabled className="text-slate-400">Select service</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service} className="text-slate-900">
                    {service}
                  </option>
                ))}
              </select>
              {errors.serviceType && <p className="mt-1.5 text-xs text-red-500">{errors.serviceType}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.duration ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-amber-500 focus:ring-amber-100'
                }`}
                required
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">2 hours</option>
              </select>
              {errors.duration && <p className="mt-1.5 text-xs text-red-500">{errors.duration}</p>}
            </div>
          </div>

          {/* Custom Segmented Session Type */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-2">
              Session Format
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: 'video', label: 'Video', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { id: 'in-person', label: 'In-Person', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
                { id: 'phone', label: 'Phone', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' }
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleInputChange('type', type.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    formData.type === type.id
                      ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={type.icon} />
                  </svg>
                  <span className="text-xs font-semibold">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.date ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-amber-500 focus:ring-amber-100'
                }`}
                required
              />
              {errors.date && <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-2">
                Time Slot <span className="text-red-500">*</span>
              </label>
              {selectedTimeSlot ? (
                <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700 flex items-center justify-between cursor-not-allowed">
                  <span className="font-medium">{formData.time}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">Locked</span>
                </div>
              ) : (
                <select
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.time ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-amber-500 focus:ring-amber-100'
                  }`}
                  required
                >
                  <option value="" disabled className="text-slate-400">Select time</option>
                  <option value="9:00 AM">9:00 AM (Morning)</option>
                  <option value="10:00 AM">10:00 AM (Morning)</option>
                  <option value="11:00 AM">11:00 AM (Morning)</option>
                  <option value="1:00 PM">1:00 PM (Afternoon)</option>
                  <option value="2:00 PM">2:00 PM (Afternoon)</option>
                  <option value="3:00 PM">3:00 PM (Afternoon)</option>
                  <option value="4:00 PM">4:00 PM (Afternoon)</option>
                </select>
              )}
              {errors.time && <p className="mt-1.5 text-xs text-red-500">{errors.time}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-2">
              Session Details <span className="text-slate-400 lowercase font-normal">(optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Key discussion topics, questions, or preliminary details..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3.5 px-6 rounded-2xl font-semibold tracking-wide transition-all shadow-lg shadow-amber-500/25 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Book Consultation</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingForm;