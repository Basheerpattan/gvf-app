import { useState } from 'react'
import { Video, Settings, Wifi, WifiOff, ExternalLink, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'

const defaultCameras = [
  { id: 1, name: 'Main Entrance',      url: '', status: 'offline' },
  { id: 2, name: 'Reception Area',     url: '', status: 'offline' },
  { id: 3, name: 'Therapy Room A',     url: '', status: 'offline' },
  { id: 4, name: 'Garden / Courtyard', url: '', status: 'offline' },
]

export function CCTVDashboard() {
  const [cameras, setCameras] = useState(defaultCameras)
  const [editingId, setEditingId] = useState(null)
  const [urlInput, setUrlInput] = useState('')

  const saveUrl = (id) => {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, url: urlInput, status: urlInput ? 'live' : 'offline' } : c))
    setEditingId(null)
    setUrlInput('')
  }

  const removeUrl = (id) => {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, url: '', status: 'offline' } : c))
  }

  const addCamera = () => {
    const newId = Math.max(...cameras.map(c => c.id)) + 1
    setCameras(prev => [...prev, { id: newId, name: `Camera ${newId}`, url: '', status: 'offline' }])
  }

  const removeCamera = (id) => {
    setCameras(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">CCTV Monitor</h1>
          <p className="text-slate-500 mt-1">Live security camera feeds for facility monitoring</p>
        </div>
        <Button onClick={addCamera}><Plus size={16} /> Add Camera</Button>
      </div>

      {/* Status banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
        <p className="text-sm text-emerald-800">
          <strong>Live Feed System Active</strong> — Add your camera stream URLs (HLS, RTSP via embed, or iframe URL) to each feed slot below.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
        {cameras.map(cam => (
          <div key={cam.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Camera header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800">
              <div className="flex items-center gap-2">
                <Video size={16} className="text-emerald-400" />
                <span className="text-white text-sm font-medium">{cam.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {cam.status === 'live'
                  ? <span className="flex items-center gap-1 text-xs text-emerald-400"><Wifi size={12} /> LIVE</span>
                  : <span className="flex items-center gap-1 text-xs text-slate-500"><WifiOff size={12} /> OFFLINE</span>
                }
                <button onClick={() => removeCamera(cam.id)} className="text-slate-500 hover:text-red-400 transition-colors ml-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Feed area */}
            <div className="aspect-video bg-slate-900 relative">
              {cam.url ? (
                <iframe
                  src={cam.url}
                  className="w-full h-full border-0"
                  allowFullScreen
                  title={cam.name}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                  <Video size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">No stream configured</p>
                  <p className="text-xs text-slate-700 mt-1">Click settings below to add URL</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4">
              {editingId === cam.id ? (
                <div className="space-y-2">
                  <input
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="Enter stream URL (iframe embed URL or HLS URL)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveUrl(cam.id)} className="flex-1">Save URL</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setEditingId(cam.id); setUrlInput(cam.url) }}
                    className="flex items-center gap-1.5 text-slate-600"
                  >
                    <Settings size={14} /> Configure
                  </Button>
                  {cam.url && (
                    <a href={cam.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800">
                      <ExternalLink size={12} /> Open
                    </a>
                  )}
                  {cam.url && (
                    <button onClick={() => removeUrl(cam.id)} className="text-xs text-red-400 hover:text-red-600 ml-auto">
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-3">How to Connect Camera Feeds</h3>
        <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
          <li>Use an <strong>IP camera</strong> that supports HLS (HTTP Live Streaming)</li>
          <li>Or use a service like <strong>Milestone XProtect, Genetec, or Eagle Eye</strong> that provides embeddable iframe URLs</li>
          <li>For IP cameras, get the stream URL format: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">http://camera-ip/stream</code></li>
          <li>Paste the stream embed URL in the <strong>Configure</strong> settings above</li>
          <li>URLs can be RTSP (if using a relay), HLS (.m3u8), or direct browser-compatible iframe URLs</li>
        </ol>
      </div>
    </div>
  )
}
