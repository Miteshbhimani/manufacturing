import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Edit, Trash2, Search, Filter, Download, Upload, Shield, Mail, Phone, Calendar, Building2, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import { useApi } from '../../hooks/useApi';

interface User {
  id: number;
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'member' | 'sales' | 'crm';
  isActive: boolean;
  emailVerified: boolean;
  companyId: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  loginAttempts: number;
  lockedUntil?: string;
}

interface CreateUserForm {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'member' | 'sales' | 'crm';
  companyId: number;
}

export function UserManagementPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'member',
    companyId: 1
  });

  const { execute: fetchUsers, loading: fetchLoading } = useApi('/api/users', {
    method: 'GET'
  });

  const { execute: createUser, loading: createLoading } = useApi('/api/auth/register', {
    method: 'POST'
  });

  const { execute: updateUser, loading: updateLoading } = useApi(`/api/users/:id`, {
    method: 'PUT'
  });

  const { execute: deleteUser, loading: deleteLoading } = useApi(`/api/users/:id`, {
    method: 'DELETE'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetchUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      if (response.success) {
        setIsCreateModalOpen(false);
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'member',
          companyId: 1
        });
        loadUsers();
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      const response = await updateUser({
        params: { id: selectedUser.id },
        body: formData
      });
      if (response.success) {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        loadUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await deleteUser({
        params: { id: userId }
      });
      if (response.success) {
        loadUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'User',
      accessor: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {user.firstName?.[0] || user.email[0].toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (user: User) => (
        <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
          {user.role}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: (user: User) => (
        <div className="flex items-center space-x-2">
          <Badge variant={user.isActive ? 'success' : 'danger'}>
            {user.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {user.emailVerified && (
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Email Verified" />
          )}
        </div>
      )
    },
    {
      header: 'Last Login',
      accessor: (user: User) => (
        <div className="text-sm text-gray-500">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedUser(user);
              setFormData({
                email: user.email,
                password: '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                role: user.role,
                companyId: user.companyId
              });
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteUser(user.id)}
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
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

      {/* Users Table */}
      <Card>
        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={fetchLoading}
        />
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Enter first name"
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Enter last name"
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
            required
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter password"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
                <option value="crm">CRM</option>
              </select>
            </div>
            <Input
              label="Company ID"
              type="number"
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: parseInt(e.target.value) })}
              placeholder="Enter company ID"
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
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Enter first name"
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Enter last name"
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
            required
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter new password (leave blank to keep current)"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
                <option value="crm">CRM</option>
              </select>
            </div>
            <Input
              label="Company ID"
              type="number"
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: parseInt(e.target.value) })}
              placeholder="Enter company ID"
            />
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
              Update User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
