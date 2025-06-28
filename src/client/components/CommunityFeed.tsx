import React, { useState, useEffect } from 'react';

interface CommunityAction {
  id: string;
  username: string;
  action: string;
  message: string;
  timestamp: number;
}

interface CommunityFeedProps {
  className?: string;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ className = '' }) => {
  const [recentActions, setRecentActions] = useState<CommunityAction[]>([]);
  const [totalActions, setTotalActions] = useState(0);

  useEffect(() => {
    // Fetch recent community actions
    const fetchCommunityActions = async () => {
      try {
        const response = await fetch('/api/community-actions');
        if (response.ok) {
          const data = await response.json();
          setRecentActions(data.actions || []);
          setTotalActions(data.totalActions || 0);
        }
      } catch (error) {
        console.error('Failed to fetch community actions:', error);
      }
    };

    fetchCommunityActions();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCommunityActions, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return 'yesterday';
  };

  return (
    <div className={`community-feed ${className}`}>
      <div className="community-header pixel-text">
        <div className="community-title">COMMUNITY</div>
        <div className="total-actions">Total Actions: {totalActions}</div>
      </div>
      
      <div className="recent-actions">
        {recentActions.length > 0 ? (
          recentActions.slice(0, 3).map((action) => (
            <div key={action.id} className="action-entry pixel-text">
              <div className="action-user">{action.username}</div>
              <div className="action-text">{action.message}</div>
              <div className="action-time">{formatTimeAgo(action.timestamp)}</div>
            </div>
          ))
        ) : (
          <div className="no-actions pixel-text">
            Be the first to interact!
          </div>
        )}
      </div>
      
      <div className="urgency-indicators">
        {/* These will be populated based on current stats */}
      </div>
    </div>
  );
};