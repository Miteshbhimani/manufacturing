import React, { useState, useEffect } from 'react';
import { Lead, CreateLeadRequest, UpdateLeadRequest, User } from '../../types/crm.types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface LeadFormProps {
  lead?: Lead;
  users?: User[];
  onSubmit: (data: CreateLeadRequest | UpdateLeadRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({
  lead,
  users = [],
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateLeadRequest>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    title: '',
    source: '',
    status: 'new',
    budget: undefined,
    currency: 'USD',
    requirements: '',
    notes: '',
    assignedTo: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      setFormData({
        email: lead.email,
        firstName: lead.first_name || '',
        lastName: lead.last_name || '',
        phone: lead.phone || '',
        company: lead.company || '',
        title: lead.title || '',
        source: lead.source || '',
        status: lead.status,
        budget: lead.budget || undefined,
        currency: lead.currency || 'USD',
        requirements: lead.requirements || '',
        notes: lead.notes || '',
        assignedTo: lead.assigned_to || undefined,
      });
    }
  }, [lead]);

  const handleInputChange = (field: keyof CreateLeadRequest, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.budget && (typeof formData.budget !== 'number' || formData.budget < 0)) {
      newErrors.budget = 'Budget must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clean up the data before submission
    const cleanedData = {
      ...formData,
      budget: formData.budget && formData.budget > 0 ? formData.budget : undefined,
      assignedTo: formData.assignedTo && formData.assignedTo > 0 ? formData.assignedTo : undefined,
    };

    onSubmit(cleanedData);
  };

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' },
    { value: 'archived', label: 'Archived' },
  ];

  const sourceOptions = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'email', label: 'Email' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'trade_show', label: 'Trade Show' },
    { value: 'other', label: 'Other' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'INR', label: 'INR' },
  ];

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.first_name || ''} ${user.last_name || ''} (${user.email})`
  }));

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {lead ? 'Edit Lead' : 'Create New Lead'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={errors.email}
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <Input
                label="Phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(value) => handleInputChange('phone', value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="First Name"
                value={formData.firstName || ''}
                onChange={(value) => handleInputChange('firstName', value)}
                placeholder="John"
              />
            </div>
            <div>
              <Input
                label="Last Name"
                value={formData.lastName || ''}
                onChange={(value) => handleInputChange('lastName', value)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Company"
                value={formData.company || ''}
                onChange={(value) => handleInputChange('company', value)}
                placeholder="Acme Corporation"
              />
            </div>
            <div>
              <Input
                label="Title"
                value={formData.title || ''}
                onChange={(value) => handleInputChange('title', value)}
                placeholder="CEO"
              />
            </div>
          </div>

          {/* Lead Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Status"
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
                options={statusOptions}
              />
            </div>
            <div>
              <Select
                label="Source"
                value={formData.source || ''}
                onChange={(value) => handleInputChange('source', value)}
                options={sourceOptions}
                placeholder="Select source"
              />
            </div>
          </div>

          {/* Budget Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Budget"
                type="number"
                value={formData.budget || ''}
                onChange={(value) => handleInputChange('budget', value ? parseFloat(value) : undefined)}
                error={errors.budget}
                placeholder="10000"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Select
                label="Currency"
                value={formData.currency || 'USD'}
                onChange={(value) => handleInputChange('currency', value)}
                options={currencyOptions}
              />
            </div>
          </div>

          {/* Assignment */}
          {users.length > 0 && (
            <div>
              <Select
                label="Assign To"
                value={formData.assignedTo?.toString() || ''}
                onChange={(value) => handleInputChange('assignedTo', value ? parseInt(value) : undefined)}
                options={userOptions}
                placeholder="Select user"
              />
            </div>
          )}

          {/* Additional Information */}
          <div>
            <Textarea
              label="Requirements"
              value={formData.requirements || ''}
              onChange={(value) => handleInputChange('requirements', value)}
              placeholder="What are the lead's specific requirements?"
              rows={3}
            />
          </div>

          <div>
            <Textarea
              label="Notes"
              value={formData.notes || ''}
              onChange={(value) => handleInputChange('notes', value)}
              placeholder="Additional notes about this lead..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              {lead ? 'Update Lead' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadForm;
