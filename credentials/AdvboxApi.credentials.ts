import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

const API_BASE_URL = 'https://app.advbox.com.br/api/v1';

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
			type: 'hidden',
			default: API_BASE_URL,
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
			baseURL: API_BASE_URL,
			url: '/settings',
			method: 'GET',
		},
	};
}
