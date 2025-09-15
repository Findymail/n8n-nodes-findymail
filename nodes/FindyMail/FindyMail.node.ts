import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class FindyMail implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FindyMail',
		name: 'findyMail',
		group: ['input'],
		version: 1,
		description: 'Find email addresses using FindyMail API',
		defaults: {
			name: 'FindyMail',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'findyMailApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Find Email From Linkedin',
						value: 'findFromLinkedin',
						description: 'Find email address from Linkedin profile URL',
						action: 'Find email from linkedin',
					},
					{
						name: 'Find Email From Name + Company',
						value: 'findFromName',
						description: 'Find email address from name and company',
						action: 'Find email from name',
					},
					{
						name: 'Find Employees',
						value: 'findEmployees',
						description: 'Find employees from a company domain',
						action: 'Find employees',
					},
					{
						name: 'Find Phone Number',
						value: 'findPhone',
						description: 'Find phone number from LinkedIn profile URL',
						action: 'Find phone',
					},
					{
						name: 'Verify Email',
						value: 'verifyEmail',
						description: 'Verify if an email address is valid and deliverable',
						action: 'Verify email',
					},
				],
				default: 'findFromName',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				placeholder: 'John Doe',
				description: 'The full name of the person',
				displayOptions: {
					show: {
						operation: ['findFromName'],
					},
				},
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				placeholder: 'example.com',
				description: 'The company domain to search for the email',
				displayOptions: {
					show: {
						operation: ['findFromName'],
					},
				},
			},
			{
				displayName: 'Linkedin URL',
				name: 'linkedinUrl',
				type: 'string',
				default: '',
				placeholder: 'https://www.linkedin.com/in/johndoe',
				description: 'The Linkedin profile URL of the person',
				displayOptions: {
					show: {
						operation: ['findFromLinkedin'],
					},
				},
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'example@example.com',
				description: 'The email address to verify',
				displayOptions: {
					show: {
						operation: ['verifyEmail'],
					},
				},
			},
			{
				displayName: 'Phone LinkedIn URL',
				name: 'phoneLinkedinUrl',
				type: 'string',
				default: '',
				placeholder: 'https://www.linkedin.com/in/johndoe',
				description: 'The LinkedIn profile URL to find phone number from',
				displayOptions: {
					show: {
						operation: ['findPhone'],
					},
				},
			},
			{
				displayName: 'Company Domain',
				name: 'companyDomain',
				type: 'string',
				default: '',
				placeholder: 'example.com',
				description: 'The company domain to find employees from',
				displayOptions: {
					show: {
						operation: ['findEmployees'],
					},
				},
			},
			{
				displayName: 'Job Titles',
				name: 'jobTitles',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'Software Engineer',
				description: 'Job titles to search for (one per line)',
				displayOptions: {
					show: {
						operation: ['findEmployees'],
					},
				},
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['findFromName', 'findFromLinkedin', 'verifyEmail', 'findPhone', 'findEmployees'],
					},
				},
				options: [
					{
						displayName: 'Webhook URL',
						name: 'webhook_url',
						type: 'string',
						default: '',
						placeholder: 'https://your-webhook-url.com',
						description: 'URL to receive the result asynchronously (optional)',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				if (operation === 'findFromName') {
					const name = this.getNodeParameter('name', itemIndex) as string;
					const domain = this.getNodeParameter('domain', itemIndex) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as {
						webhook_url?: string;
					};

					// Validate required parameters
					if (!name || !domain) {
						throw new NodeOperationError(this.getNode(), 'Name and domain are required parameters');
					}

					// Prepare request body
					const requestBody: any = {
						name: name,
						domain: domain,
					};

					// Add optional parameters if provided
					if (additionalOptions.webhook_url) {
						requestBody.webhook_url = additionalOptions.webhook_url;
					}

					// Make API request
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'findyMailApi',
						{
							method: 'POST',
							url: 'https://app.findymail.com/api/search/name',
							body: requestBody,
							json: true,
						},
					);

					// Process the response
					const responseData = {
						json: response,
						pairedItem: itemIndex,
					};

					returnData.push(responseData);
				} else if (operation === 'findFromLinkedin') {
					const linkedinUrl = this.getNodeParameter('linkedinUrl', itemIndex) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as {
						webhook_url?: string;
					};

					// Validate required parameters
					if (!linkedinUrl) {
						throw new NodeOperationError(this.getNode(), 'Linkedin URL is a required parameter');
					}

					// Prepare request body
					const requestBody: any = {
						linkedin_url: linkedinUrl,
					};

					// Add optional parameters if provided
					if (additionalOptions.webhook_url) {
						requestBody.webhook_url = additionalOptions.webhook_url;
					}

					// Make API request
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'findyMailApi',
						{
							method: 'POST',
							url: 'https://app.findymail.com/api/search/linkedin',
							body: requestBody,
							json: true,
						},
					);

					// Process the response
					const responseData = {
						json: response,
						pairedItem: itemIndex,
					};

					returnData.push(responseData);
				} else if (operation === 'verifyEmail') {
					const email = this.getNodeParameter('email', itemIndex) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as {
						webhook_url?: string;
					};

					// Validate required parameters
					if (!email) {
						throw new NodeOperationError(this.getNode(), 'Email is a required parameter');
					}

					// Prepare request body
					const requestBody: any = {
						email: email,
					};

					// Add optional parameters if provided
					if (additionalOptions.webhook_url) {
						requestBody.webhook_url = additionalOptions.webhook_url;
					}

					// Make API request
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'findyMailApi',
						{
							method: 'POST',
							url: 'https://app.findymail.com/api/verify',
							body: requestBody,
							json: true,
						},
					);

					// Process the response
					const responseData = {
						json: response,
						pairedItem: itemIndex,
					};

					returnData.push(responseData);
				} else if (operation === 'findPhone') {
					const phoneLinkedinUrl = this.getNodeParameter('phoneLinkedinUrl', itemIndex) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as {
						webhook_url?: string;
					};

					// Validate required parameters
					if (!phoneLinkedinUrl) {
						throw new NodeOperationError(this.getNode(), 'Phone LinkedIn URL is a required parameter');
					}

					// Prepare request body
					const requestBody: any = {
						linkedin_url: phoneLinkedinUrl,
					};

					// Add optional parameters if provided
					if (additionalOptions.webhook_url) {
						requestBody.webhook_url = additionalOptions.webhook_url;
					}

					// Make API request
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'findyMailApi',
						{
							method: 'POST',
							url: 'https://app.findymail.com/api/search/phone',
							body: requestBody,
							json: true,
						},
					);

					// Process the response
					const responseData = {
						json: response,
						pairedItem: itemIndex,
					};

					returnData.push(responseData);
				} else if (operation === 'findEmployees') {
					const companyDomain = this.getNodeParameter('companyDomain', itemIndex) as string;
					const jobTitles = this.getNodeParameter('jobTitles', itemIndex) as string[];
					const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as {
						webhook_url?: string;
					};

					// Validate required parameters
					if (!companyDomain) {
						throw new NodeOperationError(this.getNode(), 'Company domain is a required parameter');
					}

					if (!jobTitles || jobTitles.length === 0) {
						throw new NodeOperationError(this.getNode(), 'At least one job title is required');
					}

					// Filter out empty job titles
					const validJobTitles = jobTitles.filter(title => title && title.trim() !== '');

					if (validJobTitles.length === 0) {
						throw new NodeOperationError(this.getNode(), 'At least one valid job title is required');
					}

					// Prepare request body
					const requestBody: any = {
						website: companyDomain,
						job_titles: validJobTitles,
					};

					// Add optional parameters if provided
					if (additionalOptions.webhook_url) {
						requestBody.webhook_url = additionalOptions.webhook_url;
					}

					// Make API request
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'findyMailApi',
						{
							method: 'POST',
							url: 'https://app.findymail.com/api/search/employees',
							body: requestBody,
							json: true,
						},
					);

					// Process the response
					const responseData = {
						json: response,
						pairedItem: itemIndex,
					};

					returnData.push(responseData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: itemIndex,
					});
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
