import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { CalendarDays, IndianRupee, Loader2, Users, CheckCircle2 } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present', color: 'bg-emerald-600 text-white', chip: 'bg-emerald-100 text-emerald-700' },
  { value: 'half_day', label: 'Half Day', color: 'bg-amber-500 text-white', chip: 'bg-amber-100 text-amber-700' },
  { value: 'absent', label: 'Absent', color: 'bg-red-600 text-white', chip: 'bg-red-100 text-red-700' },
  { value: 'leave', label: 'Leave', color: 'bg-slate-500 text-white', chip: 'bg-slate-200 text-slate-700' },
]

const todayStr = () => new Date().toISOString().slice(0, 10)
const currentMonthStr = () => new Date().toISOString().slice(0, 7)

const daysInMonth = (monthStr) => {
  const [y, m] = monthStr.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

const formatCurrency = (n) => `₹${(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

export function StaffAttendanceManager() {
  const [tab, setTab] = useState('mark')
  const [staff, setStaff] = useState([])
  const [staffLoading, setStaffLoading] = useState(true)

  const [date, setDate] = useState(todayStr())
  const [dayRecords, setDayRecords] = useState({})
  const [dayLoading, setDayLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  const [month, setMonth] = useState(currentMonthStr())
  const [monthRecords, setMonthRecords] = useState([])
  const [monthLoading, setMonthLoading] = useState(true)

  useEffect(() => {
    supabase.from('staff').select('*').order('display_order')
      .then(({ data, error }) => {
        if (error) console.error('[StaffAttendanceManager] staff load failed:', error)
        setStaff(data || [])
        setStaffLoading(false)
      })
  }, [])

  const loadDay = () => {
    setDayLoading(true)
    supabase.from('staff_attendance').select('*').eq('date', date)
      .then(({ data, error }) => {
        if (error) console.error('[StaffAttendanceManager] day load failed:', error)
        const map = {}
        for (const r of data || []) map[r.staff_id] = r.status
        setDayRecords(map)
        setDayLoading(false)
      })
  }
  useEffect(loadDay, [date])

  const loadMonth = () => {
    setMonthLoading(true)
    const start = `${month}-01`
    const end = `${month}-${String(daysInMonth(month)).padStart(2, '0')}`
    supabase.from('staff_attendance').select('*').gte('date', start).lte('date', end)
      .then(({ data, error }) => {
        if (error) console.error('[StaffAttendanceManager] month load failed:', error)
        setMonthRecords(data || [])
        setMonthLoading(false)
      })
  }
  useEffect(loadMonth, [month])

  const markStatus = async (staffId, status) => {
    setSavingId(staffId)
    const { error } = await supabase.from('staff_attendance')
      .upsert({ staff_id: staffId, date, status }, { onConflict: 'staff_id,date' })
    setSavingId(null)
    if (error) {
      console.error('[StaffAttendanceManager] mark failed:', error)
      toast.error('Failed to save attendance')
      return
    }
    setDayRecords(prev => ({ ...prev, [staffId]: status }))
  }

  const markAllPresent = async () => {
    if (staff.length === 0) return
    setDayLoading(true)
    const rows = staff.map(s => ({ staff_id: s.id, date, status: 'present' }))
    const { error } = await supabase.from('staff_attendance').upsert(rows, { onConflict: 'staff_id,date' })
    setDayLoading(false)
    if (error) {
      console.error('[StaffAttendanceManager] mark-all failed:', error)
      toast.error('Failed to mark all present')
      return
    }
    toast.success('Marked everyone present')
    loadDay()
  }

  const monthSummary = useMemo(() => {
    const total = daysInMonth(month)
    return staff.map(s => {
      const recs = monthRecords.filter(r => r.staff_id === s.id)
      const present = recs.filter(r => r.status === 'present').length
      const halfDay = recs.filter(r => r.status === 'half_day').length
      const absent = recs.filter(r => r.status === 'absent').length
      const leave = recs.filter(r => r.status === 'leave').length
      const perDayRate = total > 0 ? (s.monthly_salary || 0) / total : 0
      const payable = present * perDayRate + halfDay * perDayRate * 0.5
      return { staff: s, present, halfDay, absent, leave, perDayRate, payable, totalDays: total }
    })
  }, [staff, monthRecords, month])

  const totalPayable = monthSummary.reduce((sum, r) => sum + r.payable, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Staff Attendance & Salary</h1>
          <p className="text-slate-500 mt-1">Track daily attendance and calculate salary payable</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setTab('mark')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'mark' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setTab('salary')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'salary' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
          >
            Salary Report
          </button>
        </div>
      </div>

      {tab === 'mark' ? (
        <div>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
              <CalendarDays size={16} className="text-slate-400" />
              <input
                type="date"
                value={date}
                max={todayStr()}
                onChange={e => setDate(e.target.value)}
                className="text-sm focus:outline-none"
              />
            </div>
            <button
              onClick={markAllPresent}
              disabled={staffLoading || staff.length === 0}
              className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={16} /> Mark All Present
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            {staffLoading || dayLoading ? (
              <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
            ) : staff.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Users size={40} className="mx-auto mb-4 opacity-30" />
                <p>No staff added yet. Add staff members first.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {staff.map(member => {
                  const status = dayRecords[member.id]
                  return (
                    <div key={member.id} className="p-4 sm:p-5 flex items-center gap-4 flex-wrap">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 overflow-hidden shrink-0 flex items-center justify-center">
                        {member.photo_url
                          ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                          : <Users size={16} className="text-emerald-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-[140px]">
                        <div className="font-semibold text-slate-800">{member.name}</div>
                        <div className="text-xs text-slate-500">{member.designation}</div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {STATUS_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => markStatus(member.id, opt.value)}
                            disabled={savingId === member.id}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                              status === opt.value ? opt.color : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
              <CalendarDays size={16} className="text-slate-400" />
              <input
                type="month"
                value={month}
                max={currentMonthStr()}
                onChange={e => setMonth(e.target.value)}
                className="text-sm focus:outline-none"
              />
            </div>
          </div>

          {staffLoading || monthLoading ? (
            <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
          ) : staff.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100">
              <IndianRupee size={40} className="mx-auto mb-4 opacity-30" />
              <p>No staff added yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-100">
                    <th className="px-5 py-3">Staff</th>
                    <th className="px-3 py-3 text-center">Present</th>
                    <th className="px-3 py-3 text-center">Half Day</th>
                    <th className="px-3 py-3 text-center">Absent</th>
                    <th className="px-3 py-3 text-center">Leave</th>
                    <th className="px-3 py-3 text-right">Monthly Salary</th>
                    <th className="px-3 py-3 text-right">Per Day Rate</th>
                    <th className="px-5 py-3 text-right">Payable Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {monthSummary.map(row => (
                    <tr key={row.staff.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-800">{row.staff.name}</div>
                        <div className="text-xs text-slate-500">{row.staff.designation}</div>
                      </td>
                      <td className="px-3 py-3 text-center text-emerald-700 font-medium">{row.present}</td>
                      <td className="px-3 py-3 text-center text-amber-600 font-medium">{row.halfDay}</td>
                      <td className="px-3 py-3 text-center text-red-600 font-medium">{row.absent}</td>
                      <td className="px-3 py-3 text-center text-slate-500 font-medium">{row.leave}</td>
                      <td className="px-3 py-3 text-right text-slate-600">{formatCurrency(row.staff.monthly_salary)}</td>
                      <td className="px-3 py-3 text-right text-slate-500">{formatCurrency(row.perDayRate)}</td>
                      <td className="px-5 py-3 text-right font-bold text-slate-800">{formatCurrency(row.payable)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-100">
                    <td colSpan={7} className="px-5 py-3 text-right font-semibold text-slate-500">Total Payable</td>
                    <td className="px-5 py-3 text-right font-bold text-emerald-700">{formatCurrency(totalPayable)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-3">
            Per day rate = monthly salary ÷ days in month. Half day counts as 0.5 of the daily rate. Absent and leave days are unpaid.
          </p>
        </div>
      )}
    </div>
  )
}
