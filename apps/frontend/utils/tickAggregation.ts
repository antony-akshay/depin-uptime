interface Tick {
  id: string;
  createdAt: string;
  status: string;
  latency: number;
}

interface AggregatedTick {
  timestamp: Date;
  isUp: boolean;
  averageLatency: number;
  tickCount: number;
}

export function aggregateTicksBy3Minutes(ticks: Tick[]): boolean[] {
  if (!ticks || ticks.length === 0) {
    // Return 10 false values if no ticks available
    return Array(10).fill(false);
  }

  // Sort ticks by createdAt (newest first)
  const sortedTicks = [...ticks].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const now = new Date();
  const aggregatedTicks: AggregatedTick[] = [];

  // Create 10 three-minute windows going back 30 minutes
  for (let i = 0; i < 10; i++) {
    const windowEnd = new Date(now.getTime() - (i * 3 * 60 * 1000)); // 3 minutes ago
    const windowStart = new Date(windowEnd.getTime() - (3 * 60 * 1000)); // 6 minutes ago

    // Find all ticks within this 3-minute window
    const windowTicks = sortedTicks.filter(tick => {
      const tickTime = new Date(tick.createdAt);
      return tickTime >= windowStart && tickTime < windowEnd;
    });

    if (windowTicks.length > 0) {
      // Calculate if the window is "up" (majority of ticks are successful)
      const upTicks = windowTicks.filter(tick => 
        tick.status === 'up' || tick.status === 'online' || tick.status === 'success'
      );
      const isUp = upTicks.length > windowTicks.length / 2;

      // Calculate average latency
      const totalLatency = windowTicks.reduce((sum, tick) => sum + tick.latency, 0);
      const averageLatency = totalLatency / windowTicks.length;

      aggregatedTicks.push({
        timestamp: windowEnd,
        isUp,
        averageLatency,
        tickCount: windowTicks.length
      });
    } else {
      // No ticks in this window - consider it down
      aggregatedTicks.push({
        timestamp: windowEnd,
        isUp: false,
        averageLatency: 0,
        tickCount: 0
      });
    }
  }

  // Return just the boolean array for the uptime visualization
  return aggregatedTicks.map(tick => tick.isUp);
}

export function calculateUptimePercentage(ticks: Tick[]): number {
  if (!ticks || ticks.length === 0) return 0;

  const upTicks = ticks.filter(tick => 
    tick.status === 'up' || tick.status === 'online' || tick.status === 'success'
  );

  return Math.round((upTicks.length / ticks.length) * 100 * 10) / 10;
}

export function getLatestStatus(ticks: Tick[]): "good" | "bad" | "unknown" {
  if (!ticks || ticks.length === 0) return "unknown";

  // Sort by createdAt and get the most recent tick
  const latestTick = [...ticks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  if (latestTick.status === "up" || latestTick.status === "online" || latestTick.status === "success") {
    return "good";
  }

  if (latestTick.status === "down" || latestTick.status === "offline" || latestTick.status === "failure") {
    return "bad";
  }

  return "unknown";
}


export function getAverageResponseTime(ticks: Tick[]): number {
  if (!ticks || ticks.length === 0) return 0;

  const totalLatency = ticks.reduce((sum, tick) => sum + tick.latency, 0);
  return Math.round(totalLatency / ticks.length);
}

export function getLastCheckedTime(ticks: Tick[]): string {
  if (!ticks || ticks.length === 0) return 'Never';

  const latestTick = ticks.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const now = new Date();
  const tickTime = new Date(latestTick.createdAt);
  const diffInMinutes = Math.floor((now.getTime() - tickTime.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  return `${diffInDays} days ago`;
}