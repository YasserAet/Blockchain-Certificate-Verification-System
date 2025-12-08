'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Award, Building2, Briefcase, Activity, TrendingUp, Database, Shield, Search, X } from 'lucide-react'

interface SystemStats {
  totalUsers: number
  totalCertificates: number
  totalInstitutions: number
  totalEmployers: number
  recentActivity: {
    certificatesIssued24h: number
    verificationsToday: number
    newUsersThisWeek: number
  }
  fraudStats: {
    totalFraudDetected: number
    averageFraudScore: number
  }
}

interface User {
  id: number
  email: string
  name: string
  role: string
  created_at: string
  is_active: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push(`/${parsedUser.role}/dashboard`)
      return
    }

    setUser(parsedUser)
    fetchStats(token)
    fetchUsers(token)
  }, [router])

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async (token: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleToggleUser = async (userId: number, currentStatus: boolean) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${API_URL}/admin/users/${userId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      if (response.ok) {
        // Refresh users list
        fetchUsers(token)
      } else {
        alert('Failed to update user status')
      }
    } catch (error) {
      console.error('Error toggling user:', error)
      alert('Failed to update user status')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    router.push('/login')
  }

  if (!user) return null

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || u.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">System monitoring and user management</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Certificates</p>
                    <p className="text-2xl font-bold">{stats.totalCertificates}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Institutions</p>
                    <p className="text-2xl font-bold">{stats.totalInstitutions}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employers</p>
                    <p className="text-2xl font-bold">{stats.totalEmployers}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Certificates Issued (24h)</p>
                    <p className="text-2xl font-bold">{stats.recentActivity.certificatesIssued24h}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verifications Today</p>
                    <p className="text-2xl font-bold">{stats.recentActivity.verificationsToday}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">New Users (7 days)</p>
                    <p className="text-2xl font-bold">{stats.recentActivity.newUsersThisWeek}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Fraud Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fraud Cases Detected</p>
                    <p className="text-2xl font-bold">{stats.fraudStats.totalFraudDetected}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Database className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Fraud Score</p>
                    <p className="text-2xl font-bold">{stats.fraudStats.averageFraudScore.toFixed(1)}%</p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <Card className="p-6 border-border/40 mb-8">
            <p className="text-muted-foreground text-center">No statistics available</p>
          </Card>
        )}

        {/* User Management */}
        <Card className="p-6 border-border/40">
          <h2 className="text-2xl font-bold mb-6">User Management</h2>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="institution">Institutions</option>
              <option value="employer">Employers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border/40 hover:bg-accent/5">
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-500'
                              : u.role === 'institution'
                              ? 'bg-blue-500/10 text-blue-500'
                              : u.role === 'employer'
                              ? 'bg-orange-500/10 text-orange-500'
                              : 'bg-green-500/10 text-green-500'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.is_active
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUser(u.id, u.is_active)}
                          disabled={u.id === user?.id}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  )
}
