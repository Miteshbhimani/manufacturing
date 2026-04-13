import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Phone, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X,
  Package,
  Home,
  Mail,
  HelpCircle,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  route: string;
  badge?: string;
  children?: NavItem[];
}

export function ERPNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      route: '/dashboard'
    },
    {
      id: 'auth',
      title: 'Authentication',
      icon: <Users className="w-4 h-4" />,
      route: '/users',
      badge: 'New',
      children: [
        {
          id: 'users',
          title: 'User Management',
          icon: <Users className="w-4 h-4" />,
          route: '/users'
        },
        {
          id: 'roles',
          title: 'Roles & Permissions',
          icon: <Settings className="w-4 h-4" />,
          route: '/roles'
        }
      ]
    },
    {
      id: 'crm',
      title: 'CRM',
      icon: <Phone className="w-4 h-4" />,
      route: '/contacts',
      badge: '5',
      children: [
        {
          id: 'contacts',
          title: 'Contacts',
          icon: <Phone className="w-4 h-4" />,
          route: '/contacts'
        },
        {
          id: 'accounts',
          title: 'Accounts',
          icon: <Building2 className="w-4 h-4" />,
          route: '/accounts'
        },
        {
          id: 'opportunities',
          title: 'Opportunities',
          icon: <FileText className="w-4 h-4" />,
          route: '/opportunities'
        },
        {
          id: 'pipeline',
          title: 'Sales Pipeline',
          icon: <LayoutDashboard className="w-4 h-4" />,
          route: '/pipeline'
        }
      ]
    },
    {
      id: 'sales',
      title: 'Sales',
      icon: <FileText className="w-4 h-4" />,
      route: '/quotes',
      badge: '2',
      children: [
        {
          id: 'quotes',
          title: 'Quotes',
          icon: <FileText className="w-4 h-4" />,
          route: '/quotes'
        },
        {
          id: 'orders',
          title: 'Orders',
          icon: <Package className="w-4 h-4" />,
          route: '/orders'
        },
        {
          id: 'invoices',
          title: 'Invoices',
          icon: <FileText className="w-4 h-4" />,
          route: '/invoices'
        }
      ]
    },
    {
      id: 'company',
      title: 'Company',
      icon: <Building2 className="w-4 h-4" />,
      route: '/companies',
      children: [
        {
          id: 'companies',
          title: 'Company Management',
          icon: <Building2 className="w-4 h-4" />,
          route: '/companies'
        },
        {
          id: 'departments',
          title: 'Departments',
          icon: <Users className="w-4 h-4" />,
          route: '/departments'
        }
      ]
    },
    {
      id: 'products',
      title: 'Products',
      icon: <Package className="w-4 h-4" />,
      route: '/products'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      route: '/settings',
      children: [
        {
          id: 'general',
          title: 'General Settings',
          icon: <Settings className="w-4 h-4" />,
          route: '/settings/general'
        },
        {
          id: 'integrations',
          title: 'Integrations',
          icon: <Settings className="w-4 h-4" />,
          route: '/settings/integrations'
        },
        {
          id: 'backup',
          title: 'Backup & Recovery',
          icon: <Settings className="w-4 h-4" />,
          route: '/settings/backup'
        }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(route + '/');
  };

  const filteredItems = navigationItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.children && item.children.some(child => 
      child.title.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.route);

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            active 
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
              : 'hover:bg-gray-50 text-gray-700'
          } ${level > 0 ? 'ml-' + (level * 4) : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              navigate(item.route);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 ${active ? 'text-blue-700' : 'text-gray-500'}`}>
              {item.icon}
            </div>
            <span className="text-sm font-medium">{item.title}</span>
            {item.badge && (
              <Badge variant="primary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {hasChildren && (
            <div className="w-4 h-4">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isSidebarOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">ERP System</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search */}
      {isSidebarOpen && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="p-4 space-y-2">
        {filteredItems.map(item => renderNavItem(item))}
      </div>

      {/* Footer */}
      {isSidebarOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
