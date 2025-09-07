import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FindyMailApi implements ICredentialType {
	name = 'findyMailApi';
	displayName = 'FindyMail API';
	documentationUrl = 'https://app.findymail.com/docs/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			description: 'Your FindyMail API key',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.findymail.com',
			url: '/v1/email-finder/find-from-name',
			method: 'POST',
			body: {
				first_name: 'test',
				last_name: 'test',
				domain: 'example.com',
			},
		},
	};
}
