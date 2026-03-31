import { useState, useEffect } from "react";
import axios from "axios";

const STEPS = [
  { id: 1, label: "Booking Details" },
  { id: 2, label: "Pets" },
  { id: 3, label: "Access & Security" },
  { id: 4, label: "Emergency & Tasks" },
  { id: 5, label: "Preferences" },
  { id: 6, label: "Review & Confirm" },
];

const EMPTY_PET = {
  type: "",
  name: "",
  foodAmount: "",
  feedingTimes: "",
  medication: "",
  personality: "",
  notes: "",
};

const initData = {
  // Step 1
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  dateFrom: "",
  dateTo: "",
  address: "",
  specialInstructions: "",
  // Step 2
  hasPets: false,
  pets: [{ ...EMPTY_PET }],
  // Step 3
  accessInstructions: "",
  keysInventory: "",
  securityCompany: "",
  securityContact: "",
  panicButtonLocation: "",
  // Step 4
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",
  hasPlants: false,
  hasPool: false,
  rubbishDay: "",
  householdNotes: "",
  // Step 5
  wifi: false,
  wifiPassword: "",
  dailyUpdates: false,
};

function Toggle({ checked, onChange, label, sub }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`toggle-track w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
                    ${checked ? "bg-primary-600" : "bg-gray-200"}`}
      >
        <span
          className={`toggle-thumb ml-1 block w-4 h-4 rounded-full bg-white shadow
                         transition-transform duration-200
                         ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

export default function BookingModal({ isOpen, onClose, initialDates = {} }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ ...initData });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill dates if coming from calendar
  useEffect(() => {
    if (initialDates?.dateFrom)
      setData((d) => ({
        ...d,
        dateFrom: initialDates.dateFrom || "",
        dateTo: initialDates.dateTo || "",
      }));
  }, [initialDates]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      setStep(1);
      setSuccess(false);
      setError("");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const setPet = (idx, key, val) => {
    const pets = [...data.pets];
    pets[idx] = { ...pets[idx], [key]: val };
    setData((d) => ({ ...d, pets }));
  };

  const addPet = () =>
    setData((d) => ({ ...d, pets: [...d.pets, { ...EMPTY_PET }] }));
  const removePet = (idx) => {
    if (data.pets.length === 1) return;
    setData((d) => ({ ...d, pets: d.pets.filter((_, i) => i !== idx) }));
  };

  const canNext = () => {
    if (step === 1)
      return (
        data.guestName &&
        data.guestEmail &&
        data.dateFrom &&
        data.dateTo &&
        data.address
      );
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/bookings", data);
      setSuccess(true);
    } catch (e) {
      setError(
        e.response?.data?.error || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Steps content ──────────────────────────────────────────────────────
  const StepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">
              Booking Details
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Please provide as much information as possible.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field label="Your Full Name *">
                <input
                  className="field-input"
                  placeholder="e.g. Sarah van der Berg"
                  value={data.guestName}
                  onChange={(e) => set("guestName", e.target.value)}
                />
              </Field>
              <Field label="Email Address *">
                <input
                  className="field-input"
                  type="email"
                  placeholder="sarah@email.com"
                  value={data.guestEmail}
                  onChange={(e) => set("guestEmail", e.target.value)}
                />
              </Field>
              <Field label="Phone / WhatsApp">
                <input
                  className="field-input"
                  placeholder="+27 82 123 4567"
                  value={data.guestPhone}
                  onChange={(e) => set("guestPhone", e.target.value)}
                />
              </Field>
              <div /> {/* spacer */}
              <Field label="Start Date *">
                <input
                  className="field-input"
                  type="date"
                  value={data.dateFrom}
                  onChange={(e) => set("dateFrom", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </Field>
              <Field label="End Date *">
                <input
                  className="field-input"
                  type="date"
                  value={data.dateTo}
                  onChange={(e) => set("dateTo", e.target.value)}
                  min={data.dateFrom || new Date().toISOString().split("T")[0]}
                />
              </Field>
            </div>
            <Field label="Property Address *">
              <input
                className="field-input"
                placeholder="123 Beach Rd, Gonubie, East London"
                value={data.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </Field>
            <Field label="Special Instructions">
              <textarea
                className="field-textarea"
                rows={3}
                placeholder="Any specific requirements or things we should know…"
                value={data.specialInstructions}
                onChange={(e) => set("specialInstructions", e.target.value)}
              />
            </Field>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">
              Your Pets
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              We love taking care of furry friends!
            </p>

            <Toggle
              checked={data.hasPets}
              onChange={(v) => set("hasPets", v)}
              label="Do you have pets?"
              sub="We love taking care of furry friends!"
            />

            {data.hasPets && (
              <div className="mt-5 space-y-5">
                {data.pets.map((pet, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Pet {idx + 1}
                      </span>
                      {data.pets.length > 1 && (
                        <button
                          onClick={() => removePet(idx)}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ["Type", "type", "e.g. Dog, Cat"],
                        ["Name", "name", "e.g. Max"],
                        ["Food Amount", "foodAmount", "e.g. 1 cup"],
                        ["Feeding Times", "feedingTimes", "e.g. 7am & 6pm"],
                        ["Medication", "medication", "None / describe"],
                        ["Personality", "personality", "Friendly / Shy / etc"],
                      ].map(([label, key, ph]) => (
                        <div key={key}>
                          <label className="field-label text-xs">{label}</label>
                          <input
                            className="field-input text-sm"
                            placeholder={ph}
                            value={pet[key]}
                            onChange={(e) => setPet(idx, key, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <label className="field-label text-xs">
                        Additional Notes
                      </label>
                      <input
                        className="field-input text-sm"
                        placeholder="Sleeping spot, walk schedule, likes/dislikes…"
                        value={pet.notes}
                        onChange={(e) => setPet(idx, "notes", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPet}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-primary-400 hover:text-primary-600
                           text-gray-400 text-sm font-medium rounded-xl py-3 transition-all"
                >
                  + Add Another Pet
                </button>
              </div>
            )}

            {!data.hasPets && (
              <p className="text-sm text-gray-400 mt-4 italic">
                No pets — great! Move on to the next step.
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">
              Access & Security
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Help us access and secure your home correctly.
            </p>

            <Field label="Access Instructions">
              <textarea
                className="field-textarea"
                rows={3}
                placeholder="Where to find keys, gate codes, alarm codes, etc."
                value={data.accessInstructions}
                onChange={(e) => set("accessInstructions", e.target.value)}
              />
            </Field>
            <Field label="Keys & Remotes Inventory">
              <input
                className="field-input"
                placeholder="List all keys and remotes you'll need (e.g. front door, garage remote, gate remote)"
                value={data.keysInventory}
                onChange={(e) => set("keysInventory", e.target.value)}
              />
            </Field>

            <div className="mt-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Security Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Security Company">
                  <input
                    className="field-input"
                    placeholder="Company name (e.g. ADT, Chubb)"
                    value={data.securityCompany}
                    onChange={(e) => set("securityCompany", e.target.value)}
                  />
                </Field>
                <Field label="Security Contact">
                  <input
                    className="field-input"
                    placeholder="Contact number"
                    value={data.securityContact}
                    onChange={(e) => set("securityContact", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Panic Button Location">
                <input
                  className="field-input"
                  placeholder="e.g. Bedroom bedside table, right side"
                  value={data.panicButtonLocation}
                  onChange={(e) => set("panicButtonLocation", e.target.value)}
                />
              </Field>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">
              Emergency Contact & Household Tasks
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Who should we contact in an emergency?
            </p>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Emergency Contact
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Contact Name">
                  <input
                    className="field-input"
                    placeholder="Full name"
                    value={data.emergencyName}
                    onChange={(e) => set("emergencyName", e.target.value)}
                  />
                </Field>
                <Field label="Contact Phone">
                  <input
                    className="field-input"
                    placeholder="Phone number"
                    value={data.emergencyPhone}
                    onChange={(e) => set("emergencyPhone", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Relationship to You">
                <input
                  className="field-input"
                  placeholder="e.g. Husband, Sister, Neighbour"
                  value={data.emergencyRelation}
                  onChange={(e) => set("emergencyRelation", e.target.value)}
                />
              </Field>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Household Tasks
              </p>
              <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100 px-4">
                <Toggle
                  checked={data.hasPlants}
                  onChange={(v) => set("hasPlants", v)}
                  label="🌿 Plants to water?"
                  sub="Let us know watering frequency & amounts"
                />
                <Toggle
                  checked={data.hasPool}
                  onChange={(v) => set("hasPool", v)}
                  label="🏊 Pool maintenance?"
                  sub="Any specific chemicals or routine?"
                />
              </div>
            </div>

            <Field label="🗑️ Rubbish / Bin Day">
              <input
                className="field-input"
                placeholder="Plants to water, pool maintenance, rubbish collection days, etc."
                value={data.rubbishDay}
                onChange={(e) => set("rubbishDay", e.target.value)}
              />
            </Field>

            <Field label="Additional Household Notes">
              <textarea
                className="field-textarea"
                rows={2}
                placeholder="Any other household tasks or maintenance notes…"
                value={data.householdNotes}
                onChange={(e) => set("householdNotes", e.target.value)}
              />
            </Field>
          </div>
        );

      case 5:
        return (
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">
              Preferences
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Just a couple more preferences before we confirm.
            </p>

            <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100 px-4">
              <Toggle
                checked={data.wifi}
                onChange={(v) => set("wifi", v)}
                label="📶 WiFi Permission"
                sub="Can we use your WiFi during our stay? (We're both studying online)"
              />
              <Toggle
                checked={data.dailyUpdates}
                onChange={(v) => set("dailyUpdates", v)}
                label="📸 Daily Updates"
                sub="Receive daily photos and updates so you can see all is well"
              />
            </div>

            {data.wifi && (
              <div className="mt-4">
                <Field label="WiFi Password">
                  <input
                    className="field-input"
                    placeholder="Your WiFi password"
                    value={data.wifiPassword}
                    onChange={(e) => set("wifiPassword", e.target.value)}
                  />
                </Field>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">
              Review & Confirm
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Please review your booking details.
            </p>

            <div className="space-y-3">
              {[
                ["Guest", `${data.guestName} · ${data.guestEmail}`],
                ["Dates", `${data.dateFrom} → ${data.dateTo}`],
                ["Address", data.address],
                [
                  "Pets",
                  data.hasPets
                    ? data.pets
                        .filter((p) => p.name)
                        .map((p) => `${p.name} (${p.type})`)
                        .join(", ") || "Yes (see details)"
                    : "None",
                ],
                ["WiFi", data.wifi ? "Permitted" : "Not required"],
                [
                  "Daily Updates",
                  data.dailyUpdates
                    ? "Yes — photo updates each evening"
                    : "Not required",
                ],
                [
                  "Emergency",
                  data.emergencyName
                    ? `${data.emergencyName} · ${data.emergencyPhone}`
                    : "—",
                ],
                ["Security", data.securityCompany || "—"],
              ].map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-500 font-medium w-1/3">{key}</span>
                  <span className="text-gray-800 w-2/3 text-right">
                    {val || "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-primary-50 border border-primary-100 rounded-xl p-4 text-xs text-primary-800 leading-relaxed">
              By confirming, you agree that the above details are accurate.
              We'll review your request and confirm within 24 hours via email or
              WhatsApp.
            </div>

            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
                {error}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────
  if (success)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-xl">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            Booking Request Sent!
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Thanks! We'll review your request and confirm within 24 hours via
            email or WhatsApp.
          </p>
          <button onClick={onClose} className="btn-primary w-full">
            Done
          </button>
        </div>
      </div>
    );

  // ── Modal ──────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-heading font-bold text-gray-900 text-xl">
              Book Your House Sitting
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Fill in the details so we can take the best care of your home
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Body: sidebar + content — matches wireframe layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Step sidebar */}
          <div className="hidden sm:flex flex-col w-44 bg-gray-50 border-r border-gray-100 p-4 gap-1 flex-shrink-0">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => s.id < step && setStep(s.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                  ${
                    step === s.id
                      ? "bg-primary-600 text-white shadow-sm"
                      : s.id < step
                        ? "text-primary-700 hover:bg-primary-50 cursor-pointer"
                        : "text-gray-400 cursor-default"
                  }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] mr-2
                  ${step === s.id ? "bg-white/25 text-white" : s.id < step ? "bg-primary-100 text-primary-700" : "bg-gray-200 text-gray-400"}`}
                >
                  {s.id < step ? "✓" : s.id}
                </span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-7">
            {/* Mobile step indicator */}
            <div className="flex gap-1.5 mb-5 sm:hidden">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`h-1.5 flex-1 rounded-full transition-all
                  ${s.id < step ? "bg-primary-400" : s.id === step ? "bg-primary-600" : "bg-gray-200"}`}
                />
              ))}
            </div>

            <StepContent />
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => (step > 1 ? setStep((s) => s - 1) : onClose())}
            className="btn-ghost px-5 py-2.5"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">
              Step {step} of {STEPS.length}
            </span>
            {step < STEPS.length ? (
              <button
                onClick={() => canNext() && setStep((s) => s + 1)}
                disabled={!canNext()}
                className={`btn-primary px-6 py-2.5 ${!canNext() ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary px-6 py-2.5"
              >
                {loading ? "Submitting…" : "✓ Confirm Booking Request"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
