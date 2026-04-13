import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Phone, 
  Mail, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Plus,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useApi } from '../../hooks/useApi';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  companies: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  contacts: {
    total: number;
    new: number;
    qualified: number;
    converted: number;
  };
  quotes: {
    total: number;
    draft: number;
    sent: number;
    accepted: number;
    totalValue: number;
  };
}

interface RecentActivity {
  id: number;
  type: 'user_created' | 'contact_added' | 'quote_created' | 'company_created';
  description: string;
  timestamp: string;
  user: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

export function ERPDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { execute: fetchDashboardStats } = useApi('/api/dashboard/stats', {
    method: 'GET'
  });

  const { execute: fetchRecentActivity } = useApi('/api/dashboard/activity', {
    method: 'GET'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentActivity()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (activityResponse.success) {
        setRecentActivity(activityResponse.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'add-user',
      title: 'Add User',
      description: 'Create a new user account',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      route: '/users'
    },
    {
      id: 'add-contact',
      title: 'Add Contact',
      description: 'Create a new contact',
      icon: <Phone className="w-6 h-6" />,
      color: 'bg-green-500',
      route: '/contacts'
    },
    {
      id: 'create-quote',
      title: 'Create Quote',
      description: 'Generate a new quote',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-purple-500',
      route: '/quotes'
    },
    {
      id: 'add-company',
      title: 'Add Company',
      description: 'Register a new company',
      icon: <Building2 className="w-6 h-6" />,
      color: 'bg-orange-500',
      route: '/companies'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created': return <Users className="w-4 h-4 text-blue-600" />;
      case 'contact_added': return <Phone className="w-4 h-4 text-green-600" />;
      case 'quote_created': return <FileText className="w-4 h-4 text-purple-600" />;
      case 'company_created': return <Building2 className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">ERP Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening in your business.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search dashboard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card key={action.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <div 
              className="flex items-center space-x-4 p-4"
              onClick={() => navigate(action.route)}
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.users.total || 0}</p>
              <div className="flex items-center space-x-1 mt-2">
                {stats?.users.growth && stats.users.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${stats?.users.growth && stats.users.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.users.growth || 0}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600">Companies</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.companies.total || 0}</p>
              <div className="flex items-center space-x-1 mt-2">
                {stats?.companies.growth && stats.companies.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${stats?.companies.growth && stats.companies.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.companies.growth || 0}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600">Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.contacts.total || 0}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="success" className="text-xs">
                  {stats?.contacts.qualified || 0} Qualified
                </Badge>
                <Badge variant="primary" className="text-xs">
                  {stats?.contacts.converted || 0} Converted
                </Badge>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600">Quotes Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.quotes.totalValue ? formatCurrency(stats.quotes.totalValue) : '$0'}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {stats?.quotes.total || 0} Total
                </Badge>
                <Badge variant="success" className="text-xs">
                  {stats?.quotes.accepted || 0} Accepted
                </Badge>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {activity.user} - {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Module Overview */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Modules Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => navigate('/users')}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">User Management</p>
                    <p className="text-xs text-gray-500">{stats?.users.total || 0} users</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => navigate('/companies')}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Companies</p>
                    <p className="text-xs text-gray-500">{stats?.companies.total || 0} companies</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => navigate('/contacts')}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">CRM Contacts</p>
                    <p className="text-xs text-gray-500">{stats?.contacts.total || 0} contacts</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => navigate('/quotes')}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sales Quotes</p>
                    <p className="text-xs text-gray-500">{stats?.quotes.total || 0} quotes</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rates</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Contact to Lead</span>
                  <span className="text-sm font-medium text-gray-900">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Lead to Opportunity</span>
                  <span className="text-sm font-medium text-gray-900">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Opportunity to Quote</span>
                  <span className="text-sm font-medium text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Quote to Sale</span>
                  <span className="text-sm font-medium text-gray-900">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-900">Database Connection</span>
                </div>
                <Badge variant="success">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-900">API Services</span>
                </div>
                <Badge variant="success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-900">Email Service</span>
                </div>
                <Badge variant="warning">Warning</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-900">Backup Status</span>
                </div>
                <Badge variant="success">Up to date</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
