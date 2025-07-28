// Generate mock uptime data (10 ticks for last 30 minutes)
const generateUptimeData = (reliability: number): boolean[] => {
  return Array.from({ length: 10 }, () => Math.random() < reliability);
};

export const mockWebsites = [
  {
    id: '1',
    name: 'Company Website',
    url: 'https://company.com',
    status: true,
    uptimePercentage: 99.9,
    responseTime: 142,
    uptimeData: generateUptimeData(0.95),
    lastChecked: '2 minutes ago'
  },
  {
    id: '2',
    name: 'API Gateway',
    url: 'https://api.company.com',
    status: true,
    uptimePercentage: 99.7,
    responseTime: 89,
    uptimeData: generateUptimeData(0.93),
    lastChecked: '1 minute ago'
  },
  {
    id: '3',
    name: 'Customer Portal',
    url: 'https://portal.company.com',
    status: false,
    uptimePercentage: 97.2,
    responseTime: 0,
    uptimeData: generateUptimeData(0.85),
    lastChecked: '30 seconds ago'
  },
  {
    id: '4',
    name: 'Documentation Site',
    url: 'https://docs.company.com',
    status: true,
    uptimePercentage: 100,
    responseTime: 67,
    uptimeData: generateUptimeData(1.0),
    lastChecked: '3 minutes ago'
  },
  {
    id: '5',
    name: 'Blog',
    url: 'https://blog.company.com',
    status: true,
    uptimePercentage: 98.8,
    responseTime: 234,
    uptimeData: generateUptimeData(0.9),
    lastChecked: '4 minutes ago'
  }
];