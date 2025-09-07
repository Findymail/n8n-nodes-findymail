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
						name: 'Find From Name',
						value: 'findFromName',
						description: 'Find email address from first name, last name, and domain',
						action: 'Find email from name',
					},
				],
				default: 'findFromName',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				placeholder: 'John',
				description: 'The first name of the person',
				displayOptions: {
					show: {
						operation: ['findFromName'],
					},
				},
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				placeholder: 'Doe',
				description: 'The last name of the person',
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
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['findFromName'],
					},
				},
				options: [
					{
						displayName: 'Company',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company name (optional)',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'The country code (optional)',
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
					const firstName = this.getNodeParameter('firstName', itemIndex) as string;
					const lastName = this.getNodeParameter('lastName', itemIndex) as string;
					const domain = this.getNodeParameter('domain', itemIndex) as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as {
						company?: string;
						country?: string;
					};

					// Validate required parameters
					if (!firstName || !lastName || !domain) {
						throw new NodeOperationError(this.getNode(), 'First name, last name, and domain are required parameters');
					}

					// Prepare request body
					const requestBody: any = {
						first_name: firstName,
						last_name: lastName,
						domain: domain,
					};

					// Add optional parameters if provided
					if (additionalOptions.company) {
						requestBody.company = additionalOptions.company;
					}
					if (additionalOptions.country) {
						requestBody.country = additionalOptions.country;
					}

					// Make API request
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'findyMailApi',
						{
							method: 'POST',
							url: 'https://api.findymail.com/v1/email-finder/find-from-name',
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
