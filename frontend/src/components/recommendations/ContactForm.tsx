import React, { useState } from 'react';

interface ContactFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interested: '',
    type_of_mutual_fund: '',
    amount: '',
    final_amount: '',
    kyc_completed: false,
    final_disbursed_amt: '',
  });

const handleSubmit = async () => {
  setLoading(true);

  const formattedData = {
    ...formData,
    interested: formData.interested === 'yes' ? 'yes' : 'no',
    type_of_mutual_fund: formData.interested === 'yes' ? formData.type_of_mutual_fund : null,
    amount: formData.interested === 'yes' ? +formData.amount || 0 : null,
    final_amount: formData.interested === 'yes' ? +formData.final_amount || 0 : null,
    final_disbursed_amt: formData.interested === 'yes' ? +formData.final_disbursed_amt || 0 : null,
    kyc_completed: formData.interested === 'yes' ? formData.kyc_completed : false
  };

  try {
    await onSubmit(formattedData);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md text-white shadow-2xl border border-gray-700 space-y-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Contact Form</h2>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
        {/* Step 1 */}
        <div className="flex items-center">
            <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'}`}
            >
            1
            </div>
        </div>

        {/* Line */}
        <div className="w-10 h-1 bg-gray-500 mx-2">
            <div className={`h-1 ${step >= 2 ? 'bg-blue-500' : ''}`} style={{ width: '100%' }} />
        </div>

        {/* Step 2 */}
        <div className="flex items-center">
            <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'}`}
            >
            2
            </div>
        </div>
        </div>

        {/* Step 1: Interested */}
        {step === 1 && (
          <>
            <p className="text-sm font-medium mb-2">Is the customer interested?</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="interested"
                  value="yes"
                  checked={formData.interested === 'yes'}
                  onChange={(e) => setFormData({ ...formData, interested: e.target.value })}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="interested"
                  value="no"
                  checked={formData.interested === 'no'}
                  onChange={(e) => setFormData({ ...formData, interested: e.target.value })}
                />
                No
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              {formData.interested === 'yes' && (
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                  onClick={() => setStep(2)}
                >
                  Continue
                </button>
              )}
              {formData.interested === 'no' && (
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <>
            <select
              className="w-full p-2 rounded bg-slate-800 text-white"
              value={formData.type_of_mutual_fund}
              onChange={(e) => setFormData({ ...formData, type_of_mutual_fund: e.target.value })}
            >
              <option value="">Select Mutual Fund Type</option>
              <option value="SIP">SIP</option>
              <option value="annually">Annually</option>
              <option value="biannually">Biannually</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              className="w-full p-2 rounded bg-slate-800 text-white"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />

            <input
              type="number"
              placeholder="Final Amount (≤ Amount)"
              className="w-full p-2 rounded bg-slate-800 text-white"
              value={formData.final_amount}
              onChange={(e) => {
                const val = e.target.value;
                if (+val <= +formData.amount) {
                  setFormData({ ...formData, final_amount: val });
                }
              }}
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.kyc_completed}
                onChange={(e) => setFormData({ ...formData, kyc_completed: e.target.checked })}
              />
              KYC Completed
            </label>

            <input
              type="number"
              placeholder="Final Disbursed Amount (≤ Final Amount)"
              className="w-full p-2 rounded bg-slate-800 text-white"
              value={formData.final_disbursed_amt}
              onChange={(e) => {
                const val = e.target.value;
                if (+val <= +formData.final_amount) {
                  setFormData({ ...formData, final_disbursed_amt: val });
                }
              }}
            />

            <div className="flex justify-between gap-3 pt-4">
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
