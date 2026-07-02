import { useState, useEffect } from 'react'
import { Video, Settings, Wifi, WifiOff, ExternalLink, Plus, Trash2, Camera } from 'lucide-react'
import { Button } from '../ui/Button'

const defaultCameras = [
  { id: 1, name: 'Main Entrance',      ip: '', port: '80', streamPath: '/video', useCustomUrl: false, customUrl: '', url: '', status: 'offline' },
  { id: 2, name: 'Reception Area',     ip: '', port: '80', streamPath: '/video', useCustomUrl: false, customUrl: '', url: '', status: 'offline' },
  { id: 3, name: 'Therapy Room A',     ip: '', port: '80', streamPath: '/video', useCustomUrl: false, customUrl: '', url: '', status: 'offline' },
  { id: 4, name: 'Garden / Courtyard', ip: '', port: '80', streamPath: '/video', useCustomUrl: false, customUrl: '', url: '', status: 'offline' },
]

const STREAM_PRESETS = [
  { label: '/video',  path: '/video' },
  { label: '/mjpeg',  path: '/mjpeg' },
  { label: '/stream', path: '/stream' },
  { label: '/live',   path: '/live' },
]

const STORAGE_KEY = 'gvf_cctv_cameras'

function buildStreamUrl(form) {
  if (form.useCustomUrl) return form.customUrl
  if (!form.ip) return ''
  const port = form.port && form.port !== '80' ? `:${form.port}` : ''
  return `http://${form.ip}${port}${form.streamPath}`
}

export function CCTVDashboard() {
  const [cameras, setCameras] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultCameras
    } catch {
      return defaultCameras
    }
  })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cameras))
  }, [cameras])

  const startEdit = (cam) => {
    setEditingId(cam.id)
    setEditForm({
      name: cam.name,
      ip: cam.ip || '',
      port: cam.port || '80',
      streamPath: cam.streamPath || '/video',
      useCustomUrl: cam.useCustomUrl || false,
      customUrl: cam.customUrl || '',
    })
  }

  const saveCamera = (id) => {
    const url = buildStreamUrl(editForm)
    setCameras(prev => prev.map(c => c.id === id
      ? { ...c, ...editForm, url, status: url ? 'live' : 'offline' }
      : c
    ))
    setEditingId(null)
  }

  const removeStream = (id) => {
    setCameras(prev => prev.map(c => c.id === id
      ? { ...c, ip: '', customUrl: '', url: '', status: 'offline' }
      : c
    ))
  }

  const addCamera = () => {
    const newId = Math.max(...cameras.map(c => c.id)) + 1
    setCameras(prev => [...prev, {
      id: newId, name: `Camera ${newId}`, ip: '', port: '80',
      streamPath: '/video', useCustomUrl: false, customUrl: '', url: '', status: 'offline',
    }])
  }

  const removeCamera = (id) => {
    setCameras(prev => prev.filter(c => c.id !== id))
  }

  const previewUrl = editForm.ip || editForm.customUrl ? buildStreamUrl(editForm) : ''

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">CCTV Monitor</h1>
          <p className="text-slate-500 mt-1">Live security camera feeds for facility monitoring</p>
        </div>
        <Button onClick={addCamera}><Plus size={16} /> Add Camera</Button>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
        <p className="text-sm text-emerald-800">
          <strong>Live Feed System Active</strong> — Enter your camera IP address or embed URL. All settings are saved automatically.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
        {cameras.map(cam => (
          <div key={cam.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* Header */}
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

            {/* Feed */}
            <div className="aspect-video bg-slate-900 relative">
              {cam.url ? (
                cam.useCustomUrl ? (
                  <iframe
                    src={cam.url}
                    className="w-full h-full border-0"
                    allowFullScreen
                    title={cam.name}
                  />
                ) : (
                  <img
                    src={cam.url}
                    alt={cam.name}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                  <Video size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">No stream configured</p>
                  <p className="text-xs text-slate-700 mt-1">Click Configure to add IP or URL</p>
                </div>
              )}
            </div>

            {/* IP badge */}
            {cam.ip && (
              <div className="px-4 pt-2">
                <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  <Camera size={10} />
                  {cam.ip}{cam.port && cam.port !== '80' ? `:${cam.port}` : ''}{cam.streamPath}
                </span>
              </div>
            )}

            {/* Controls */}
            <div className="p-4">
              {editingId === cam.id ? (
                <div className="space-y-3">

                  {/* Camera name */}
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Camera Name</label>
                    <input
                      value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Mode toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditForm(f => ({ ...f, useCustomUrl: false }))}
                      className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${!editForm.useCustomUrl ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      IP Camera
                    </button>
                    <button
                      onClick={() => setEditForm(f => ({ ...f, useCustomUrl: true }))}
                      className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${editForm.useCustomUrl ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      Embed URL
                    </button>
                  </div>

                  {!editForm.useCustomUrl ? (
                    <>
                      {/* IP + Port */}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-slate-500 mb-1 block">IP Address</label>
                          <input
                            value={editForm.ip}
                            onChange={e => setEditForm(f => ({ ...f, ip: e.target.value }))}
                            placeholder="192.168.1.100"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="w-20">
                          <label className="text-xs text-slate-500 mb-1 block">Port</label>
                          <input
                            value={editForm.port}
                            onChange={e => setEditForm(f => ({ ...f, port: e.target.value }))}
                            placeholder="80"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Stream path presets */}
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Stream Path</label>
                        <div className="flex gap-1 flex-wrap mb-1.5">
                          {STREAM_PRESETS.map(p => (
                            <button
                              key={p.path}
                              onClick={() => setEditForm(f => ({ ...f, streamPath: p.path }))}
                              className={`text-xs px-2 py-0.5 rounded border transition-colors ${editForm.streamPath === p.path ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                        <input
                          value={editForm.streamPath}
                          onChange={e => setEditForm(f => ({ ...f, streamPath: e.target.value }))}
                          placeholder="/video"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Preview URL */}
                      {previewUrl && (
                        <p className="text-xs text-slate-400 break-all">
                          URL: <code className="bg-slate-100 px-1 rounded">{previewUrl}</code>
                        </p>
                      )}
                    </>
                  ) : (
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Embed / iframe URL</label>
                      <input
                        value={editForm.customUrl}
                        onChange={e => setEditForm(f => ({ ...f, customUrl: e.target.value }))}
                        placeholder="https://embed.example.com/stream"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveCamera(cam.id)} className="flex-1">Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(cam)}
                    className="flex items-center gap-1.5 text-slate-600"
                  >
                    <Settings size={14} /> Configure
                  </Button>
                  {cam.url && (
                    <a href={cam.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800">
                      <ExternalLink size={12} /> Open
                    </a>
                  )}
                  {(cam.ip || cam.customUrl) && (
                    <button onClick={() => removeStream(cam.id)} className="text-xs text-red-400 hover:text-red-600 ml-auto">
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-3">How to Connect Camera Feeds</h3>
        <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
          <li>Click <strong>Configure</strong> and choose <strong>IP Camera</strong> mode</li>
          <li>Enter the camera's local IP (e.g. <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">192.168.1.100</code>) and port</li>
          <li>Select a stream path preset or type a custom one — check your camera manual</li>
          <li>Or switch to <strong>Embed URL</strong> for cloud services like Milestone or Eagle Eye</li>
          <li>All settings save automatically and persist after page refresh</li>
        </ol>
      </div>
    </div>
  )
}
