import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit, Trash2, Search, Filter, Download, Send, Eye, DollarSign, Calendar, Building2, User, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import { useApi } from '../../hooks/useApi';

interface Quote {
  id: number;
  uuid: string;
  quoteNumber: string;
  opportunityId?: number;
  accountId?: number;
  contactId?: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  subtotal: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  createdBy: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateQuoteForm {
  quoteNumber: string;
  opportunityId?: number;
  accountId?: number;
  contactId?: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  subtotal: number;
  totalAmount: number;
  currency: string;
  notes?: string;
}

interface QuoteItem {
  id: number;
  quoteId: number;
  productId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function QuotesPage() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [formData, setFormData] = useState<CreateQuoteForm>({
    quoteNumber: '',
    opportunityId: undefined,
    accountId: undefined,
    contactId: undefined,
    status: 'draft',
    subtotal: 0,
    totalAmount: 0,
    currency: 'USD',
    notes: ''
  });

  const { execute: fetchQuotes, loading: fetchLoading } = useApi('/api/quotes', {
    method: 'GET'
  });

  const { execute: createQuote, loading: createLoading } = useApi('/api/quotes', {
    method: 'POST'
  });

  const { execute: updateQuote, loading: updateLoading } = useApi(`/api/quotes/:id`, {
    method: 'PUT'
  });

  const { execute: deleteQuote, loading: deleteLoading } = useApi(`/api/quotes/:id`, {
    method: 'DELETE'
  });

  const { execute: sendQuote, loading: sendLoading } = useApi(`/api/quotes/:id/send`, {
    method: 'POST'
  });

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const response = await fetchQuotes();
      if (response.success) {
        setQuotes(response.data);
      }
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createQuote(formData);
      if (response.success) {
        setIsCreateModalOpen(false);
        resetFormData();
        loadQuotes();
      }
    } catch (error) {
      console.error('Failed to create quote:', error);
    }
  };

  const handleUpdateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;
    
    try {
      const response = await updateQuote({
        params: { id: selectedQuote.id },
        body: formData
      });
      if (response.success) {
        setIsEditModalOpen(false);
        setSelectedQuote(null);
        loadQuotes();
      }
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  const handleDeleteQuote = async (quoteId: number) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    
    try {
      const response = await deleteQuote({
        params: { id: quoteId }
      });
      if (response.success) {
        loadQuotes();
      }
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  const handleSendQuote = async (quoteId: number) => {
    try {
      const response = await sendQuote({
        params: { id: quoteId }
      });
      if (response.success) {
        loadQuotes();
      }
    } catch (error) {
      console.error('Failed to send quote:', error);
    }
  };

  const resetFormData = () => {
    setFormData({
      quoteNumber: '',
      opportunityId: undefined,
      accountId: undefined,
      contactId: undefined,
      status: 'draft',
      subtotal: 0,
      totalAmount: 0,
      currency: 'USD',
      notes: ''
    });
  };

  const filteredQuotes = quotes.filter(quote =>
    quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      case 'converted': return <DollarSign className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      header: 'Quote',
      accessor: (quote: Quote) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{quote.quoteNumber}</div>
            <div className="text-sm text-gray-500">
              Created {new Date(quote.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (quote: Quote) => (
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(quote.status)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(quote.status)}
              <span>{quote.status}</span>
            </div>
          </Badge>
        </div>
      )
    },
    {
      header: 'Amount',
      accessor: (quote: Quote) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">
            {quote.currency} {quote.totalAmount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Subtotal: {quote.currency} {quote.subtotal.toLocaleString()}
          </div>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: (quote: Quote) => (
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">
            Account #{quote.accountId || 'N/A'}
          </span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (quote: Quote) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedQuote(quote);
              setIsViewModalOpen(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedQuote(quote);
              setFormData({
                quoteNumber: quote.quoteNumber,
                opportunityId: quote.opportunityId,
                accountId: quote.accountId,
                contactId: quote.contactId,
                status: quote.status,
                subtotal: quote.subtotal,
                totalAmount: quote.totalAmount,
                currency: quote.currency,
                notes: quote.notes || ''
              });
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {quote.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendQuote(quote.id)}
              disabled={sendLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteQuote(quote.id)}
            disabled={deleteLoading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600">Manage sales quotes and proposals</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quote
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-600">
                {quotes.filter(q => q.status === 'draft').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-blue-600">
                {quotes.filter(q => q.status === 'sent').length}
              </p>
            </div>
            <Send className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">
                {quotes.filter(q => q.status === 'accepted').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Quotes Table */}
      <Card>
        <DataTable
          data={filteredQuotes}
          columns={columns}
          loading={fetchLoading}
        />
      </Card>

      {/* Create Quote Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Quote"
      >
        <form onSubmit={handleCreateQuote} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quote Number"
              value={formData.quoteNumber}
              onChange={(e) => setFormData({ ...formData, quoteNumber: e.target.value })}
              placeholder="Enter quote number"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Account ID"
              type="number"
              value={formData.accountId || ''}
              onChange={(e) => setFormData({ ...formData, accountId: parseInt(e.target.value) || undefined })}
              placeholder="Enter account ID"
            />
            <Input
              label="Contact ID"
              type="number"
              value={formData.contactId || ''}
              onChange={(e) => setFormData({ ...formData, contactId: parseInt(e.target.value) || undefined })}
              placeholder="Enter contact ID"
            />
            <Input
              label="Opportunity ID"
              type="number"
              value={formData.opportunityId || ''}
              onChange={(e) => setFormData({ ...formData, opportunityId: parseInt(e.target.value) || undefined })}
              placeholder="Enter opportunity ID"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Subtotal"
              type="number"
              step="0.01"
              value={formData.subtotal}
              onChange={(e) => setFormData({ ...formData, subtotal: parseFloat(e.target.value) || 0 })}
              placeholder="Enter subtotal"
            />
            <Input
              label="Total Amount"
              type="number"
              step="0.01"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
              placeholder="Enter total amount"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter additional notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLoading}>
              {createLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Quote
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Quote Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Quote"
      >
        <form onSubmit={handleUpdateQuote} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quote Number"
              value={formData.quoteNumber}
              onChange={(e) => setFormData({ ...formData, quoteNumber: e.target.value })}
              placeholder="Enter quote number"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Subtotal"
              type="number"
              step="0.01"
              value={formData.subtotal}
              onChange={(e) => setFormData({ ...formData, subtotal: parseFloat(e.target.value) || 0 })}
              placeholder="Enter subtotal"
            />
            <Input
              label="Total Amount"
              type="number"
              step="0.01"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
              placeholder="Enter total amount"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateLoading}>
              {updateLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update Quote
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Quote Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Quote Details"
      >
        {selectedQuote && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Quote Number</p>
                <p className="font-medium text-gray-900">{selectedQuote.quoteNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={getStatusColor(selectedQuote.status)}>
                  {selectedQuote.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-gray-900">
                  {selectedQuote.currency} {selectedQuote.totalAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedQuote.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {selectedQuote.notes && (
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="text-gray-900">{selectedQuote.notes}</p>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              {selectedQuote.status === 'draft' && (
                <Button onClick={() => handleSendQuote(selectedQuote.id)}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Quote
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
