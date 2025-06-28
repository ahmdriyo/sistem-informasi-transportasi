'use client'
import React, { useState } from 'react'
import { Form, Input, Button, Select, notification } from 'antd'
import axios from 'axios'

const { Option } = Select

type GestureFormValues = {
  gestureType: string
  actionTarget: string
  status: string
  confidence: string
  userAgent: string
}

const GestureNavigation = () => {
  const [gestureType, setGestureType] = useState('')
  const [actionTarget, setActionTarget] = useState('')
  const [status, setStatus] = useState('')
  const [confidence, setConfidence] = useState('')
  const [userAgent, setUserAgent] = useState('')
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const handleChange = (changedValues: Partial<GestureFormValues>) => {
    if ('gestureType' in changedValues) setGestureType(changedValues.gestureType || '')
    if ('actionTarget' in changedValues) setActionTarget(changedValues.actionTarget || '')
    if ('status' in changedValues) setStatus(changedValues.status || '')
    if ('confidence' in changedValues) setConfidence(changedValues.confidence || '')
    if ('userAgent' in changedValues) setUserAgent(changedValues.userAgent || '')
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.post('/api/gesture-navigation', {
        gestureType,
        actionTarget,
        status,
        confidence: parseFloat(confidence),
        userAgent,
      })
      api.open({
        key:'success',
        message: 'Notification Title',
        description: 'description.',
      })
      setGestureType('')
      setActionTarget('')
      setStatus('')
      setConfidence('')
      setUserAgent('')
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        background: '#fff',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px #f0f1f2',
      }}
    >
      {contextHolder}
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Tambah Log Gesture Navigation</h2>
      <Form
        layout="vertical"
        onValuesChange={handleChange}
        onFinish={handleSubmit}
        initialValues={{ gestureType, actionTarget, status, confidence, userAgent }}
      >
        <Form.Item label="Gesture Type" name="gestureType" rules={[{ required: true, message: 'Wajib diisi' }]}>
          <Input
            placeholder="Masukkan gesture type"
            value={gestureType}
            onChange={(e) => setGestureType(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Action Target" name="actionTarget" rules={[{ required: true, message: 'Wajib diisi' }]}>
          <Input
            placeholder="Masukkan action target"
            value={actionTarget}
            onChange={(e) => setActionTarget(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Pilih status' }]}>
          <Select placeholder="Pilih Status" value={status} onChange={(value) => setStatus(value)}>
            <Option value="berhasil">Berhasil</Option>
            <Option value="gagal">Gagal</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Confidence" name="confidence" rules={[{ required: true, message: 'Wajib diisi' }]}>
          <Input
            type="number"
            step="0.01"
            placeholder="Masukkan confidence"
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="User Agent" name="userAgent">
          <Input
            placeholder="Masukkan user agent (opsional)"
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default GestureNavigation
