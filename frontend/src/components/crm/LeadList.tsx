import React, { useState, useEffect } from 'react';
import { Lead, User } from '../../types/crm.types';
import { crmService } from '../../services/crm.service';
import LeadCard from './LeadCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Modal from '../ui/Modal';
import LeadForm from './LeadForm';
import { Badge } from '../ui/Badge';

interface LeadListProps {
  onLeadSelect?: (lead: Lead) => void;
  compact?: boolean;
  showFilters?: boolean;
}

const LeadList: React.FC<LeadListProps> = ({
  onLeadSelect,
  compact = false,
  showFilters = true
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const leadsPerPage = compact ? 10 : 20;

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' },
    { value: 'archived', label: 'Archived' },
  ];

  const userOptions = [
    { value: '', label: 'All Users' },
    ...users.map(user => ({
      value: user.id.toString(),
      label: `${user.first_name || ''} ${user.last_name || ''} (${user.email})`
    }))
  ];

  const fetchLeads = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = reset ? 1 : page;
      const params = {
        limit: leadsPerPage,
        offset: (currentPage - 1) * leadsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(assignedFilter && { assignedTo: assignedFilter }),
      };

      const response = await crmService.getLeads(params);
      
      if (reset) {
        setLeads(response.data);
        setPage(1);
      } else {
        setLeads(prev => [...prev, ...response.data]);
      }
      
      setTotal(response.total);
      setHasMore(leads.length + response.data.length < response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll use a mock implementation
      const mockUsers: User[] = [
        {
          id: 1,
          uuid: '1',
          email: 'admin@nexusengineering.com',
          first_name: 'System',
          last_name: 'Administrator',
          role: 'admin',
          is_active: true,
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      setUsers(mockUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchLeads(true);
    fetchUsers();
  }, [searchTerm, statusFilter, assignedFilter]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchLeads();
    }
  };

  const handleCreateLead = () => {
    setShowCreateModal(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (window.confirm(`Are you sure you want to delete ${lead.company || lead.email}?`)) {
      try {
        await crmService.deleteLead(lead.id);
        fetchLeads(true); // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete lead');
      }
    }
  };

  const handleAssignLead = (lead: Lead) => {
    // This would open an assignment modal
    // For now, we'll just log it
    console.log('Assign lead:', lead);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    onLeadSelect?.(lead);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedLead) {
        await crmService.updateLead(selectedLead.id, data);
      } else {
        await crmService.createLead(data);
      }
      
      setShowCreateModal(false);
      setShowEditModal(false);
      setSelectedLead(null);
      fetchLeads(true); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lead');
    }
  };

  const handleFormCancel = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedLead(null);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchLeads(true)}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
          <p className="text-gray-600">
            {total} lead{total !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button onClick={handleCreateLead}>
          Create Lead
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                />
              </div>
              <div className="min-w-[150px]">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statusOptions}
                />
              </div>
              <div className="min-w-[200px]">
                <Select
                  value={assignedFilter}
                  onChange={setAssignedFilter}
                  options={userOptions}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lead List */}
      <div className={compact ? 'space-y-2' : 'space-y-4'}>
        {leads.length === 0 && !loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter || assignedFilter
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first lead.'
                }
              </p>
              {!searchTerm && !statusFilter && !assignedFilter && (
                <Button onClick={handleCreateLead}>
                  Create Lead
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                compact={compact}
                onView={handleViewLead}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
                onAssign={handleAssignLead}
              />
            ))}
            
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  loading={loading}
                  disabled={loading}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Loading State */}
      {loading && leads.length === 0 && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Lead Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleFormCancel}
        title="Create New Lead"
        size="lg"
      >
        <LeadForm
          users={users}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Edit Lead Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleFormCancel}
        title="Edit Lead"
        size="lg"
      >
        {selectedLead && (
          <LeadForm
            lead={selectedLead}
            users={users}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </Modal>
    </div>
  );
};

export default LeadList;
