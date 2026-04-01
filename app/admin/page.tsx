import { supabase } from '@/lib/supabase'

// Forces Next.js to dynamically render this page so the data is never stale
export const revalidate = 0;

export default async function AdminDashboard() {
  const { data: apps, error } = await supabase
    .from('applications')
    .select(`
      *,
      candidates (name, email, github, linkedin)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div style={{ padding: 48, color: '#ff4444', backgroundColor: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
        Error loading applications: {error.message}
      </div>
    )
  }

  return (
    <main style={{ padding: '48px 24px', color: '#eaeaea', backgroundColor: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: 16 }}>RWX Inbound Candidates</h1>
        
        <div style={{ overflowX: 'auto', marginTop: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                <th style={{ padding: 12 }}>Candidate</th>
                <th style={{ padding: 12 }}>Experience</th>
                <th style={{ padding: 12 }}>CI/CD Stack</th>
                <th style={{ padding: 12 }}>Resume</th>
                <th style={{ padding: 12 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {apps?.map((app: any) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{app.candidates.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{app.candidates.email}</div>
                    {app.candidates.github && <div style={{ fontSize: 12, color: '#d97706' }}>{app.candidates.github}</div>}
                  </td>
                  <td style={{ padding: 12 }}>{app.years_exp} yrs</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {app.cicd_tools?.map((tool: string) => (
                        <span key={tool} style={{ fontSize: 10, background: '#222', padding: '2px 6px', borderRadius: 4 }}>{tool}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    {app.resume_url ? (
                      <a href={app.resume_url} target="_blank" rel="noreferrer" style={{ color: '#4ade80', textDecoration: 'none' }}>View PDF</a>
                    ) : (
                      <span style={{ color: '#555' }}>No file</span>
                    )}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{ fontSize: 12, textTransform: 'uppercase', padding: '4px 8px', background: 'rgba(217,119,6,0.1)', color: '#d97706', borderRadius: 4 }}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!apps || apps.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#555' }}>No applications yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}