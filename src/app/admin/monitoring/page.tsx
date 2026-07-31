"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import {
  Eye,
  MessageSquare,
  ShoppingCart,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface ActivityLog {
  id: string;
  type: "chat" | "order" | "payment" | "user_action" | "system";
  title: string;
  description: string;
  timestamp: number;
  status: "pending" | "completed" | "failed" | "warning";
  userId?: string;
  details?: any;
}

interface MonitoringStats {
  activeChats: number;
  pendingOrders: number;
  failedPayments: number;
  activeUsers: number;
  systemHealth: number; // 0-100%
}

export default function MonitoringPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<MonitoringStats>({
    activeChats: 0,
    pendingOrders: 0,
    failedPayments: 0,
    activeUsers: 0,
    systemHealth: 95,
  });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadMonitoringData();

    // Set up real-time listeners
    if (autoRefresh) {
      const interval = setInterval(loadMonitoringData, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadMonitoringData = async () => {
    try {
      // Get active chats
      const chatsRef = collection(db, "chats");
      const chatQuery = query(chatsRef, limit(100));
      const chatSnapshot = await getDocs(chatQuery);
      const activeChats = chatSnapshot.size;

      // Get pending transactions
      const transRef = collection(db, "transactions");
      const transQuery = query(
        transRef,
        where("status", "==", "pending"),
        limit(100),
      );
      const transSnapshot = await getDocs(transQuery);
      const pendingOrders = transSnapshot.size;

      // Get failed payments
      const failedQuery = query(
        transRef,
        where("status", "==", "failed"),
        limit(100),
      );
      const failedSnapshot = await getDocs(failedQuery);
      const failedPayments = failedSnapshot.size;

      // Get active users (logged in today)
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, limit(100));
      const userSnapshot = await getDocs(userQuery);
      const activeUsers = userSnapshot.size;

      setStats({
        activeChats,
        pendingOrders,
        failedPayments,
        activeUsers,
        systemHealth: Math.max(75, 100 - failedPayments * 5),
      });

      // Load recent activities
      const recentActivities: ActivityLog[] = [];

      // Recent chats
      const recentChatsRef = collection(db, "chats");
      const recentChatQuery = query(
        recentChatsRef,
        orderBy("timestamp", "desc"),
        limit(5),
      );
      const recentChatSnapshot = await getDocs(recentChatQuery);
      recentChatSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        recentActivities.push({
          id: doc.id,
          type: "chat",
          title: "New Chat Started",
          description: `Session: ${doc.id.substring(0, 8)}...`,
          timestamp: data.timestamp || Date.now(),
          status: data.isEscalated ? "warning" : "completed",
          details: data,
        });
      });

      // Recent transactions
      const recentTransRef = collection(db, "transactions");
      const recentTransQuery = query(
        recentTransRef,
        orderBy("timestamp", "desc"),
        limit(5),
      );
      const recentTransSnapshot = await getDocs(recentTransQuery);
      recentTransSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        recentActivities.push({
          id: doc.id,
          type: "payment",
          title: `Payment ${data.status === "completed" ? "Success" : data.status}`,
          description: `Rp ${(data.amount || 0).toLocaleString("id-ID")}`,
          timestamp: data.timestamp || Date.now(),
          status: data.status as any,
          userId: data.userId,
          details: data,
        });
      });

      // Sort by timestamp
      recentActivities.sort((a, b) => b.timestamp - a.timestamp);

      setActivities(recentActivities.slice(0, 15));
      setLoading(false);
    } catch (error) {
      console.error("Error loading monitoring data:", error);
      toast.error("Gagal memuat data monitoring");
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString("id-ID");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageSquare size={16} className="text-blue-600" />;
      case "order":
      case "payment":
        return <ShoppingCart size={16} className="text-green-600" />;
      default:
        return <Eye size={16} className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      warning: "bg-orange-100 text-orange-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
          👁️ System Monitoring
        </h1>
        <p className="text-gray-600 font-poppins">
          Real-time monitoring of chats, orders, and system health
        </p>
        <div className="flex items-center gap-3 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700 font-poppins">
              Auto-refresh (every 5 seconds)
            </span>
          </label>
          <button
            onClick={loadMonitoringData}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-poppins"
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Active Chats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare size={24} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              LIVE
            </span>
          </div>
          <p className="text-gray-600 text-sm font-poppins">Active Chats</p>
          <p className="text-3xl font-bold text-gray-900 font-poppins">
            {stats.activeChats}
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart size={24} className="text-yellow-600" />
            {stats.pendingOrders > 0 && (
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                PENDING
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm font-poppins">Pending Orders</p>
          <p className="text-3xl font-bold text-gray-900 font-poppins">
            {stats.pendingOrders}
          </p>
        </div>

        {/* Failed Payments */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle size={24} className="text-red-600" />
            {stats.failedPayments > 0 && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                {stats.failedPayments} Failed
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm font-poppins">Failed Payments</p>
          <p className="text-3xl font-bold text-gray-900 font-poppins">
            {stats.failedPayments}
          </p>
        </div>

        {/* Active Users */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <Users size={24} className="text-green-600 mb-2" />
          <p className="text-gray-600 text-sm font-poppins">Active Users</p>
          <p className="text-3xl font-bold text-gray-900 font-poppins">
            {stats.activeUsers}
          </p>
        </div>

        {/* System Health */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp
              size={24}
              className={
                stats.systemHealth > 80
                  ? "text-green-600"
                  : stats.systemHealth > 60
                    ? "text-yellow-600"
                    : "text-red-600"
              }
            />
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                stats.systemHealth > 80
                  ? "bg-green-50 text-green-600"
                  : stats.systemHealth > 60
                    ? "bg-yellow-50 text-yellow-600"
                    : "bg-red-50 text-red-600"
              }`}
            >
              {stats.systemHealth}%
            </span>
          </div>
          <p className="text-gray-600 text-sm font-poppins">System Health</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all ${
                stats.systemHealth > 80
                  ? "bg-green-600"
                  : stats.systemHealth > 60
                    ? "bg-yellow-600"
                    : "bg-red-600"
              }`}
              style={{ width: `${stats.systemHealth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins flex items-center gap-2">
          <Clock size={20} /> Recent Activities
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8 font-poppins">
            No recent activities
          </p>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 font-poppins text-sm">
                      {activity.title}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${getStatusBadge(
                        activity.status,
                      )}`}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-poppins mb-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 font-poppins">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 font-poppins">
          <strong>💡 Tip:</strong> This dashboard automatically updates every 5
          seconds. Click "Refresh Now" to manually update, or disable
          auto-refresh to reduce server load.
        </p>
      </div>
    </div>
  );
}
