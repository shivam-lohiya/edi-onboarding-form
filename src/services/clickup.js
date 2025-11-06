// ClickUp API Service
const CLICKUP_API_URL = 'https://api.clickup.com/api/v2/list/901413221524/task';

/**
 * Creates a task in ClickUp with the onboarding form data
 * @param {Object} formData - The complete form data from sections 1 and 2
 * @param {string} apiToken - ClickUp API token
 * @returns {Promise<Object>} - The created task response
 */
export async function createClickUpTask(formData, apiToken) {
  const { section1Data, selectedTransactions } = formData;

  // Format the task description with all form data
  const description = formatTaskDescription(section1Data, selectedTransactions);
  
  // Format custom fields or task content
  const taskData = {
    name: section1Data.companyName,
    description: description,
    status: 'to do',
    priority: 3, // Normal priority
    tags: ['edi-onboarding', 'vendor'],
    custom_fields: [],
  };

  try {
    const response = await fetch(CLICKUP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiToken,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.err || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating ClickUp task:', error);
    throw error;
  }
}

/**
 * Formats the form data into a readable task description
 */
function formatTaskDescription(section1Data, selectedTransactions) {
  let description = '# EDI Vendor Onboarding Form Submission\n\n';
  
  // Section 1: Company Information
  description += '## Company and Contact Information\n\n';
  description += `**Company Name:** ${section1Data.companyName}\n`;
  description += `**Contact Name:** ${section1Data.contactName}\n`;
  description += `**Contact Email:** ${section1Data.contactEmail}\n`;
  description += `**Contact Phone:** ${section1Data.contactPhone}\n\n`;
  
  // Section 2: Transaction Types
  description += '## EDI Transaction Types & Details\n\n';
  
  if (selectedTransactions.length === 0) {
    description += '*No transactions selected*\n';
  } else {
    selectedTransactions.forEach((transaction, index) => {
      description += `### ${index + 1}. ${transaction.type}\n\n`;
      description += `- **Direction:** ${formatValue(transaction.direction)}\n`;
      description += `- **Frequency:** ${formatValue(transaction.frequency)}\n`;
      description += `- **Required/Optional:** ${formatValue(transaction.requiredOptional)}\n\n`;
      
      description += '**Documentation & Samples:**\n';
      description += `- EDI Implementation Guide: ${formatYesNo(transaction.hasImplementationGuide)}\n`;
      description += `- Sample EDI Files: ${formatYesNo(transaction.canProvideSamples)}\n`;
      description += `- Data Mapping Specifications: ${formatYesNo(transaction.hasMappingSpecs)}\n`;
      description += `- Internal System Format Documentation: ${formatYesNo(transaction.hasSystemDocs)}\n\n`;
      
      description += '**Functional Acknowledgments (997):**\n';
      description += `- Require 997 from us: ${formatYesNo(transaction.require997FromUs)}\n`;
      description += `- Will send 997 to us: ${formatYesNo(transaction.willSend997)}\n\n`;
    });
  }
  
  return description;
}

/**
 * Helper function to format values
 */
function formatValue(value) {
  if (!value) return '*Not specified*';
  
  // Convert technical values to readable format
  const valueMap = {
    'you-to-us': 'You send to us',
    'us-to-you': 'We send to you',
    'both': 'Both directions',
    'real-time': 'Real-time',
    'hourly': 'Hourly',
    'daily': 'Daily',
    'weekly': 'Weekly',
    'monthly': 'Monthly',
    'on-demand': 'On-demand',
    'required': 'Required',
    'optional': 'Optional',
  };
  
  return valueMap[value] || value;
}

/**
 * Helper function to format yes/no values
 */
function formatYesNo(value) {
  if (!value) return '*Not specified*';
  return value === 'yes' ? '✅ Yes' : '❌ No';
}
