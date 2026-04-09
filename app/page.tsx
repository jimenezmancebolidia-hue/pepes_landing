'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xrixgqqmzbzycgcbukds.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyaXhncXFtemJ6eWNnY2J1a2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODY3MjUsImV4cCI6MjA5MTI2MjcyNX0.zLSoWPhD_cGBj4vvGDccx73LX5CrBvWPIZ4kHKrnpSs'
)

export default function WaitlistPage() {
  const [wallet, setWallet] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ticket, setTicket] = useState<{id: string; wallet: string; refUrl: string} | null>(null)

  const handleClaim = async () => {
    if (!wallet || wallet.length < 10) {
      setError('☠ You must provide a valid wallet address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const plotId = `#${Math.floor(Math.random() * 9000 + 1000)}`
      const { error: dbError } = await supabase
        .from('waitlist')
        .insert([{ wallet_address: wallet, plot_id: plotId, ref: `?ref=${wallet.slice(0, 10)}` }])
      
      if (dbError) throw dbError
      
      const refUrl = `${window.location.origin}?ref=${wallet.slice(0, 10)}`
      setTicket({ id: plotId, wallet, refUrl })
    } catch (e: any) {
      setError(e.message || 'Something went wrong. The graves are full.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: '#1A1A1B', color: 'white', fontFamily: 'sans-serif' }}>
      
      {!ticket ? (
        <div style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <h1 style={{ marginBottom: '20px' }}>PEPE'S GRAVEYARD</h1>
          <input 
            type="text" 
            placeholder="Enter your Wallet Address (0x...)" 
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none' }}
          />
          {error && <p style={{ color: '#ff4444' }}>{error}</p>}
          <button 
            onClick={handleClaim} 
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: '#2ECC71', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {loading ? 'CLAIMING...' : 'CLAIM MY PLOT'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', border: '2px dashed #F1C40F', padding: '30px', borderRadius: '15px', maxWidth: '500px' }}>
          <h2 style={{ color: '#F1C40F' }}>GRAVEDIGGER TICKET ACQUIRED!</h2>
          <p style={{ fontSize: '20px' }}>PLOT ID: {ticket.id}</p>
          <p style={{ fontSize: '12px', opacity: 0.7 }}>Wallet: {ticket.wallet}</p>
          
          <div style={{ margin: '25px 0' }}>
            <a 
              href="https://t.me/Pepe_Graveyard" 
              target="_blank" 
              style={{ display: 'inline-block', padding: '15px 25px', backgroundColor: '#2ECC71', color: 'black', fontWeight: 'bold', textDecoration: 'none', borderRadius: '10px', fontSize: '18px' }}
            >
              GET MY TELEGRAM RANK
            </a>
          </div>

          <p>Share your referral link:</p>
          <p style={{ color: '#F1C40F', wordBreak: 'break-all' }}>{ticket.refUrl}</p>
        </div>
      )}

      <footer style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
        <a href="https://x.com/PepesGraveyard" target="_blank" style={{ color: 'white', textDecoration: 'none' }}>X (@PepesGraveyard)</a>
        <a href="https://t.me/Pepe_Graveyard" target="_blank" style={{ color: 'white', textDecoration: 'none' }}>Telegram</a>
      </footer>
    </main>
  )
}
