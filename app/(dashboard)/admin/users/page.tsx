'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  status: 'active' | 'suspended' | 'inactive'
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>('all')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `/api/admin/users?role=${roleFilter === 'all' ? '' : roleFilter}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
        }
      } catch (err) {
        console.error('Failed to fetch users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [roleFilter])

  const handleSuspend = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'suspended' } : u))
    } catch (err) {
      console.error('Failed to suspend user:', err)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
        <p className="text-muted mt-1">View and manage platform users</p>
      </div>

      <div className="flex gap-2">
        {['all', 'student', 'institution', 'employer'].map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              roleFilter === role
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary/20 text-foreground hover:bg-primary/40'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <Card className="glass-effect overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted">Name</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Email</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Role</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Joined</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-border hover:bg-primary/20">
                    <td className="px-6 py-4 text-foreground">{user.name}</td>
                    <td className="px-6 py-4 text-muted text-xs">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-accent/20 text-accent">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => handleSuspend(user.id)}
                        disabled={user.status === 'suspended'}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs"
                      >
                        Suspend
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
  )
}
