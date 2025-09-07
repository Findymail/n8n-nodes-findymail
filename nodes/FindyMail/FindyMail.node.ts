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
						description: 'Find email address from name and company',
						action: 'Find email from name',
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
