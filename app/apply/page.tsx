'use client'
import { useState } from 'react'

const CICD_TOOLS = [
  'GitHub Actions','GitLab CI','Jenkins','CircleCI',
  'Buildkite','Travis CI','ArgoCD','Tekton','Drone CI',
]

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: '', email: '', github: '', linkedin: '',
    years: '', why: '', cicdTools: [] as string[],
  })
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle'|'submitting'|'done'|'error'>('idle')

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const toggleTool = (tool: string) =>
    setForm(f => ({
      ...f,
      cicdTools: f.cicdTools.includes(tool)
        ? f.cicdTools.filter(t => t !== tool)
        : [...f.cicdTools, tool],
    }))

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) return alert('Max 5MB')
    setFile(f)
  }

  const isValid = form.name && form.email.includes('@') && form.why.length > 20

  const handleSubmit = async () => {
    if (!isValid) return
    setStatus('submitting')
    try {
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) =>
        body.append(k, Array.isArray(v) ? JSON.stringify(v) : v)
      )
      if (file) body.append('resume', file)
      
      const res = await fetch('/api/apply', { method: 'POST', body })
      if (!res.ok) throw new Error()
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  // Shared styles for form inputs
  const inputStyle = {
    padding: '12px 16px',
    background: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#111827',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box' as const,
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }

  const labelStyle = {
    marginBottom: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151'
  }

  if (status === 'done') return (
    <div style={{ textAlign: 'center', padding: '100px 24px', color: '#111827', backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>Application submitted</h2>
      <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>Dan and Tommy will be in touch.</p>
    </div>
  )

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px', color: '#111827', backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '16px', color: '#000' }}>
          Software Engineer, Implementation Team
        </h1>
        <div style={{ fontSize: '1.125rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p><strong style={{ color: '#111827' }}>Location:</strong> Columbus, OH</p>
          <p><strong style={{ color: '#111827' }}>Salary Range:</strong> $130,000 – $175,000 plus equity</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Full name *</label>
          <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="Jane Smith" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Email *</label>
          <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>GitHub</label>
          <input style={inputStyle} value={form.github} onChange={set('github')} placeholder="github.com/username" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>LinkedIn</label>
          <input style={inputStyle} value={form.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/username" />
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column' }}>
        <label style={labelStyle}>Years of experience</label>
        <select style={inputStyle} value={form.years} onChange={set('years')}>
          <option value="">Select range</option>
          <option value="1-2">1–2 years</option>
          <option value="3-5">3–5 years</option>
          <option value="5-8">5–8 years</option>
          <option value="8+">8+ years</option>
        </select>
      </div>

      <div style={{ marginTop: 24 }}>
        <label style={labelStyle}>CI/CD tools</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
          {CICD_TOOLS.map(tool => {
            const isSelected = form.cicdTools.includes(tool);
            return (
              <button key={tool} type="button" onClick={() => toggleTool(tool)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 20,
                  border: `1px solid ${isSelected ? '#00c885' : '#d1d5db'}`,
                  background: isSelected ? '#e6f9f3' : '#f9fafb',
                  color: isSelected ? '#008a5b' : '#4b5563',
                  cursor: 'pointer', 
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}>
                {tool}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column' }}>
        <label style={labelStyle}>Why RWX? *</label>
        <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.why} onChange={set('why')} maxLength={600}
          placeholder="What draws you to RWX and this role? Be direct. (Min 20 characters)" />
        <div style={{ fontSize: '0.75rem', textAlign: 'right', color: '#6b7280', marginTop: 8 }}>
          {form.why.length} / 600
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column' }}>
        <label style={labelStyle}>Resume (PDF, max 5MB)</label>
        <input type="file" accept=".pdf" onChange={handleFile} 
          style={{ 
            color: '#4b5563',
            padding: '12px 0',
            fontSize: '0.875rem'
          }} 
        />
      </div>

      <button onClick={handleSubmit} disabled={!isValid || status === 'submitting'}
        style={{ 
          marginTop: 40, 
          width: '100%', 
          padding: '14px', 
          background: '#00c885', // Matches the RWX header button
          border: 'none', 
          borderRadius: 8, 
          color: '#ffffff', 
          fontSize: '1.125rem',
          fontWeight: 600,
          cursor: isValid ? 'pointer' : 'not-allowed', 
          opacity: isValid ? 1 : 0.6,
          boxShadow: isValid ? '0 4px 6px rgba(0, 200, 133, 0.2)' : 'none',
          transition: 'opacity 0.2s'
        }}>
        {status === 'submitting' ? 'Submitting application...' : 'Submit application'}
      </button>

      {status === 'error' && <p style={{ color: '#ef4444', marginTop: 12, textAlign: 'center', fontWeight: 500 }}>Something went wrong. Try again.</p>}
    </main>
  )
}