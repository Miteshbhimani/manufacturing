import React, { useState } from 'react';
import { Lead } from '../../types/crm.types';
import CRMDashboard from '../../components/crm/CRMDashboard';
import LeadList from '../../components/crm/LeadList';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const CRMPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'leads' | 'lead-detail'>('dashboard');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveView('lead-detail');
  };

  const handleBackToLeads = () => {
    setActiveView('leads');
    setSelectedLead(null);
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
    setSelectedLead(null);
  };

  const renderNavigation = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Customer Relationship Management</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={activeView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveView('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant={activeView === 'leads' ? 'default' : 'outline'}
            onClick={() => setActiveView('leads')}
          >
            Leads
          </Button>
          {selectedLead && (
            <Button
              variant={activeView === 'lead-detail' ? 'default' : 'outline'}
              onClick={() => setActiveView('lead-detail')}
            >
              Lead Details
            </Button>
          )}
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button
          onClick={handleBackToDashboard}
          className="hover:text-gray-900 transition-colors"
        >
          Dashboard
        </button>
        {activeView !== 'dashboard' && (
          <>
            <span>/</span>
            <button
              onClick={handleBackToLeads}
              className="hover:text-gray-900 transition-colors"
            >
              Leads
            </button>
          </>
        )}
        {selectedLead && (
          <>
            <span>/</span>
            <span className="text-gray-900">
              {selectedLead.company || selectedLead.email}
            </span>
          </>
        )}
      </div>
    </div>
  );

  const renderLeadDetail = () => {
    if (!selectedLead) return null;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const formatCurrency = (amount?: number, currency?: string) => {
      if (!amount) return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
      }).format(amount);
    };

    const statusColors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      lost: 'bg-red-100 text-red-800',
      archived: 'bg-gray-100 text-gray-800',
    };

    return (
      <div className="space-y-6">
        {/* Lead Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600">
                    {(selectedLead.first_name || '')[0] || (selectedLead.email || '')[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedLead.company || 'No Company'}
                  </h2>
                  <p className="text-gray-600">{selectedLead.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className={statusColors[selectedLead.status]}>
                      {selectedLead.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Created {formatDate(selectedLead.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">Edit Lead</Button>
                <Button variant="outline">Assign</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Name</h4>
                <p className="text-gray-600">
                  {selectedLead.first_name && selectedLead.last_name
                    ? `${selectedLead.first_name} ${selectedLead.last_name}`
                    : 'Not specified'
                  }
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email</h4>
                <p className="text-gray-600">{selectedLead.email}</p>
              </div>
              {selectedLead.phone && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Phone</h4>
                  <p className="text-gray-600">{selectedLead.phone}</p>
                </div>
              )}
              {selectedLead.title && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Title</h4>
                  <p className="text-gray-600">{selectedLead.title}</p>
                </div>
              )}
              {selectedLead.source && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Source</h4>
                  <p className="text-gray-600">{selectedLead.source}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Company</h4>
                <p className="text-gray-600">{selectedLead.company || 'Not specified'}</p>
              </div>
              {selectedLead.budget && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Budget</h4>
                  <p className="text-gray-600">
                    {formatCurrency(selectedLead.budget, selectedLead.currency)}
                  </p>
                </div>
              )}
              {selectedLead.requirements && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Requirements</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedLead.requirements}</p>
                </div>
              )}
              {selectedLead.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedLead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Lead Created</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedLead.created_at)}
                  </p>
                </div>
              </div>
              
              {selectedLead.updated_at !== selectedLead.created_at && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Lead Updated</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedLead.updated_at)}
                    </p>
                  </div>
                </div>
              )}
              
              {selectedLead.converted_at && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Lead Converted</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedLead.converted_at)}
                    </p>
                  </div>
                </div>
              )}
              
              {selectedLead.lost_at && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Lead Lost</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedLead.lost_at)}
                    </p>
                    {selectedLead.lost_reason && (
                      <p className="text-sm text-gray-600 mt-1">
                        Reason: {selectedLead.lost_reason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderNavigation()}
      
      {activeView === 'dashboard' && <CRMDashboard />}
      {activeView === 'leads' && (
        <LeadList onLeadSelect={handleLeadSelect} />
      )}
      {activeView === 'lead-detail' && renderLeadDetail()}
    </div>
  );
};

export default CRMPage;
