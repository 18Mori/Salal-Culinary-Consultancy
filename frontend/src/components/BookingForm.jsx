import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import LoadingIndicator from './LoadingIndicator';

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

  // Convert 12hr to 24hr
  const convertTo24Hour = (time12h) => {
    if (!time12h) return '';
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12).padStart(2, '0');
    
    return `${hours}:${minutes}:00`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validates fields
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

      console.log('Sending to backend:', payload);

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
        const text = await res.text();
        console.error('Server returned non-JSON:', text);
        setErrors({
          general: 'Server returned unexpected response. Please contact support.'
        });
        setIsSubmitting(false);
        return;
      }

      if (res.ok && res.status === 201) {
        console.log('Booking successful:', data);
        onBookingSuccess?.(data);
        navigate('/client_index');
      } else {
        console.error('Backend error:', res.status, data);

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
          setErrors({
            general: `Failed to book appointment: ${data.message || 'Unknown server error'}`
          });
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ general: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.serviceType && formData.date && formData.time && formData.duration;

  return (
    <div className="mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        New Booking
      </h3>

      {errors.general && <p className="text-sm text-red-500 mb-2">{errors.general}</p>}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.serviceType}
            onChange={(e) => handleInputChange('serviceType', e.target.value)}
            className={`w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${errors.serviceType ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Select a service</option>
            {serviceTypes.map(service => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {errors.serviceType && <p className="mt-1 text-sm text-red-500">{errors.serviceType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Consultation Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Brief description of your consultation"
            className={`w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${errors.title ? 'border-red-500' : ''}`}
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Session Duration <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className={`w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${errors.duration ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Select duration</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">2 hours</option>
          </select>
          {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Session Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="sessionType"
                value="video"
                checked={formData.type === 'video'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">Video Call</span>
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="sessionType"
                value="in-person"
                checked={formData.type === 'in-person'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">In-Person</span>
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="sessionType"
                value="phone"
                checked={formData.type === 'phone'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">Phone Call</span>
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any specific topics, materials needed, or preparation requirements..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${errors.date ? 'border-red-500' : ''}`}
              required
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            {selectedTimeSlot ? (
              <div className="h-10 px-3 py-2 text-sm border border-input bg-muted rounded-md flex items-center cursor-not-allowed text-muted-foreground">
                {formData.time}
              </div>
            ) : (
              <select
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${errors.time ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select time</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
              </select>
            )}
            {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`bg-slate-600 flex-1 h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 ${
              !isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <LoadingIndicator size="sm" />
                Booking...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Book Consultation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;