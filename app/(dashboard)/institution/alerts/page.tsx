'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface FraudAlert {
  id: string
  certificateId: string
  studentName: string
  certificateTitle: string
  fraudType: string
  confidence: number
  detectedAt: string
  status: 'pending' | 'resolved' | 'false_positive'
}

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending'>('pending')

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/institution/fraud-alerts?status=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setAlerts(data.alerts)
        }
      } catch (err) {
        console.error('Failed to fetch alerts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [filter])

  const handleResolve = async (alertId: string, resolution: 'resolved' | 'false_positive') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/institution/fraud-alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: resolution }),
      })

      if (response.ok) {
        setAlerts(alerts.filter(a => a.id !== alertId))
      }
    } catch (err) {
      console.error('Failed to resolve alert:', err)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fraud Alerts</h1>
        <p className="text-muted mt-1">Review and manage suspected fraudulent certificates</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-accent text-accent-foreground'
              : 'bg-primary/20 text-foreground hover:bg-primary/40'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-accent text-accent-foreground'
              : 'bg-primary/20 text-foreground hover:bg-primary/40'
          }`}
        >
          All
        </button>
      </div>

      {loading ? (
        <Card className="glass-effect p-8">
          <div className="text-center text-muted">Loading alerts...</div>
        </Card>
      ) : alerts.length === 0 ? (
        <Card className="glass-effect p-8">
          <div className="text-center">
            <p className="text-muted mb-2">No fraud alerts</p>
            <p className="text-xs text-muted">Great! All certificates are looking good.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="glass-effect">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {alert.studentName}
                      </h3>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
                        {alert.fraudType}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{alert.certificateTitle}</p>
                    <p className="text-xs text-muted mt-1">
                      Detected: {new Date(alert.detectedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-400">
                      {(alert.confidence * 100).toFixed(0)}%
                    </div>
                    <p className="text-xs text-muted">Fraud Confidence</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleResolve(alert.id, 'resolved')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    Mark as Fraud
                  </Button>
                  <Button
                    onClick={() => handleResolve(alert.id, 'false_positive')}
                    className="flex-1 bg-primary/20 hover:bg-primary/40 text-foreground"
                  >
                    False Alarm
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
