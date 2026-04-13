import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Your Details'   },
  { id: 2, label: 'Dates & Home'  },
  { id: 3, label: 'Pets'          },
  { id: 4, label: 'Home Access'   },
  { id: 5, label: 'Confirm'       },
]

const EMPTY_PET = { type: '', name: '', feeding: '', medication: '', personality: '', notes: '' }

const INIT = {
  // Step 1
  guestName: '', guestEmail: '', guestPhone: '',
  // Step 2
  dateFrom: '', dateTo: '', address: '', specialInstructions: '',
  // Step 3
  hasPets: false, pets: [{ ...EMPTY_PET }],
  // Step 4
  accessInstructions: '', keysInventory: '',
  securityCompany: '', securityContact: '',
  emergencyName: '', emergencyPhone: '', emergencyRelation: '',
  hasPlants: false, hasPool: false, rubbishDay: '',
  wifi: false, wifiPassword: '', dailyUpdates: false,
}

// ─────────────────────────────────────────────────────────────────────────────
// Primitive reusables — defined OUTSIDE parent so React never remounts them
// ─────────────────────────────────────────────────────────────────────────────
function FieldWrap({ label, error, required, children, hint }) {
  return (
    <div className="mb-4">
      <label className="field-label">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', error, autoComplete, inputMode }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      aria-invalid={!!error}
      className={`field-input ${error ? 'border-red-400 focus:ring-red-400 bg-red-50/30' : ''}`}
    />
  )
}

function TextArea({ value, onChange, placeholder, rows = 3, error }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      aria-invalid={!!error}
      className={`field-textarea ${error ? 'border-red-400 focus:ring-red-400 bg-red-50/30' : ''}`}
    />
  )
}

function Toggle({ checked, onChange, label, sub, id }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="pr-4">
        <p className="text-sm font-medium text-gray-800" id={id}>{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
        className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                    ${checked ? 'bg-primary-600' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow
                          transition-transform duration-200 ml-1
                          ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Your Details
// ─────────────────────────────────────────────────────────────────────────────
function Step1({ data, set, errors }) {
  return (
    <div>
      <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">Your Details</h3>
      <p className="text-sm text-gray-500 mb-6">Tell us a bit about yourself so we can get in touch.</p>

      <FieldWrap label="Full Name" required error={errors.guestName}>
        <TextInput
          value={data.guestName}
          onChange={e => set('guestName', e.target.value)}
          placeholder="e.g. Sarah van der Berg"
          autoComplete="name"
          error={errors.guestName}
        />
      </FieldWrap>

      <FieldWrap label="Email Address" required error={errors.guestEmail}>
        <TextInput
          type="email"
          value={data.guestEmail}
          onChange={e => set('guestEmail', e.target.value)}
          placeholder="sarah@email.com"
          autoComplete="email"
          error={errors.guestEmail}
        />
      </FieldWrap>

      <FieldWrap label="Phone / WhatsApp" error={errors.guestPhone} hint="We'll use this to confirm your booking quickly.">
        <TextInput
          type="tel"
          value={data.guestPhone}
          onChange={e => set('guestPhone', e.target.value)}
          placeholder="+27 82 123 4567"
          autoComplete="tel"
          inputMode="tel"
          error={errors.guestPhone}
        />
      </FieldWrap>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Dates & Home
// ─────────────────────────────────────────────────────────────────────────────
function Step2({ data, set, errors }) {
  const todayStr = new Date().toISOString().split('T')[0]
  return (
    <div>
      <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">Dates & Home</h3>
      <p className="text-sm text-gray-500 mb-6">When do you need us and where?</p>

      <FieldWrap label="Check-in Date" required error={errors.dateFrom}>
        <TextInput
          type="date"
          value={data.dateFrom}
          onChange={e => set('dateFrom', e.target.value)}
          error={errors.dateFrom}
        />
      </FieldWrap>

      <FieldWrap label="Check-out Date" required error={errors.dateTo}>
        <input
          type="date"
          value={data.dateTo}
          onChange={e => set('dateTo', e.target.value)}
          min={data.dateFrom || todayStr}
          aria-invalid={!!errors.dateTo}
          className={`field-input ${errors.dateTo ? 'border-red-400 focus:ring-red-400' : ''}`}
        />
      </FieldWrap>

      <FieldWrap label="Property Address" required error={errors.address}>
        <TextInput
          value={data.address}
          onChange={e => set('address', e.target.value)}
          placeholder="123 Beach Rd, Gonubie, East London"
          autoComplete="street-address"
          error={errors.address}
        />
      </FieldWrap>

      <FieldWrap label="Special Instructions" hint="Alarm settings, general preferences, anything we should know upfront.">
        <TextArea
          value={data.specialInstructions}
          onChange={e => set('specialInstructions', e.target.value)}
          placeholder="e.g. Please don't use the front door after 10pm — alarm is sensitive."
          rows={3}
        />
      </FieldWrap>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Pets
// ─────────────────────────────────────────────────────────────────────────────
function PetCard({ pet, idx, total, onChange, onRemove }) {
  const f = (key) => (e) => onChange(idx, key, e.target.value)
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Pet {idx + 1}</span>
        {total > 1 && (
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="text-xs text-red-400 hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
          >
            Remove
          </button>
        )}
      </div>

      {/* FIXED: stacked layout, one input per row */}
      <div>
        <label className="field-label text-xs">Animal Type</label>
        <input className="field-input text-sm" placeholder="e.g. Dog, Cat, Bird" value={pet.type} onChange={f('type')} />
      </div>
      <div>
        <label className="field-label text-xs">Pet's Name</label>
        <input className="field-input text-sm" placeholder="e.g. Max" value={pet.name} onChange={f('name')} />
      </div>
      <div>
        <label className="field-label text-xs">Feeding Schedule & Amount</label>
        <input className="field-input text-sm" placeholder="e.g. 1 cup dry food at 7am and 6pm" value={pet.feeding} onChange={f('feeding')} />
      </div>
      <div>
        <label className="field-label text-xs">Medication</label>
        <input className="field-input text-sm" placeholder="None — or describe (e.g. 1 tablet with evening meal)" value={pet.medication} onChange={f('medication')} />
      </div>
      <div>
        <label className="field-label text-xs">Personality & Temperament</label>
        <input className="field-input text-sm" placeholder="e.g. Friendly, loves cuddles, scared of loud noises" value={pet.personality} onChange={f('personality')} />
      </div>
      <div>
        <label className="field-label text-xs">Additional Notes</label>
        <textarea className="field-textarea text-sm" rows={2} placeholder="Sleeping spot, walk schedule, favourite toys…" value={pet.notes} onChange={f('notes')} />
      </div>
    </div>
  )
}

function Step3({ data, set, setPet, addPet, removePet }) {
  return (
    <div>
      <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">Your Pets</h3>
      <p className="text-sm text-gray-500 mb-5">We love caring for animals! If you have pets, tell us a bit about them.</p>

      <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 mb-5">
        <Toggle
          id="hasPets-toggle"
          checked={data.hasPets}
          onChange={v => set('hasPets', v)}
          label="Do you have pets staying at home?"
          sub="Toggle on to add your pet details"
        />
      </div>

      {data.hasPets && (
        <div className="space-y-4">
          {data.pets.map((pet, idx) => (
            <PetCard
              key={idx}
              pet={pet}
              idx={idx}
              total={data.pets.length}
              onChange={setPet}
              onRemove={removePet}
            />
          ))}
          <button
            type="button"
            onClick={addPet}
            className="w-full border-2 border-dashed border-gray-200 hover:border-primary-400 hover:text-primary-600
                       text-gray-400 text-sm font-medium rounded-xl py-3 transition-all
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            + Add Another Pet
          </button>
        </div>
      )}

      {!data.hasPets && (
        <div className="text-center py-6 text-gray-400 text-sm italic">
          No pets — great! Click Continue to move on.
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — Home Access & Preferences
// ─────────────────────────────────────────────────────────────────────────────
function Step4({ data, set }) {
  return (
    <div>
      <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">Home Access & Preferences</h3>
      <p className="text-sm text-gray-500 mb-6">Help us care for your home exactly the way you want.</p>

      {/* Access */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-800 mb-3">🔑 Access Details</p>
        <FieldWrap label="How to access the property" hint="Gate codes, alarm instructions, where keys will be left, etc.">
          <TextArea
            value={data.accessInstructions}
            onChange={e => set('accessInstructions', e.target.value)}
            placeholder="e.g. Key is in a lockbox above the gate. Code: 1234. Alarm code: 5678 — disarm within 30 seconds."
            rows={3}
          />
        </FieldWrap>

        {/* FIXED: keys inventory → textarea */}
        <FieldWrap label="Keys & Remotes Being Handed Over" hint="List each item on a new line.">
          <TextArea
            value={data.keysInventory}
            onChange={e => set('keysInventory', e.target.value)}
            placeholder={"1x front door key\n1x garage remote\n1x gate remote\n1x pool room key"}
            rows={4}
          />
        </FieldWrap>
      </div>

      {/* Security */}
      <div className="mb-5 bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-800">🔒 Security Details</p>
        <FieldWrap label="Security Company">
          <TextInput
            value={data.securityCompany}
            onChange={e => set('securityCompany', e.target.value)}
            placeholder="e.g. ADT, Chubb, Response"
          />
        </FieldWrap>
        <FieldWrap label="Security Contact Number">
          <TextInput
            type="tel"
            value={data.securityContact}
            onChange={e => set('securityContact', e.target.value)}
            placeholder="+27 86 123 4567"
            inputMode="tel"
          />
        </FieldWrap>
      </div>

      {/* Emergency contact */}
      <div className="mb-5 bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-800">🚨 Emergency Contact</p>
        <FieldWrap label="Contact Name">
          <TextInput value={data.emergencyName} onChange={e => set('emergencyName', e.target.value)} placeholder="Full name" autoComplete="name" />
        </FieldWrap>
        <FieldWrap label="Contact Phone">
          <TextInput type="tel" value={data.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} placeholder="+27 82 123 4567" inputMode="tel" />
        </FieldWrap>
        <FieldWrap label="Relationship to You">
          <TextInput value={data.emergencyRelation} onChange={e => set('emergencyRelation', e.target.value)} placeholder="e.g. Husband, Sister, Neighbour" />
        </FieldWrap>
      </div>

      {/* Household tasks */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-800 mb-3">🏡 Household Tasks</p>
        <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 divide-y divide-gray-100">
          <Toggle id="plants-toggle" checked={data.hasPlants} onChange={v => set('hasPlants', v)} label="🌿 Plants need watering?" sub="We'll follow your instructions" />
          <Toggle id="pool-toggle"   checked={data.hasPool}   onChange={v => set('hasPool',   v)} label="🏊 Pool maintenance required?" sub="Let us know the routine" />
        </div>
        <div className="mt-3">
          <FieldWrap label="🗑️ Rubbish / Bin Day" hint="e.g. Wednesdays — black bin to the pavement by 7am">
            <TextInput value={data.rubbishDay} onChange={e => set('rubbishDay', e.target.value)} placeholder="Day and any special instructions" />
          </FieldWrap>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">⚙️ Preferences</p>
        <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 divide-y divide-gray-100">
          <Toggle id="wifi-toggle"    checked={data.wifi}         onChange={v => set('wifi',         v)} label="📶 WiFi access for us?" sub="We're both online students — much appreciated!" />
          <Toggle id="updates-toggle" checked={data.dailyUpdates} onChange={v => set('dailyUpdates', v)} label="📸 Daily photo updates?" sub="We'll send an update each evening so you can relax" />
        </div>
        {data.wifi && (
          <div className="mt-3">
            <FieldWrap label="WiFi Password">
              <TextInput value={data.wifiPassword} onChange={e => set('wifiPassword', e.target.value)} placeholder="Network password" autoComplete="off" />
            </FieldWrap>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 5 — Review & Confirm
// ─────────────────────────────────────────────────────────────────────────────
function Step5({ data, error }) {
  const rows = [
    ['Name',          data.guestName],
    ['Email',         data.guestEmail],
    ['Phone',         data.guestPhone || '—'],
    ['Check-in',      data.dateFrom],
    ['Check-out',     data.dateTo],
    ['Address',       data.address],
    ['Pets',          data.hasPets ? (data.pets.filter(p=>p.name).map(p=>`${p.name} (${p.type})`).join(', ') || 'Yes') : 'None'],
    ['WiFi',          data.wifi ? 'Yes — password provided' : 'Not required'],
    ['Daily Updates', data.dailyUpdates ? 'Yes please' : 'No thanks'],
    ['Emergency',     data.emergencyName ? `${data.emergencyName} · ${data.emergencyPhone}` : '—'],
    ['Security Co.',  data.securityCompany || '—'],
  ]

  return (
    <div>
      <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">Review & Confirm</h3>
      <p className="text-sm text-gray-500 mb-5">Please check your details before submitting.</p>

      <div className="rounded-xl border border-gray-100 overflow-hidden mb-5">
        {rows.map(([k, v], i) => (
          <div key={k} className={`flex justify-between text-sm px-4 py-2.5 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <span className="text-gray-500 font-medium min-w-[110px]">{k}</span>
            <span className="text-gray-900 text-right ml-4 break-words max-w-[55%]">{v || '—'}</span>
          </div>
        ))}
      </div>

      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-xs text-primary-800 leading-relaxed mb-4">
        By submitting this request you confirm that the above information is accurate. We'll review it and respond within 24 hours via email or WhatsApp.
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 flex items-start gap-2" role="alert">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Modal
// ─────────────────────────────────────────────────────────────────────────────
export default function BookingModal({ isOpen, onClose, initialDates = {} }) {
  const [step,    setStep]    = useState(1)
  const [data,    setData]    = useState({ ...INIT })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  // Pre-fill dates from calendar selection
  useEffect(() => {
    if (initialDates?.dateFrom) {
      setData(d => ({ ...d, dateFrom: initialDates.dateFrom || '', dateTo: initialDates.dateTo || '' }))
    }
  }, [initialDates])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
      setStep(1); setSuccess(false); setApiError(''); setErrors({})
    } else {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // ── State updaters (stable refs — no remount issue) ──
  const set = useCallback((key, val) => setData(d => ({ ...d, [key]: val })), [])

  const setPet = useCallback((idx, key, val) => {
    setData(d => {
      const pets = d.pets.map((p, i) => i === idx ? { ...p, [key]: val } : p)
      return { ...d, pets }
    })
  }, [])

  const addPet    = useCallback(() => setData(d => ({ ...d, pets: [...d.pets, { ...EMPTY_PET }] })), [])
  const removePet = useCallback((idx) => setData(d => ({ ...d, pets: d.pets.filter((_, i) => i !== idx) })), [])

  // ── Per-step validation ──
  const validate = (s) => {
    const e = {}
    if (s === 1) {
      if (!data.guestName.trim())  e.guestName  = 'Please enter your full name.'
      if (!data.guestEmail.trim()) e.guestEmail = 'Please enter your email address.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guestEmail)) e.guestEmail = 'Please enter a valid email address.'
    }
    if (s === 2) {
      if (!data.dateFrom) e.dateFrom = 'Please select a check-in date.'
      if (!data.dateTo)   e.dateTo   = 'Please select a check-out date.'
      else if (data.dateFrom && data.dateTo < data.dateFrom) e.dateTo = 'Check-out must be after check-in.'
      if (!data.address.trim()) e.address = 'Please enter the property address.'
    }
    return e
  }

  const handleNext = () => {
    const e = validate(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(s => s + 1)
  }

  const handleBack = () => { setErrors({}); setStep(s => s - 1) }

  const handleSubmit = async () => {
    setLoading(true); setApiError('')
    try {
      await axios.post('/api/bookings', data)
      setSuccess(true)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Please try again or contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  // ── Progress bar ──
  const ProgressBar = () => (
    <div className="flex gap-1.5 mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Step ${step} of ${STEPS.length}: ${STEPS[step-1].label}`}>
      {STEPS.map(s => (
        <div
          key={s.id}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            s.id < step ? 'bg-primary-400' : s.id === step ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )

  // ── Success state ──
  if (success) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full text-center shadow-xl">
        <div className="text-5xl mb-4" aria-hidden="true">✅</div>
        <h3 id="success-title" className="font-heading text-2xl font-bold text-gray-900 mb-2">Booking Request Sent!</h3>
        <p className="text-gray-500 text-sm mb-6">
          Thank you! We'll review your details and confirm within 24 hours via email or WhatsApp.
        </p>
        <button onClick={onClose} className="btn-primary w-full">Done</button>
      </div>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* FIXED: single-column layout always — no sidebar */}
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 id="booking-modal-title" className="font-heading font-bold text-gray-900 text-xl">Book Your House Sitting</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Step {step} of {STEPS.length} — {STEPS[step - 1].label}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking form"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors ml-4 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ProgressBar />

          {step === 1 && <Step1 data={data} set={set} errors={errors} />}
          {step === 2 && <Step2 data={data} set={set} errors={errors} />}
          {step === 3 && <Step3 data={data} set={set} setPet={setPet} addPet={addPet} removePet={removePet} />}
          {step === 4 && <Step4 data={data} set={set} />}
          {step === 5 && <Step5 data={data} error={apiError} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0">
          <button
            onClick={step > 1 ? handleBack : onClose}
            className="btn-ghost px-5 py-2.5 text-sm"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>

          <div className="flex items-center gap-3">
            {step < STEPS.length ? (
              <button
                onClick={handleNext}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`btn-primary px-6 py-2.5 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </span>
                ) : '✓ Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
