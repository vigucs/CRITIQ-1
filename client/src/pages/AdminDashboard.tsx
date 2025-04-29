import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, getStats } from '../services/api';
import { User, Stats } from '../types/api';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, statsData] = await Promise.all([
          getUsers(),
          getStats()
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          {stats && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold">{stats.totalReviews}</p>
              </div>
              <div>
                <p className="text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-gray-600">Sentiment Distribution</p>
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span>Positive</span>
                    <span>{stats.sentimentPercentages.positive}%</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Neutral</span>
                    <span>{stats.sentimentPercentages.neutral}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Negative</span>
                    <span>{stats.sentimentPercentages.negative}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 