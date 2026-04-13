import { Request, Response } from 'express';
import { logError } from '../modules/shared/utils/logger';

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

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      // Mock stats - in a real app, these would come from the database
      const stats: DashboardStats = {
        users: {
          total: 1,
          active: 1,
          newThisMonth: 1,
          growth: 100
        },
        companies: {
          total: 2,
          active: 2,
          newThisMonth: 2,
          growth: 100
        },
        contacts: {
          total: 2,
          new: 1,
          qualified: 1,
          converted: 0
        },
        quotes: {
          total: 2,
          draft: 1,
          sent: 1,
          accepted: 0,
          totalValue: 100000
        }
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch dashboard stats');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard stats'
      });
    }
  }

  async getActivity(req: Request, res: Response) {
    try {
      // Mock activity data - in a real app, this would come from the database
      const activities: RecentActivity[] = [
        {
          id: 1,
          type: 'user_created',
          description: 'System Administrator user account created',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          user: 'System'
        },
        {
          id: 2,
          type: 'quote_created',
          description: 'Quote Q-2024-002 created for Tech Solutions',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          user: 'Admin'
        },
        {
          id: 3,
          type: 'contact_added',
          description: 'Jane Smith contact added from referral',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: 'Admin'
        }
      ];

      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      logError(error as Error, 'Failed to fetch dashboard activity');
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard activity'
      });
    }
  }
}

export const dashboardController = new DashboardController();
