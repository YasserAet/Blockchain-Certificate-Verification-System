'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SystemStats {
  totalUsers: number
  totalCertificates: number
  fraudAlertsCount: number
  blockchainTxCount: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalCertificates: 0,
    fraudAlertsCount: 0,
    blockchainTxCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted mt-1">System overview and management</p>
      </div>

      {loading ? (
        <div className="text-center text-muted">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-effect p-6">
              <div className="text-sm text-muted mb-1">Total Users</div>
              <div className="text-3xl font-bold text-accent">{stats.totalUsers}</div>
            </Card>

            <Card className="glass-effect p-6">
              <div className="text-sm text-muted mb-1">Certificates</div>
              <div className="text-3xl font-bold text-accent">{stats.totalCertificates}</div>
            </Card>

            <Card className="glass-effect p-6">
              <div className="text-sm text-muted mb-1">Fraud Alerts</div>
              <div className="text-3xl font-bold text-red-400">
                {stats.fraudAlertsCount}
              </div>
            </Card>

            <Card className="glass-effect p-6">
              <div className="text-sm text-muted mb-1">Blockchain TXs</div>
              <div className="text-3xl font-bold text-green-400">
                {stats.blockchainTxCount}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Button className="w-full bg-primary/20 hover:bg-primary/40 text-foreground justify-start">
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/alerts">
              <Button className="w-full bg-primary/20 hover:bg-primary/40 text-foreground justify-start">
                View Alerts
              </Button>
            </Link>
            <Link href="/admin/blockchain">
              <Button className="w-full bg-primary/20 hover:bg-primary/40 text-foreground justify-start">
                Blockchain Status
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button className="w-full bg-primary/20 hover:bg-primary/40 text-foreground justify-start">
                Settings
              </Button>
            </Link>
          </div>
        </>
      )}

      <Card className="glass-effect p-6">
        <h3 className="font-semibold text-foreground mb-4">System Health</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Backend API</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
              Operational
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Database</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
              Operational
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">ML Service</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
              Operational
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Blockchain RPC</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
              Operational
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
