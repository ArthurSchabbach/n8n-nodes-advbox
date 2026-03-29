import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AdvboxApi implements ICredentialType {
	name = 'advboxApi';
	displayName = 'ADVBOX API';
	documentationUrl = '';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The ADVBOX API token',
		},
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://app.advbox.com.br/api/v1',
			required: true,
			description: 'The URL to the ADVBOX API',
		},
		{
			displayName: 'Agent Identifier',
			name: 'xAgent',
			type: 'string',
			default: '',
			required: false,
			description: 'Optional agent identifier to be sent in x-agent header',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/settings',
			method: 'GET',
		},
	};
}
