import React from 'react';
import { Lead } from '../../types/crm.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  onAssign?: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
  compact?: boolean;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  converted: 'bg-purple-100 text-purple-800',
  lost: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-800',
};

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onEdit,
  onDelete,
  onAssign,
  onView,
  compact = false
}) => {
  const formatCurrency = (amount?: number, currency?: string) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">
                {lead.company || lead.email}
              </h3>
              <Badge variant="secondary" className={statusColors[lead.status]}>
                {lead.status}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {lead.first_name && lead.last_name 
                ? `${lead.first_name} ${lead.last_name}`
                : lead.email
              }
            </div>
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <span>{formatDate(lead.created_at)}</span>
              {lead.budget && (
                <span>{formatCurrency(lead.budget, lead.currency)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(lead)}
              >
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(lead)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            name={`${lead.first_name || ''} ${lead.last_name || ''}`}
            email={lead.email}
            className="h-10 w-10"
          />
          <div>
            <h3 className="font-medium text-gray-900">
              {lead.company || 'No Company'}
            </h3>
            <p className="text-sm text-gray-500">{lead.email}</p>
          </div>
        </div>
        <Badge variant="secondary" className={statusColors[lead.status]}>
          {lead.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Contact</p>
          <p className="text-sm text-gray-500">
            {lead.first_name && lead.last_name 
              ? `${lead.first_name} ${lead.last_name}`
              : 'Not specified'
            }
          </p>
        </div>
        {lead.phone && (
          <div>
            <p className="text-sm font-medium text-gray-900">Phone</p>
            <p className="text-sm text-gray-500">{lead.phone}</p>
          </div>
        )}
        {lead.title && (
          <div>
            <p className="text-sm font-medium text-gray-900">Title</p>
            <p className="text-sm text-gray-500">{lead.title}</p>
          </div>
        )}
        {lead.source && (
          <div>
            <p className="text-sm font-medium text-gray-900">Source</p>
            <p className="text-sm text-gray-500">{lead.source}</p>
          </div>
        )}
        {lead.budget && (
          <div>
            <p className="text-sm font-medium text-gray-900">Budget</p>
            <p className="text-sm text-gray-500">
              {formatCurrency(lead.budget, lead.currency)}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">Created</p>
          <p className="text-sm text-gray-500">{formatDate(lead.created_at)}</p>
        </div>
      </div>

      {lead.notes && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
          <p className="text-sm text-gray-500 line-clamp-2">{lead.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(lead)}
            >
              View Details
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(lead)}
            >
              Edit
            </Button>
          )}
          {onAssign && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssign(lead)}
            >
              Assign
            </Button>
          )}
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(lead)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
