# n8n-nodes-findymail

This is an n8n community node that integrates with [Findymail](https://app.findymail.com/), a powerful email finder and verification service. Findymail helps you discover email addresses, verify their validity, find phone numbers, and discover employees from companies - all directly within your n8n workflows.

Findymail is a comprehensive email intelligence platform that provides accurate contact information for lead generation, sales prospecting, and business development. With this n8n node, you can automate your outreach processes and build sophisticated workflows for finding and verifying contact information.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

To install this node:

1. Go to **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter `n8n-nodes-findymail` in the package name field
4. Click **Install**

## Operations

This node supports the following operations:

### 🔍 Find from Name
Find email addresses using a person's full name and their company domain. Perfect for discovering contact information when you know someone's name and where they work.

**Parameters:**
- **Name**: The full name of the person (e.g., "John Doe")
- **Domain**: The company domain (e.g., "example.com")

### 🔗 Find from business profile
Get email addresses directly from a business profile URL. Ideal for converting social connections into actionable contact information.

**Parameters:**
- **Profile URL**: The profile URL (e.g., "https://www.linkedin.com/in/johndoe")

### ✅ Verify Email
Verify if an email address is valid and deliverable. Essential for maintaining clean email lists and improving deliverability rates.

**Parameters:**
- **Email**: The email address to verify (e.g., "john@example.com")

### 📞 Find Phone
Discover phone numbers from LinkedIn profile URLs. Great for expanding your contact database with phone numbers for outreach campaigns.

**Parameters:**
- **Phone LinkedIn URL**: The LinkedIn profile URL to find phone number from

### 👥 Find Employees
Discover employees and team members from a company domain. Perfect for building comprehensive contact lists for B2B outreach.

**Parameters:**
- **Company Domain**: The company domain to find employees from (e.g., "example.com")

### Additional Options
Some operations support an optional **Webhook URL** parameter for asynchronous processing, allowing you to receive results via webhook when processing is complete.

## Credentials

To use this node, you need a Findymail API key:

### Prerequisites
1. Sign up for a Findymail account at [app.findymail.com](https://app.findymail.com/)
2. Navigate to your account settings to generate an API key
3. Ensure you have sufficient credits for your intended operations

### Setting up Credentials
1. In n8n, go to **Credentials** → **Add Credential**
2. Search for "Findymail API"
3. Enter your API key
4. Test the connection to ensure it's working

### Credit Usage
- **Email Finding**: 1 finder credit per successful email discovery
- **Email Verification**: 1 verifier credit per verification
- **Phone Finding**: 10 finder credits per successful phone number discovery
- **Employee Discovery**: Varies based on the number of employees found

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Tested with n8n versions**: 1.0.0+
- **Node.js version**: 20+

## Usage

### Basic Email Finding Workflow
1. Add the Findymail node to your workflow
2. Select "Find from Name" operation
3. Enter the person's name and company domain
4. Execute to get their email address

### Email Verification Pipeline
1. Get an email from an external source
2. Connect to a "Verify Email" operation
3. Filter out invalid emails before sending campaigns

Note: Email addresses provided by Findymail are already verified and do not need to be verified again

### Lead Generation Workflow
1. Use "Find Employees" to discover team members
2. Use "Find from business profile" to get additional contact details
3. Export clean contact lists for your CRM

### Advanced Automation
Combine Findymail with other n8n nodes to create sophisticated workflows:
- **CRM Integration**: Automatically add verified contacts to your CRM
- **Email Marketing**: Build targeted email lists for campaigns
- **Sales Prospecting**: Create automated lead qualification processes
- **Data Enrichment**: Enhance existing contact databases

### Webhook Integration
For high-volume operations, use webhook URLs to receive results asynchronously:
1. Set up a webhook endpoint in your workflow
2. Provide the webhook URL in the "Additional Options"
3. Process results when they arrive via webhook

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Findymail API Documentation](https://app.findymail.com/docs/)
* [Findymail Website](https://app.findymail.com/)
* [n8n Documentation](https://docs.n8n.io/)
* [n8n Community Forum](https://community.n8n.io/)

## Support

For issues related to this n8n node, please create an issue in this repository.

For Findymail API issues or questions about credits and billing, please contact Findymail support through their platform.

## License

[MIT](LICENSE.md)

---

**Note**: This is a community node and is not officially supported by n8n. Use at your own discretion and ensure you comply with Findymail's terms of service and usage policies.