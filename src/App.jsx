import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Select } from './components/ui/select'
import { submitOnboardingForm, testConnection } from './services/api'
import { createClickUpTask } from './services/clickup'
import { CLICKUP_API_TOKEN } from './config/clickup'
import './App.css'

const transactionTypes = [
  {
    label: "Automotive",
    options: [
      "866 - Production Sequence",
      "867 - Product Transfer and Resale Report",
      "869 - Order Status Inquiry",
      "870 - Order Status Report",
      "242 - Data Status Tracking",
      "848 - Material Safety Data Sheet",
      "OTHER - Other (Please Specify)"
    ]
  },
  {
    label: "Finance & Banking",
    options: [
      "820 - Payment Order/Remittance Advice",
      "821 - Financial Information Reporting",
      "822 - Customer Account Analysis",
      "823 - Lockbox",
      "824 - Application Advice",
      "826 - Tax Information Exchange",
      "OTHER - Other (Please Specify)"
    ]
  },
  {
    label: "Government",
    options: [
      "838 - Trading Partner Profile",
      "839 - Project Cost Reporting",
      "840 - Request for Quotation",
      "841 - Specifications/Technical Information",
      "843 - Response to Request for Quotation",
      "OTHER - Other (Please Specify)"
    ]
  },
  {
    label: "Grocery & Food Service",
    options: [
      "875 - Grocery Products Invoice",
      "876 - Grocery Products Purchase Order",
      "877 - Manufacturer Coupon Family Code Structure",
      "878 - Product Authorization/De-authorization",
      "879 - Price Information",
      "880 - Grocery Products Item Maintenance",
      "OTHER - Other (Please Specify)"
    ]
  },
  {
    label: "Healthcare",
    options: [
      "270 - Eligibility Inquiry",
      "271 - Eligibility Response",
      "276 - Claim Status Inquiry",
      "277 - Claim Status Response",
      "278 - Health Care Services Review",
      "834 - Benefit Enrollment and Maintenance",
      "835 - Healthcare Claim Payment/Advice",
      "837 - Healthcare Claim",
      "820 - Payment Order/Remittance Advice",
      "OTHER - Other (Please Specify)"
    ]
  },
  {
    label: "Manufacturing",
    options: [
      "830 - Planning Schedule with Release Capability",
      "862 - Shipping Schedule",
      "865 - Purchase Order Change Acknowledgment",
      "940 - Warehouse Shipping Order",
      "943 - Warehouse Stock Transfer Shipment Advice",
      "944 - Warehouse Stock Transfer Receipt Advice",
      "945 - Warehouse Shipping Advice",
      "947 - Warehouse Inventory Adjustment Advice",
      "OTHER - Other (Please Specify)"
    ]
  },
  {
    label: "Retail & Consumer Goods",
    options: [
      "810 - Invoice",
      "850 - Purchase Order",
      "855 - Purchase Order Acknowledgment",
      "856 - Advance Ship Notice (ASN)",
      "860 - Purchase Order Change",
      "846 - Inventory Inquiry/Advice",
      "832 - Price/Sales Catalog",
      "852 - Product Activity Data",
      "753 - Request for Routing Instructions",
      "754 - Routing Instructions",
      "OTHER - Other (Please Specify)"
    ]
  },
  {
    label: "Transportation & Logistics",
    options: [
      "204 - Motor Carrier Load Tender",
      "210 - Freight Details and Invoice",
      "211 - Motor Carrier Bill of Lading",
      "214 - Transportation Carrier Shipment Status",
      "990 - Response to a Load Tender",
      "300 - Reservation (Booking Request)",
      "301 - Confirmation (Ocean)",
      "310 - Freight Receipt and Invoice (Ocean)",
      "322 - Terminal Operations Activity",
      "315 - Status Details (Ocean)",
      "OTHER - Other (Please Specify)"
    ]
  }
]

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [section1Data, setSection1Data] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    autoAccepted: ''
  })
  const [selectedTransactions, setSelectedTransactions] = useState([])
  const [currentTransaction, setCurrentTransaction] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSection1Change = (e) => {
    const { name, value } = e.target
    setSection1Data(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const isSection1Valid = () => {
    return section1Data.companyName.trim() !== '' &&
           section1Data.contactName.trim() !== '' &&
           section1Data.contactEmail.trim() !== '' &&
           section1Data.contactPhone.trim() !== '' &&
           section1Data.autoAccepted.trim() !== ''
  }

  const handleContinueToSection2 = () => {
    if (isSection1Valid()) {
      setCurrentStep(2)
    }
  }

  const handleEditSection1 = () => {
    setCurrentStep(1)
  }

  const handleAddTransaction = (e) => {
    const transactionType = e.target.value
    if (transactionType && !selectedTransactions.find(t => t.type === transactionType)) {
      setSelectedTransactions([...selectedTransactions, {
        type: transactionType,
        direction: '',
        frequency: '',
        requiredOptional: '',
        hasImplementationGuide: '',
        canProvideSamples: '',
        sampleFiles: [],
        hasMappingSpecs: '',
        hasSystemDocs: '',
        systemDocFiles: [],
        require997FromUs: '',
        willSend997: ''
      }])
    }
    e.target.value = ''
  }

  const handleRemoveTransaction = (index) => {
    setSelectedTransactions(selectedTransactions.filter((_, i) => i !== index))
  }

  const handleTransactionChange = (index, field, value) => {
    const updated = [...selectedTransactions]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedTransactions(updated)
  }

  const handleFileUpload = (index, fileType, files) => {
    const updated = [...selectedTransactions]
    const fileArray = Array.from(files)
    updated[index] = { ...updated[index], [fileType]: fileArray }
    setSelectedTransactions(updated)
  }

  const handleRemoveFile = (index, fileType, fileIndex) => {
    const updated = [...selectedTransactions]
    const currentFiles = [...updated[index][fileType]]
    currentFiles.splice(fileIndex, 1)
    updated[index] = { ...updated[index], [fileType]: currentFiles }
    setSelectedTransactions(updated)
  }

  const handleSubmit = async () => {
    // Reset error and success states
    setSubmitError(null)
    setSubmitSuccess(false)
    
    setIsSubmitting(true)
    
    try {
      // Prepare form data
      const formData = {
        section1Data,
        selectedTransactions
      }
      
      console.log('Submitting form data:', formData)
      
      // Submit to main API (with authentication)
      const apiResponse = await submitOnboardingForm(formData)
      
      if (apiResponse.success) {
        console.log('API submission successful:', apiResponse.data)
      } else {
        console.warn('API submission failed:', apiResponse.error)
      }
      
      // Create task in ClickUp (token is integrated)
      let clickupResponse = null
      if (CLICKUP_API_TOKEN) {
        try {
          clickupResponse = await createClickUpTask(formData, CLICKUP_API_TOKEN)
          console.log('ClickUp task created successfully:', clickupResponse)
        } catch (clickupError) {
          console.warn('ClickUp integration failed:', clickupError.message)
          // Continue even if ClickUp fails
        }
      }
      
      // Show success message
      setSubmitSuccess(true)
      
      let successMessage = '✅ Form submitted successfully!'
      if (apiResponse.success) {
        successMessage += '\n\n📤 Data sent to API'
      }
      if (clickupResponse) {
        successMessage += `\n\n📋 Task created in ClickUp: "${clickupResponse.name}"\nTask ID: ${clickupResponse.id}`
      }
      
      alert(successMessage)
      
      // Redirect to main page after successful submission
      setTimeout(() => {
        window.location.href = '/'
      }, 1000) // Small delay to ensure alert is read
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(error.message || 'Failed to submit form. Please try again.')
      alert(`❌ Error submitting form:\n\n${error.message}\n\nPlease check the console for more details.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div 
            className="relative text-center py-16 px-8 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://eradani.com/wp-content/uploads/2020/04/Eradani-Mastheads_1920_ServicesSupport.png)' }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <img 
                  src="https://eradani.com/wp-content/uploads/2020/04/Eradani-Logo_2.75_Full-Color_Outlines.png" 
                  alt="Eradani company logo with blue text and gray curved accent representing IBM i modernization solutions" 
                  className="h-16 w-auto drop-shadow-lg"
                  loading="lazy"
                />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                EDI Vendor Onboarding Form
              </h1>
              <p className="text-xl text-white drop-shadow-md">Complete EDI Transaction Setup</p>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {/* Section 1 */}
              <div className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Section 1: Company and Contact Information
                  </h2>
                  {currentStep === 2 && (
                    <span className="text-green-500 text-2xl">✓</span>
                  )}
                </div>
                {currentStep === 2 && (
                  <Button variant="link" onClick={handleEditSection1} className="text-sm">
                    Edit
                  </Button>
                )}
              </div>

              {currentStep === 1 ? (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                      name="companyName"
                      value={section1Data.companyName}
                      onChange={handleSection1Change}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name *
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        name="contactName"
                        value={section1Data.contactName}
                        onChange={handleSection1Change}
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email *
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="email"
                        name="contactEmail"
                        value={section1Data.contactEmail}
                        onChange={handleSection1Change}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="tel"
                      name="contactPhone"
                      value={section1Data.contactPhone}
                      onChange={handleSection1Change}
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Will this be auto accepted? *
                    </label>
                    <Select
                      name="autoAccepted"
                      value={section1Data.autoAccepted}
                      onChange={handleSection1Change}
                    >
                      <option value="">-- Select --</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Select>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleContinueToSection2}
                      disabled={!isSection1Valid()}
                    >
                      Continue to Transaction Details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-b-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Company:</span>
                      <p className="text-gray-900">{section1Data.companyName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Contact:</span>
                      <p className="text-gray-900">{section1Data.contactName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-900">{section1Data.contactEmail}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-900">{section1Data.contactPhone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Auto Accepted:</span>
                      <p className="text-gray-900">{section1Data.autoAccepted === 'yes' ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2 */}
            {currentStep === 2 && (
              <div className="border border-gray-200 rounded-lg">
                <div className="p-4 bg-gray-50 rounded-t-lg">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Section 2: EDI Transaction Types & Details
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Transaction Types *
                    </label>
                    <Select onChange={handleAddTransaction}>
                      <option value="">-- Select a transaction type to add --</option>
                      {transactionTypes.map((group, idx) => (
                        <optgroup key={idx} label={group.label}>
                          {group.options.map((option, optIdx) => (
                            <option key={optIdx} value={option}>
                              {option}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Select>
                  </div>

                  {selectedTransactions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        Selected Transaction Types:
                      </h3>

                      {selectedTransactions.map((transaction, index) => (
                        <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-blue-900">{transaction.type}</h4>
                            <button
                              type="button"
                              onClick={() => handleRemoveTransaction(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Direction *
                              </label>
                              <Select
                                value={transaction.direction}
                                onChange={(e) => handleTransactionChange(index, 'direction', e.target.value)}
                              >
                                <option value="">-- Select Direction --</option>
                                <option value="you-to-us">You send to us</option>
                                <option value="us-to-you">We send to you</option>
                                <option value="both">Both directions</option>
                              </Select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Frequency *
                              </label>
                              <Select
                                value={transaction.frequency}
                                onChange={(e) => handleTransactionChange(index, 'frequency', e.target.value)}
                              >
                                <option value="">-- Select Frequency --</option>
                                <option value="real-time">Real-time</option>
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="on-demand">On-demand</option>
                              </Select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Required or Optional? *
                              </label>
                              <Select
                                value={transaction.requiredOptional}
                                onChange={(e) => handleTransactionChange(index, 'requiredOptional', e.target.value)}
                              >
                                <option value="">-- Select --</option>
                                <option value="required">Required</option>
                                <option value="optional">Optional</option>
                              </Select>
                            </div>

                            <div className="border-t border-blue-300 pt-4 mt-4">
                              <h5 className="font-semibold text-gray-800 mb-3 text-sm">
                                Documentation & Samples:
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Do you have an EDI implementation guide for this transaction? *
                                  </label>
                                  <Select
                                    value={transaction.hasImplementationGuide}
                                    onChange={(e) => handleTransactionChange(index, 'hasImplementationGuide', e.target.value)}
                                  >
                                    <option value="">-- Select --</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Can you provide sample EDI files? *
                                  </label>
                                  <Select
                                    value={transaction.canProvideSamples}
                                    onChange={(e) => handleTransactionChange(index, 'canProvideSamples', e.target.value)}
                                  >
                                    <option value="">-- Select --</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Select>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Valid, invalid, and edge case examples if available
                                  </p>
                                  
                                  {transaction.canProvideSamples === 'yes' && (
                                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        📎 Upload Sample EDI Files
                                      </label>
                                      <p className="text-xs text-gray-600 mb-3">
                                        You can upload multiple files at once or add them one by one. Click "Choose Files" to browse and select your documents.
                                      </p>
                                      
                                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                        <input
                                          type="file"
                                          multiple
                                          accept=".edi,.txt,.xml,.csv,.pdf,.doc,.docx"
                                          onChange={(e) => handleFileUpload(index, 'sampleFiles', e.target.files)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                          💡 <strong>Tip:</strong> Hold Ctrl (or Cmd on Mac) to select multiple files at once
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Accepted formats: .edi, .txt, .xml, .csv, .pdf, .doc, .docx
                                        </p>
                                      </div>
                                      
                                      {transaction.sampleFiles && transaction.sampleFiles.length > 0 && (
                                        <div className="mt-4">
                                          <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-gray-700">
                                              📋 Uploaded Files ({transaction.sampleFiles.length})
                                            </p>
                                            <p className="text-xs text-green-600">
                                              ✅ Ready to submit
                                            </p>
                                          </div>
                                          <div className="space-y-2">
                                            {transaction.sampleFiles.map((file, fileIndex) => (
                                              <div key={fileIndex} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200 shadow-sm">
                                                <div className="flex items-center space-x-2">
                                                  <span className="text-blue-500">📄</span>
                                                  <span className="text-gray-700 text-sm">{file.name}</span>
                                                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                                </div>
                                                <button
                                                  type="button"
                                                  onClick={() => handleRemoveFile(index, 'sampleFiles', fileIndex)}
                                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                                  title="Remove this file"
                                                >
                                                  <Trash2 size={14} />
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                          <p className="text-xs text-gray-500 mt-2">
                                            💡 Want to add more files? Use the file selector above to choose additional documents.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Do you have data mapping specifications? *
                                  </label>
                                  <Select
                                    value={transaction.hasMappingSpecs}
                                    onChange={(e) => handleTransactionChange(index, 'hasMappingSpecs', e.target.value)}
                                  >
                                    <option value="">-- Select --</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Do you have internal system format documentation? *
                                  </label>
                                  <Select
                                    value={transaction.hasSystemDocs}
                                    onChange={(e) => handleTransactionChange(index, 'hasSystemDocs', e.target.value)}
                                  >
                                    <option value="">-- Select --</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Select>
                                  
                                  {transaction.hasSystemDocs === 'yes' && (
                                    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        📋 Upload System Documentation
                                      </label>
                                      <p className="text-xs text-gray-600 mb-3">
                                        Upload your internal system format documentation, data specifications, or technical guides. Multiple files can be selected at once.
                                      </p>
                                      
                                      <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                                        <input
                                          type="file"
                                          multiple
                                          accept=".pdf,.doc,.docx,.txt,.xml,.xls,.xlsx"
                                          onChange={(e) => handleFileUpload(index, 'systemDocFiles', e.target.files)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                          💡 <strong>Tip:</strong> Hold Ctrl (or Cmd on Mac) to select multiple files at once
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Accepted formats: .pdf, .doc, .docx, .txt, .xml, .xls, .xlsx
                                        </p>
                                      </div>
                                      
                                      {transaction.systemDocFiles && transaction.systemDocFiles.length > 0 && (
                                        <div className="mt-4">
                                          <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-gray-700">
                                              📋 Uploaded Documentation ({transaction.systemDocFiles.length})
                                            </p>
                                            <p className="text-xs text-green-600">
                                              ✅ Ready to submit
                                            </p>
                                          </div>
                                          <div className="space-y-2">
                                            {transaction.systemDocFiles.map((file, fileIndex) => (
                                              <div key={fileIndex} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200 shadow-sm">
                                                <div className="flex items-center space-x-2">
                                                  <span className="text-green-500">📄</span>
                                                  <span className="text-gray-700 text-sm">{file.name}</span>
                                                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                                </div>
                                                <button
                                                  type="button"
                                                  onClick={() => handleRemoveFile(index, 'systemDocFiles', fileIndex)}
                                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                                  title="Remove this file"
                                                >
                                                  <Trash2 size={14} />
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                          <p className="text-xs text-gray-500 mt-2">
                                            💡 Need to add more documentation? Use the file selector above to choose additional files.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-blue-300 pt-4 mt-4">
                              <h5 className="font-semibold text-gray-800 mb-3 text-sm">
                                Functional Acknowledgments (997):
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Do you require a 997 from us for this transaction? *
                                  </label>
                                  <Select
                                    value={transaction.require997FromUs}
                                    onChange={(e) => handleTransactionChange(index, 'require997FromUs', e.target.value)}
                                  >
                                    <option value="">-- Select --</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Select>
                                  <p className="text-xs text-gray-500 mt-1">
                                    If you send this transaction to us, do you need us to send you a 997?
                                  </p>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Will you send us a 997 for this transaction? *
                                  </label>
                                  <Select
                                    value={transaction.willSend997}
                                    onChange={(e) => handleTransactionChange(index, 'willSend997', e.target.value)}
                                  >
                                    <option value="">-- Select --</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </Select>
                                  <p className="text-xs text-gray-500 mt-1">
                                    If we send this transaction to you, will you send us a 997?
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex justify-center pt-4">
                <div className="w-full max-w-2xl space-y-4">
                  {/* Error Message */}
                  {submitError && (
                    <div className="border border-red-300 bg-red-50 rounded-lg p-4">
                      <h3 className="font-semibold text-red-800 mb-2">
                        ❌ Submission Error
                      </h3>
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {submitSuccess && (
                    <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">
                        ✅ Form Submitted Successfully!
                      </h3>
                      <p className="text-sm text-green-700">
                        Your onboarding form has been submitted and a task has been created in ClickUp.
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Onboarding Form'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
