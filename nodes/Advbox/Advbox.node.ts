import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	NodeOperationError,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class Advbox implements INodeType {

	methods = {
		loadOptions: {
			async loadUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				try {
					const credentials = await this.getCredentials('advboxApi');
					const baseUrl = ((credentials.apiUrl as string) || '').replace(/\/$/, '');
					const response: any = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi', {
						method: 'GET',
						url: `${baseUrl}/settings`,
						headers: { 'Accept': 'application/json' },
					} as IHttpRequestOptions);

					if (response && response.users && Array.isArray(response.users)) {
						for (const user of response.users) {
							returnData.push({
								name: user.name || user.email || `ID: ${user.id}`,
								value: user.id,
								description: `${user.email || ''} (ID: ${user.id})`,
							});
						}
					}
				} catch (error) {
					// ignore - return empty array
				}

				return returnData;
			},

			// Método para carregar opções de origens de clientes
			async loadCustomerOrigins(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				try {
					const credentials = await this.getCredentials('advboxApi');
					const baseUrl = ((credentials.apiUrl as string) || '').replace(/\/$/, '');
					const response: any = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi', {
						method: 'GET',
						url: `${baseUrl}/settings`,
						headers: { 'Accept': 'application/json' },
					} as IHttpRequestOptions);

					if (response && response.origins && Array.isArray(response.origins)) {
						for (const origin of response.origins) {
							returnData.push({
								name: origin.origin,
								value: origin.id,
								description: `ID: ${origin.id}`,
							});
						}
					}
				} catch (error) {
					// ignore - return empty array
				}

				return returnData;
			},

			// Método para carregar opções de tipos de tarefas
			async loadTaskTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				try {
					const credentials = await this.getCredentials('advboxApi');
					const baseUrl = ((credentials.apiUrl as string) || '').replace(/\/$/, '');
					const response: any = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi', {
						method: 'GET',
						url: `${baseUrl}/settings`,
						headers: { 'Accept': 'application/json' },
					} as IHttpRequestOptions);

					if (response && response.tasks && Array.isArray(response.tasks)) {
						for (const task of response.tasks) {
							returnData.push({
								name: task.task,
								value: task.id,
								description: `Reward: ${task.reward}`,
							});
						}
					}
				} catch (error) {
					// ignore - return empty array
				}

				return returnData;
			},

			// Método para carregar opções de estágios (stages)
			async loadStages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				try {
					const credentials = await this.getCredentials('advboxApi');
					const baseUrl = ((credentials.apiUrl as string) || '').replace(/\/$/, '');
					const response: any = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi', {
						method: 'GET',
						url: `${baseUrl}/settings`,
						headers: { 'Accept': 'application/json' },
					} as IHttpRequestOptions);

					if (response && response.stages && Array.isArray(response.stages)) {
						for (const stage of response.stages) {
							returnData.push({
								name: stage.stage,
								value: stage.id,
								description: `Step: ${stage.step}`,
							});
						}
					}
				} catch (error) {
					// ignore - return empty array
				}

				return returnData;
			},

			// Método para carregar opções de grupos de processos
			async loadLawsuitGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const uniqueGroups = new Set<string>();

				try {
					const credentials = await this.getCredentials('advboxApi');
					const baseUrl = ((credentials.apiUrl as string) || '').replace(/\/$/, '');
					const response: any = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi', {
						method: 'GET',
						url: `${baseUrl}/settings`,
						headers: { 'Accept': 'application/json' },
					} as IHttpRequestOptions);

					if (response && response.type_lawsuits && Array.isArray(response.type_lawsuits)) {
						// Extrair grupos únicos
						for (const typeLawsuit of response.type_lawsuits) {
							if (typeLawsuit.group && !uniqueGroups.has(typeLawsuit.group)) {
								uniqueGroups.add(typeLawsuit.group);
								returnData.push({
									name: typeLawsuit.group,
									value: typeLawsuit.group,
								});
							}
						}
					}
				} catch (error) {
					// ignore - return empty array
				}

				return returnData;
			},

			// Método para carregar opções de tipos de processos
			async loadLawsuitTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				try {
					const credentials = await this.getCredentials('advboxApi');
					const baseUrl = ((credentials.apiUrl as string) || '').replace(/\/$/, '');
					const response: any = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi', {
						method: 'GET',
						url: `${baseUrl}/settings`,
						headers: { 'Accept': 'application/json' },
					} as IHttpRequestOptions);

					if (response && response.type_lawsuits && Array.isArray(response.type_lawsuits)) {
						for (const typeLawsuit of response.type_lawsuits) {
							returnData.push({
								name: typeLawsuit.type,
								value: typeLawsuit.id,
								description: `Group: ${typeLawsuit.group}`,
							});
						}
					}
				} catch (error) {
					// ignore - return empty array
				}

				return returnData;
			},


		},
	}

	description: INodeTypeDescription = {
		displayName: 'ADVBOX',
		name: 'advbox',
		icon: 'file:logo-advbox.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Advbox API',
		defaults: {
			name: 'Advbox',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'advboxApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				required: true,
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Lawsuit',
						value: 'lawsuit',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Movement',
						value: 'movement',
					},
					{
						name: 'Settings',
						value: 'settings',
					},
					{
						name: 'Transaction',
						value: 'transaction',
					},
				],
				default: 'customer',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'customer',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new customer',
						action: 'Create a new customer',
					},
					{
						name: 'Get by id',
						value: 'get',
						description: 'Get customer by ID',
						action: 'Get customer by ID',
					},
					{
						name: 'Get many',
						value: 'getAll',
						description: 'Get many customers',
						action: 'Get many customers',
					},
					{
						name: 'Get birthdays',
						value: 'getBirthdays',
						description: 'Get customers with birthdays in current month',
						action: 'Get customers with birthdays',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new lawsuit',
						action: 'Create a new lawsuit',
					},
					{
						name: 'Get by id',
						value: 'get',
						description: 'Get lawsuit by ID',
						action: 'Get lawsuit by ID',
					},
					{
						name: 'Get many',
						value: 'getAll',
						description: 'Get many lawsuits',
						action: 'Get many lawsuits',
					},
					{
						name: 'Get lawsuit task history',
						value: 'getTaskHistory',
						description: 'Get task history for a lawsuit',
						action: 'Get lawsuit task history',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an existing lawsuit',
						action: 'Update an existing lawsuit',
					},

				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'task',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new task',
						action: 'Create a new task',
					},
					{
						name: 'Get Tasks',
						value: 'getTasks',
						description: 'Retrieve a list of tasks based on filters',
						action: 'Get tasks',
					},

				],
				default: 'getTasks',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'movement',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new manual movement',
						action: 'Create a new manual movement',
					},
					{
						name: 'Get history',
						value: 'getHistory',
						description: 'Get movement history for a lawsuit',
						action: 'Movement history',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'settings',
						],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get account settings',
						action: 'Get account settings',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'transaction',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new financial transaction',
						action: 'Create a transaction',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve financial transactions with comprehensive filter options',
						action: 'Get all transactions',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an existing financial transaction',
						action: 'Update a transaction',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Name of the customer',
				displayOptions: {
					show: {
						resource: [
							'customer',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'User ID',
						name: 'users_id',
						type: 'number',
						default: '',
						description: 'ID of the user creating the customer',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Customer email address',
					},
					{
						displayName: 'Identification (CPF/CNPJ)',
						name: 'identification',
						type: 'string',
						default: '',
						description: 'Customer identification number (CPF/CNPJ)',
					},
					{
						displayName: 'Document (Registration Number)',
						name: 'document',
						type: 'string',
						default: '',
						description: 'Customer registration document number',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Customer phone number (format: 99999999999 or (99) 99999-9999)',
					},
					{
						displayName: 'Cellphone',
						name: 'cellphone',
						type: 'string',
						default: '',
						description: 'Customer cellphone number (format: 99999999999 or (99) 99999-9999)',
					},
					{
						displayName: 'Birthdate',
						name: 'birthdate',
						type: 'string',
						default: '',
						description: 'Customer birthdate (format: YYYY-MM-DD)',
					},
					{
						displayName: 'Occupation',
						name: 'occupation',
						type: 'string',
						default: '',
						description: 'Customer occupation or profession',
					},
					{
						displayName: 'Postal Code',
						name: 'postalcode',
						type: 'string',
						default: '',
						description: 'Customer postal code (format: 99999-999)',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'Customer city',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						description: 'Customer state',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Additional notes about the customer',
					},
				],
				displayOptions: {
					show: {
						resource: [
							'customer',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'User ID',
				name: 'users_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadUsers',
				},
				required: true,
				default: '',
				description: 'ID of the user responsible for the customer',
				displayOptions: {
					show: {
						resource: [
							'customer',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Customer Origin',
				name: 'customers_origins_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadCustomerOrigins',
				},
				required: true,
				default: '',
				description: 'Origin of the customer',
				displayOptions: {
					show: {
						resource: [
							'customer',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the customer',
				displayOptions: {
					show: {
						resource: [
							'customer',
						],
						operation: [
							'get',
						],
					},
				},
			},
			{
				displayName: 'Lawsuit ID',
				name: 'lawsuitId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the lawsuit',
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'get',
							'update',
						],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'customerGetAllFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'customer',
						],
						operation: [
							'getAll',
						],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Customer name or part of it. You can use a full name or a partial search term (e.g., a first name or last name).',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Customer phone (e.g., 4899123456 or (48)99123-4567).',
					},
					{
						displayName: 'Identification',
						name: 'identification',
						type: 'string',
						default: '',
						description: 'Customer identification (CPF/CNPJ).',
					},
					{
						displayName: 'Document',
						name: 'document',
						type: 'string',
						default: '',
						description: 'Customer document number.',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Customer email address.',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'Customer city.',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						description: 'Customer state.',
					},
					{
						displayName: 'Occupation',
						name: 'occupation',
						type: 'string',
						default: '',
						description: 'Customer occupation or profession.',
					},
					{
						displayName: 'Birthdays',
						name: 'birthdays',
						type: 'boolean',
						default: false,
						description: 'Filter customers by birthdays in the current month.',
					},
					{
						displayName: 'Created Start',
						name: 'created_start',
						type: 'dateTime',
						default: '',
						description: 'Start date for filtering customers by creation date (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Created End',
						name: 'created_end',
						type: 'dateTime',
						default: '',
						description: 'End date for filtering customers by creation date (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 10,
						description: 'Number of items in the response, between 1 and 1000.',
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'Number of items to skip before starting the response (pagination).',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'customer',
						],
						operation: [
							'getBirthdays',
						],
					},
				},
				options: [
					
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 10,
						description: 'Number of items in the response, between 1 and 1000.',
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'Number of items to skip before starting the response (pagination).',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'getAll',
						],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Lawsuit name or part of it.',
					},
					{
						displayName: 'Process Number',
						name: 'process_number',
						type: 'string',
						default: '',
						description: 'Process number of the lawsuit.',
					},
					{
						displayName: 'Protocol Number',
						name: 'protocol_number',
						type: 'string',
						default: '',
						description: 'Protocol number of the lawsuit.',
					},
					{
						displayName: 'Customer ID',
						name: 'customer_id',
						type: 'number',
						default: 0,
						description: 'Customer ID associated with the lawsuit.',
					},
					{
						displayName: 'Group',
						name: 'group',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'loadLawsuitGroups',
						},
						default: '',
						description: 'Filter lawsuits by group',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'loadLawsuitTypes',
						},
						default: '',
						description: 'Filter lawsuits by type',
					},
					{
						displayName: 'Responsible',
						name: 'responsible',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'loadUsers',
						},
						default: '',
						description: 'Filter lawsuits by responsible person.',
					},
					{
						displayName: 'Stage',
						name: 'stage',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'loadStages',
						},
						default: '',
						description: 'Filter lawsuits by stage',
					},
					{
						displayName: 'Step',
						name: 'step',
						type: 'options',
						options: [
							{
								name: 'Marketing',
								value: 'MARKETING',
							},
							{
								name: 'Negociação',
								value: 'NEGOCIACAO',
							},
							{
								name: 'Consultoria',
								value: 'CONSULTORIA',
							},
							{
								name: 'Administrativo',
								value: 'ADMINISTRATIVO',
							},
							{
								name: 'Judicial',
								value: 'JUDICIAL',
							},
							{
								name: 'Recursal',
								value: 'RECURSAL',
							},
							{
								name: 'Execução/Cobrança',
								value: 'EXECUCAO_COBRANCA',
							},
							{
								name: 'RH/Financeiro',
								value: 'RH_FINANCEIRO',
							},
							{
								name: 'Arquivamento',
								value: 'ARQUIVAMENTO',
							},
						],
						default: '',
						description: 'Filter lawsuits by step',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 10,
						description: 'Number of items in the response, between 1 and 100.',
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'Number of items to skip before starting the response (pagination).',
					},
				],
			},
			// Parameters for task getTasks operation
			// Additional fields for task getTasks operation
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'getTasks',
						],
					},
				},
				options: [
					{
						displayName: 'Date Start',
						name: 'date_start',
						type: 'string',
						default: '',
						description: 'Start date for appointment date filter (format: yyyy-mm-dd)',
					},
					{
						displayName: 'Date End',
						name: 'date_end',
						type: 'string',
						default: '',
						description: 'End date for appointment date filter (format: yyyy-mm-dd)',
					},
					{
						displayName: 'Created Start',
						name: 'created_start',
						type: 'string',
						default: '',
						description: 'Start date for creation date filter (format: yyyy-mm-dd). Must be used together with created_end.',
					},
					{
						displayName: 'Created End',
						name: 'created_end',
						type: 'string',
						default: '',
						description: 'End date for creation date filter (format: yyyy-mm-dd). Must be used together with created_start.',
					},
					{
						displayName: 'Deadline Start',
						name: 'deadline_start',
						type: 'string',
						default: '',
						description: 'Start date for deadline date filter (format: yyyy-mm-dd). Must be used together with deadline_end.',
					},
					{
						displayName: 'Deadline End',
						name: 'deadline_end',
						type: 'string',
						default: '',
						description: 'End date for deadline date filter (format: yyyy-mm-dd). Must be used together with deadline_start.',
					},
					{
						displayName: 'Completed Start',
						name: 'completed_start',
						type: 'string',
						default: '',
						description: 'Start date for completion date filter (format: yyyy-mm-dd). Must be used together with completed_end.',
					},
					{
						displayName: 'Completed End',
						name: 'completed_end',
						type: 'string',
						default: '',
						description: 'End date for completion date filter (format: yyyy-mm-dd). Must be used together with completed_start.',
					},
					{
						displayName: 'User',
						name: 'user_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'loadUsers',
						},
						default: '',
						description: 'Select a user to filter tasks',
					},
					{
						displayName: 'User Name',
						name: 'user_name',
						type: 'string',
						default: '',
						description: 'Filter by user name',
					},
					{
						displayName: 'Task Type',
						name: 'task_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'loadTaskTypes',
						},
						default: '',
						description: 'Select a task type to filter tasks',
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'number',
						default: '',
						description: 'Filter by the ID of a specific assigned task',
					},
					{
						displayName: 'Lawsuit ID',
						name: 'lawsuit_id',
						type: 'string',
						default: '',
						description: 'Filter by lawsuit ID',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						default: 50,
						description: 'Number of items in the response, between 1 and 100',
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 0,
						description: 'Number of items to skip before starting the response (pagination)',
					},
				],
			},
			// Lawsuit parameters
			{
				displayName: 'User ID',
				name: 'users_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadUsers',
				},
				required: true,
				default: '',
				description: 'ID of the user responsible for the lawsuit',
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Customer IDs',
				name: 'customers_id',
				type: 'string',
				required: true,
				default: '',
				description: 'IDs of the customers associated with this lawsuit (array of integers)',
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Stage ID',
				name: 'stages_id',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the stage for this lawsuit',
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Lawsuit Type ID',
				name: 'type_lawsuits_id',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the lawsuit type',
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				required: false,
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'update',
						],
					},
				},
				options: [
					{
						displayName: 'User ID',
						name: 'users_id',
						type: 'string',
						default: '',
						description: 'User ID',
					},
					{
						displayName: 'Stage ID',
						name: 'stages_id',
						type: 'string',
						default: '',
						description: 'Stage ID',
					},
					{
						displayName: 'Lawsuit Type ID',
						name: 'type_lawsuits_id',
						type: 'string',
						default: '',
						description: 'Lawsuit type ID',
					},
					{
						displayName: 'Process Number',
						name: 'process_number',
						type: 'string',
						default: '',
						description: 'Process number',
					},
					{
						displayName: 'Protocol Number',
						name: 'protocol_number',
						type: 'string',
						default: '',
						description: 'Protocol number',
					},
					{
						displayName: 'Folder',
						name: 'folder',
						type: 'string',
						default: '',
						description: 'Folder',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'string',
						default: '',
						description: 'Date (format: DD/MM/YYYY)',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Notes',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Process Number',
						name: 'process_number',
						type: 'string',
						default: '',
						description: 'Process number of the lawsuit',
					},
					{
						displayName: 'Protocol Number',
						name: 'protocol_number',
						type: 'string',
						default: '',
						description: 'Protocol number of the lawsuit',
					},
					{
						displayName: 'Folder',
						name: 'folder',
						type: 'string',
						default: '',
						description: 'Folder for the lawsuit',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'string',
						default: '',
						description: 'Date (format: DD/MM/YYYY)',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Notes for the lawsuit',
					},
				],
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'create',
						],
					},
				},
			},
			// Task parameters
			{
				displayName: 'From User ID',
				name: 'from',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadUsers',
				},
				required: true,
				default: '',
				description: 'ID of the user creating the task',
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Guest Users',
				name: 'guests',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'loadUsers',
					allowCustomValue: true,
				},
				required: true,
				default: [],
				description: 'Select users to invite as guests or enter an expression for an array of user IDs',
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Task',
				name: 'tasks_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadTaskTypes',
				},
				required: true,
				default: '',
				description: 'Type of the task to create',
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Lawsuit ID',
				name: 'lawsuits_id',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the lawsuit associated with this task',
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'DD/MM/YYYY',
				description: 'Start date of the task in DD/MM/YYYY format',
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
				options: [
					{
						displayName: 'Comments',
						name: 'comments',
						type: 'string',
						default: '',
						description: 'Comments about the task',
					},
					{
						displayName: 'Start Time',
						name: 'start_time',
						type: 'string',
						default: '',
						placeholder: 'HH:MM',
						description: 'Start time of the task in HH:MM format',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'string',
						default: '',
						placeholder: 'DD/MM/YYYY',
						description: 'End date of the task in DD/MM/YYYY format',
					},
					{
						displayName: 'End Time',
						name: 'end_time',
						type: 'string',
						default: '',
						placeholder: 'HH:MM',
						description: 'End time of the task in HH:MM format',
					},
					{
						displayName: 'Deadline Date',
						name: 'date_deadline',
						type: 'string',
						default: '',
						placeholder: 'DD/MM/YYYY',
						description: 'Deadline date of the task in DD/MM/YYYY format',
					},
					{
						displayName: 'Location',
						name: 'local',
						type: 'string',
						default: '',
						description: 'Location of the task',
					},
					{
						displayName: 'Urgent',
						name: 'urgent',
						type: 'boolean',
						default: false,
						description: 'Indicates if the task is urgent',
					},
					{
						displayName: 'Important',
						name: 'important',
						type: 'boolean',
						default: false,
						description: 'Indicates if the task is important',
					},
					{
						displayName: 'Display in Schedule',
						name: 'display_schedule',
						type: 'boolean',
						default: false,
						description: 'Indicates if the task should be displayed in the calendar',
					},
				],
			},

			{
				displayName: 'Lawsuit ID',
				name: 'lawsuit_id',
				type: 'string',
				required: true,
				default: '',
				description: 'Lawsuit ID to get task history for',
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'getHistory',
						],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'getHistory',
						],
					},
				},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'All',
								value: 'all',
							},
							{
								name: 'Pending',
								value: 'pending',
							},
							{
								name: 'Completed',
								value: 'completed',
							},
						],
						default: 'all',
						description: 'Filter tasks by status',
					},
				],
			},

			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'getHistory',
						],
					},
				},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'All',
								value: 'all',
							},
							{
								name: 'Pending',
								value: 'pending',
							},
							{
								name: 'Completed',
								value: 'completed',
							},
						],
						default: 'all',
						description: 'Filter tasks by status',
					},
				],			},
			// Lawsuit Task History parameters
			{
				displayName: 'Lawsuit ID',
				name: 'lawsuit_id',
				type: 'string',
				required: true,
				default: '',
				description: 'Lawsuit ID to get task history for',
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'getTaskHistory',
						],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'lawsuit',
						],
						operation: [
							'getTaskHistory',
						],
					},
				},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'All',
								value: 'all',
							},
							{
								name: 'Pending',
								value: 'pending',
							},
							{
								name: 'Completed',
								value: 'completed',
							},
						],
						default: 'all',
						description: 'Filter tasks by status',
					},
				],
			},
			// Movement parameters
			{
				displayName: 'Lawsuit ID',
				name: 'lawsuit_id',
				type: 'string',
				required: true,
				default: '',
				description: 'ID do processo relacionado ao movimento',
				displayOptions: {
					show: {
						resource: [
							'movement',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Data do Movimento',
				name: 'date',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'DD/MM/YYYY',
				description: 'Data do movimento no formato DD/MM/YYYY',
				displayOptions: {
					show: {
						resource: [
							'movement',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Descrição',
				name: 'description',
				type: 'string',
				required: true,
				default: '',
				description: 'Descrição do movimento',
				displayOptions: {
					show: {
						resource: [
							'movement',
						],
						operation: [
							'create',
						],
					},
				},
			},
			{
				displayName: 'Lawsuit ID',
				name: 'lawsuit_id',
				type: 'string',
				required: true,
				default: '',
				description: 'Lawsuit ID to get movement history for',
				displayOptions: {
					show: {
						resource: [
							'movement',
						],
						operation: [
							'getHistory',
						],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'movement',
						],
						operation: [
							'getHistory',
						],
					},
				},
				options: [
					{
						displayName: 'Origem',
						name: 'origin',
						type: 'options',
						default: '',
						options: [
							{
								name: 'Tribunal',
								value: 'tribunal',
							},
							{
								name: 'Manual',
								value: 'manual',
							},
						],
						description: 'Filtrar movimentos por origem (tribunal ou manual)',
					},
				],
			},
			// =====================================================
			//         transaction:create - Required Fields
			// =====================================================
			{
				displayName: 'Entry Type',
				name: 'entry_type',
				type: 'options',
				required: true,
				default: 'income',
				description: 'Transaction type: income (CRÉDITO) or expense (DÉBITO)',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Income',
						value: 'income',
						description: 'Credit transaction (CRÉDITO)',
					},
					{
						name: 'Expense',
						value: 'expense',
						description: 'Debit transaction (DÉBITO)',
					},
				],
			},
			{
				displayName: 'User',
				name: 'users_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadUsers',
				},
				required: true,
				default: '',
				description: 'Responsible user for the transaction',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Debit Account (Bank ID)',
				name: 'debit_account',
				type: 'number',
				required: true,
				default: 0,
				description: 'Bank account ID. Obtain from GET /settings → financial.banks[].',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Category ID',
				name: 'categories_id',
				type: 'number',
				required: true,
				default: 0,
				description: 'Financial category ID. Must match entry_type (income→CRÉDITO, expense→DÉBITO). Obtain from GET /settings → financial.categories[].',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Cost Center ID',
				name: 'cost_centers_id',
				type: 'number',
				required: true,
				default: 0,
				description: 'Cost center ID. Obtain from GET /settings → financial.cost_centers[].',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				default: 0,
				description: 'Transaction value in BRL (e.g. 1234.90). Must be greater than zero.',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Due Date',
				name: 'date_due',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'Due date in YYYY-MM-DD format',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Customer ID',
						name: 'customers_id',
						type: 'number',
						default: 0,
						description: 'Client ID. Populates name and identification fields.',
					},
					{
						displayName: 'Lawsuit ID',
						name: 'lawsuits_id',
						type: 'number',
						default: 0,
						description: 'Case/lawsuit ID. Requires customers_id to be set.',
					},
					{
						displayName: 'Sector ID',
						name: 'sectors_id',
						type: 'number',
						default: 0,
						description: 'Sector ID. Must belong to the authenticated office.',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Transaction description (auto-converted to uppercase).',
					},
					{
						displayName: 'Payment Date',
						name: 'date_payment',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'Payment date in YYYY-MM-DD format. Cannot be a future date.',
					},
				],
			},
			// =====================================================
			//         transaction:update - Required Fields
			// =====================================================
			{
				displayName: 'Transaction ID',
				name: 'transactionId',
				type: 'number',
				required: true,
				default: 0,
				description: 'ID of the transaction to update',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Entry Type',
						name: 'entry_type',
						type: 'options',
						default: 'income',
						description: 'Transaction type. Required when changing categories_id.',
						options: [
							{
								name: 'Income',
								value: 'income',
								description: 'Credit transaction (CRÉDITO)',
							},
							{
								name: 'Expense',
								value: 'expense',
								description: 'Debit transaction (DÉBITO)',
							},
						],
					},
					{
						displayName: 'Category ID',
						name: 'categories_id',
						type: 'number',
						default: 0,
						description: 'Financial category ID. Must send entry_type together.',
					},
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 0,
						description: 'Transaction value in BRL (e.g. 500.00).',
					},
					{
						displayName: 'Due Date',
						name: 'date_due',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'Due date in YYYY-MM-DD format.',
					},
					{
						displayName: 'Payment Date',
						name: 'date_payment',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'Payment date in YYYY-MM-DD format. Use empty to mark as pending.',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Transaction description (auto-converted to uppercase).',
					},
					{
						displayName: 'Competence',
						name: 'competence',
						type: 'string',
						default: '',
						placeholder: 'MM/YYYY',
						description: 'Competence in MM/YYYY format (e.g. 05/2026).',
					},
				],
			},
			// Additional fields for transaction getAll operation
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'transaction',
						],
						operation: [
							'getAll',
						],
					},
				},
				options: [
					{
						displayName: 'Process Number',
						name: 'process_number',
						type: 'string',
						default: '',
						description: 'Filter transactions by process number.',
					},
					{
						displayName: 'Customer Identification',
						name: 'customer_identification',
						type: 'string',
						default: '',
						description: 'Filter transactions by customer identification (CPF/CNPJ).',
					},
					{
						displayName: 'Responsible',
						name: 'responsible',
						type: 'string',
						default: '',
						description: 'Filter transactions by responsible person name or ID.',
					},
					{
						displayName: 'Debit Bank',
						name: 'debit_bank',
						type: 'string',
						default: '',
						description: 'Filter transactions by debit bank.',
					},
					{
						displayName: 'Lawsuit ID',
						name: 'lawsuit_id',
						type: 'number',
						default: '',
						description: 'Filter transactions by lawsuit ID.',
					},
					{
						displayName: 'Customer Name',
						name: 'customer_name',
						type: 'string',
						default: '',
						description: 'Filter transactions by customer name.',
					},
					{
						displayName: 'Category',
						name: 'category',
						type: 'string',
						default: '',
						description: 'Filter transactions by category.',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Filter transactions by description.',
					},
					{
						displayName: 'Protocol Number',
						name: 'protocol_number',
						type: 'string',
						default: '',
						description: 'Filter transactions by protocol number.',
					},
					{
						displayName: 'Cost Center',
						name: 'cost_center',
						type: 'string',
						default: '',
						description: 'Filter transactions by cost center.',
					},
					{
						displayName: 'Competence Start',
						name: 'competence_start',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'Start date for filtering transactions by competence (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Competence End',
						name: 'competence_end',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'End date for filtering transactions by competence (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Created Start',
						name: 'created_start',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'Start date for filtering transactions by creation date (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Created End',
						name: 'created_end',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'End date for filtering transactions by creation date (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Due Date Start',
						name: 'date_due_start',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'Start date for filtering transactions by due date (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Due Date End',
						name: 'date_due_end',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'End date for filtering transactions by due date (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Date Payment Start',
						name: 'date_payment_start',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'Start date for filtering transactions by payment date (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Date Payment End',
						name: 'date_payment_end',
						type: 'string',
						default: '',
						placeholder: 'YYYY-MM-DD',
						description: 'End date for filtering transactions by payment date (format: YYYY-MM-DD).',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 10,
						description: 'Number of items in the response, between 1 and 1000.',
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'Number of items to skip before starting the response (pagination).',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials for the API
		const credentials = await this.getCredentials('advboxApi');

		let responseData;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'customer') {
					// *********************************************************************
					//                            customer
					// *********************************************************************

					if (operation === 'create') {
						// ----------------------------------
						//         customer:create
						// ----------------------------------

						const name = this.getNodeParameter('name', i) as string;
						const customers_origins_id = this.getNodeParameter('customers_origins_id', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							users_id?: number;
							email?: string;
							identification?: string;
							document?: string;
							phone?: string;
							cellphone?: string;
							birthdate?: string;
							occupation?: string;
							postalcode?: string;
							city?: string;
							state?: string;
							notes?: string;
						};

						const body: Record<string, any> = {
							name,
							customers_origins_id,
						};

						// Adiciona campos obrigatórios se fornecidos
						if (additionalFields.users_id) {
							body.users_id = additionalFields.users_id;
						}

						if (additionalFields.email) {
							body.email = additionalFields.email;
						}

						if (additionalFields.identification) {
							body.identification = additionalFields.identification;
						}

						if (additionalFields.document) {
							body.document = additionalFields.document;
						}

						if (additionalFields.phone) {
							body.phone = additionalFields.phone;
						}

						if (additionalFields.cellphone) {
							body.cellphone = additionalFields.cellphone;
						}

						if (additionalFields.birthdate) {
							body.birthdate = additionalFields.birthdate;
						}

						if (additionalFields.occupation) {
							body.occupation = additionalFields.occupation;
						}

						if (additionalFields.postalcode) {
							body.postalcode = additionalFields.postalcode;
						}

						if (additionalFields.city) {
							body.city = additionalFields.city;
						}

						if (additionalFields.state) {
							body.state = additionalFields.state;
						}

						if (additionalFields.notes) {
							body.notes = additionalFields.notes;
						}

						const customerCreateOptions: IHttpRequestOptions = {
							method: 'POST',
							url: `${credentials.apiUrl}/customers`,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
							body,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',customerCreateOptions);
					}
					else if (operation === 'get') {
						// ----------------------------------
						//         customer:get
						// ----------------------------------

						const customerId = this.getNodeParameter('customerId', i) as string;

						const customerOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/customers/${customerId}`,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',customerOptions);
					}
					else if (operation === 'getAll') {
						// ----------------------------------
						//         customer:getAll
						// ----------------------------------

						const additionalFields = this.getNodeParameter('customerGetAllFields', i) as {
							name?: string;
							phone?: string;
							identification?: string;
							document?: string;
							email?: string;
							city?: string;
							state?: string;
							occupation?: string;
							birthdays?: boolean;
							created_start?: string;
							created_end?: string;
							limit?: number;
							offset?: number;
						};

						const qs: Record<string, any> = {};

						if (additionalFields.name) {
							qs.name = additionalFields.name;
						}

						if (additionalFields.phone) {
							qs.phone = additionalFields.phone;
						}

						if (additionalFields.identification) {
							qs.identification = additionalFields.identification;
						}

						if (additionalFields.document) {
							qs.document = additionalFields.document;
						}

						if (additionalFields.email) {
							qs.email = additionalFields.email;
						}

						if (additionalFields.city) {
							qs.city = additionalFields.city;
						}

						if (additionalFields.state) {
							qs.state = additionalFields.state;
						}

						if (additionalFields.occupation) {
							qs.occupation = additionalFields.occupation;
						}

						if (additionalFields.birthdays) {
							qs.birthdays = additionalFields.birthdays;
						}

						if (additionalFields.created_start) {
							qs.created_start = additionalFields.created_start;
						}

						if (additionalFields.created_end) {
							qs.created_end = additionalFields.created_end;
						}

						if (additionalFields.limit) {
							qs.limit = additionalFields.limit;
						}

						if (additionalFields.offset) {
							qs.offset = additionalFields.offset;
						}

						const customerAllOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/customers`,
							qs,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi', customerAllOptions);
					}
					else if (operation === 'getBirthdays') {
						// ----------------------------------
						//      customer:getBirthdays
						// ----------------------------------

						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							limit?: number;
							offset?: number;
						};

						const qs: Record<string, any> = {};

						if (additionalFields.limit) {
							qs.limit = additionalFields.limit;
						}

						if (additionalFields.offset) {
							qs.offset = additionalFields.offset;
						}

						const birthdayOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/customers/birthdays`,
							qs,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',birthdayOptions);
					}
				}
				else if (resource === 'lawsuit') {
					// *********************************************************************
					//                            lawsuit
					// *********************************************************************

					if (operation === 'create') {
						// ----------------------------------
						//         lawsuit:create
						// ----------------------------------

						const users_id = this.getNodeParameter('users_id', i) as string;
						const customers_id = this.getNodeParameter('customers_id', i) as string;
						const stages_id = this.getNodeParameter('stages_id', i) as string;
						const type_lawsuits_id = this.getNodeParameter('type_lawsuits_id', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							process_number?: string;
							protocol_number?: string;
							folder?: string;
							date?: string;
							notes?: string;
						};

						// Parse customers_id as array of integers
						let customersArray = [];
						try {
							// Try to parse as JSON array first
							customersArray = JSON.parse(customers_id);
						} catch (error) {
							// If not valid JSON, try to split by comma
							customersArray = customers_id.split(',').map(id => parseInt(id.trim(), 10));
						}

						const body: Record<string, any> = {
							users_id,
							customers_id: customersArray,
							stages_id,
							type_lawsuits_id,
						};

						if (additionalFields.process_number) {
							body.process_number = additionalFields.process_number;
						}

						if (additionalFields.protocol_number) {
							body.protocol_number = additionalFields.protocol_number;
						}

						if (additionalFields.folder) {
							body.folder = additionalFields.folder;
						}

						if (additionalFields.date) {
							body.date = additionalFields.date;
						}

						if (additionalFields.notes) {
							body.notes = additionalFields.notes;
						}

						const lawsuitCreateOptions: IHttpRequestOptions = {
							method: 'POST',
							url: `${credentials.apiUrl}/lawsuits`,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
							body,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',lawsuitCreateOptions);
					}
					else if (operation === 'get') {
						// ----------------------------------
						//         lawsuit:get
						// ----------------------------------

						const lawsuitId = this.getNodeParameter('lawsuitId', i) as string;

						const lawsuitOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/lawsuits/${lawsuitId}`,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',lawsuitOptions);
					}
					else if (operation === 'getAll') {
						// ----------------------------------
						//         lawsuit:getAll
						// ----------------------------------

						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							name?: string;
							process_number?: string;
							protocol_number?: string;
							customer_id?: number;
							group?: string;
							type?: string;
							responsible?: string;
							stage?: string;
							step?: string;
							limit?: number;
							offset?: number;
						};

						const qs: Record<string, any> = {};

						if (additionalFields.name) {
							qs.name = additionalFields.name;
						}

						if (additionalFields.process_number) {
							qs.process_number = additionalFields.process_number;
						}

						if (additionalFields.protocol_number) {
							qs.protocol_number = additionalFields.protocol_number;
						}

						if (additionalFields.customer_id) {
							qs.customer_id = additionalFields.customer_id;
						}

						if (additionalFields.group) {
							qs.group = additionalFields.group;
						}

						if (additionalFields.type) {
							qs.type = additionalFields.type;
						}

						if (additionalFields.responsible) {
							qs.responsible = additionalFields.responsible;
						}

						if (additionalFields.stage) {
							qs.stage = additionalFields.stage;
						}

						if (additionalFields.step) {
							qs.step = additionalFields.step;
						}

						if (additionalFields.limit) {
							qs.limit = additionalFields.limit;
						}

						if (additionalFields.offset) {
							qs.offset = additionalFields.offset;
						}

						const lawsuitOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/lawsuits`,
							qs,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',lawsuitOptions);
					}
					else if (operation === 'getTaskHistory') {
						// ----------------------------------
						//         lawsuit:getTaskHistory
						// ----------------------------------

						const lawsuitId = this.getNodeParameter('lawsuit_id', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							status?: string;
						};

						const qs: Record<string, any> = {};

						if (additionalFields.status) {
							qs.status = additionalFields.status;
						}

						const historyOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/history/${lawsuitId}/`,
							qs,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',historyOptions);
					}
else if (operation === 'update') {
	// ----------------------------------
	//         lawsuit:update
	// ----------------------------------

						const lawsuitId = this.getNodeParameter('lawsuitId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as {
							users_id?: string;
							stages_id?: string;
							type_lawsuits_id?: string;
							process_number?: string;
							protocol_number?: string;
							folder?: string;
							date?: string;
							notes?: string;
						};

						const body: Record<string, any> = {};

						// Adicionar apenas os campos que foram fornecidos
						Object.keys(updateFields).forEach(key => {
							if (updateFields[key as keyof typeof updateFields]) {
								body[key] = updateFields[key as keyof typeof updateFields];
							}
						});

						const updateOptions: IHttpRequestOptions = {
							method: 'PUT',
							url: `${credentials.apiUrl}/lawsuits/${lawsuitId}`,
							body,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',updateOptions);
					}

				}
				else if (resource === 'task') {
					// *********************************************************************
					//                            task
					// *********************************************************************

					if (operation === 'create') {
						// ----------------------------------
						//         task:create (VERSÃO COMPLETA)
						// ----------------------------------

						// Extrair parâmetros obrigatórios
						const from = this.getNodeParameter('from', i) as string;
						const tasks_id = this.getNodeParameter('tasks_id', i) as string;
						const lawsuits_id = this.getNodeParameter('lawsuits_id', i) as string;
						const start_date = this.getNodeParameter('start_date', i) as string;
						const guests = this.getNodeParameter('guests', i) as string;

						// Criar o objeto de dados da tarefa com os campos obrigatórios
						const taskData: Record<string, any> = {
							from,
							tasks_id,
							lawsuits_id,
							start_date,
							guests,
						};

						// Extrair e adicionar todos os campos opcionais
						// Campos de texto
						const textFields = [
							'comments',
							'start_time',
							'end_date',
							'end_time',
							'date_deadline',
							'local'
						];

						// Campos booleanos
						const booleanFields = [
							'urgent',
							'important',
							'display_schedule'
						];

						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

						// Processar campos de texto do additionalFields
						for (const field of textFields) {
							if (additionalFields[field] && typeof additionalFields[field] === 'string') {
								const value = (additionalFields[field] as string).trim();
								if (value !== '') {
									taskData[field] = value;
								}
							}
						}

						// Processar campos booleanos - só adiciona se true
						for (const field of booleanFields) {
							if (field in additionalFields) {
								let value = additionalFields[field];
								if (typeof value === 'string') {
									value = value.toLowerCase() === 'true';
								} else {
									value = !!value;
								}
								if (value === true) {
									taskData[field] = value;
								}
							}
						}

						// Usar o endpoint correto conforme documentação da API
						const taskOptions: IHttpRequestOptions = {
							method: 'POST',
							url: `${credentials.apiUrl}/posts`,
							body: taskData,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						// Fazer a requisição e retornar diretamente a resposta
						// Sem formatação adicional para evitar problemas
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',taskOptions);
					}
					else if (operation === 'get') {
						// ----------------------------------
						//         task:get
						// ----------------------------------

						const taskId = this.getNodeParameter('taskId', i) as string;

						const taskOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/posts/${taskId}`,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',taskOptions);
					}
					else if (operation === 'getHistory') {
						// ----------------------------------
						//         task:getHistory
						// ----------------------------------

						const lawsuitId = this.getNodeParameter('lawsuit_id', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							status?: string;
						};

						const qs: Record<string, any> = {};

						if (additionalFields.status) {
							qs.status = additionalFields.status;
						}
						// Garantir que o token de autenticação esteja presente e no formato correto
						if (!credentials.apiToken) {
							throw new Error('Token de autenticação não encontrado. Verifique suas credenciais.');
						}

						const historyOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/history/${lawsuitId}`,
							qs,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',historyOptions);
					}
					else if (operation === 'getTasks') {
						// ----------------------------------
						//         task:getTasks
						// ----------------------------------

						// Obter parâmetros adicionais com tratamento de erro mais robusto
						let additionalFields: {
							date_start?: string;
							date_end?: string;
							created_start?: string;
							created_end?: string;
							deadline_start?: string;
							deadline_end?: string;
							completed_start?: string;
							completed_end?: string;
							user_id?: string;
							user_name?: string;
							task_id?: string;
							id?: number;
							lawsuit_id?: string;
							limit?: number;
							offset?: number;
						} = {};

						try {
							additionalFields = this.getNodeParameter('additionalFields', i) as any || {};
						} catch (error) {
							additionalFields = {};
						}

						const qs: Record<string, any> = {};

						// Adiciona date_start e date_end apenas se forem fornecidos e não estiverem vazios
						if (additionalFields.date_start && additionalFields.date_start.trim() !== '') {
							qs.date_start = additionalFields.date_start.trim();
						}

						if (additionalFields.date_end && additionalFields.date_end.trim() !== '') {
							qs.date_end = additionalFields.date_end.trim();
						}

						if (additionalFields.completed_start) {
							qs.completed_start = additionalFields.completed_start;
						}

						if (additionalFields.completed_end) {
							qs.completed_end = additionalFields.completed_end;
						}

						if (additionalFields.user_id) {
							qs.user_id = additionalFields.user_id;
						}

						if (additionalFields.user_name) {
							qs.user_name = additionalFields.user_name;
						}

						// Adiciona created_start e created_end apenas se forem fornecidos e não estiverem vazios
						if (additionalFields.created_start && additionalFields.created_start.trim() !== '') {
							qs.created_start = additionalFields.created_start.trim();
						}

						if (additionalFields.created_end && additionalFields.created_end.trim() !== '') {
							qs.created_end = additionalFields.created_end.trim();
						}

						// Adiciona deadline_start e deadline_end apenas se forem fornecidos e não estiverem vazios
						if (additionalFields.deadline_start && additionalFields.deadline_start.trim() !== '') {
							qs.deadline_start = additionalFields.deadline_start.trim();
						}

						if (additionalFields.deadline_end && additionalFields.deadline_end.trim() !== '') {
							qs.deadline_end = additionalFields.deadline_end.trim();
						}

						if (additionalFields.task_id) {
							qs.task_id = additionalFields.task_id;
						}

						// Adiciona id se fornecido
						if (additionalFields.id && additionalFields.id > 0) {
							qs.id = additionalFields.id;
						}

						if (additionalFields.lawsuit_id) {
							qs.lawsuit_id = additionalFields.lawsuit_id;
						}

						if (additionalFields.limit) {
							qs.limit = additionalFields.limit;
						}

						if (additionalFields.offset) {
							qs.offset = additionalFields.offset;
						}

						const taskOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/posts`,
							qs,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						try {
							responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',taskOptions);
						} catch (error) {
							throw new NodeOperationError(this.getNode(),
								`Erro na requisição GET /posts: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Verifique os parâmetros e credenciais.`, 
								{
									description: 'Verifique se os parâmetros date_start e date_end estão no formato correto (yyyy-mm-dd) e se as credenciais são válidas.',
									itemIndex: i,
								}
							);
						}
					}
				}
				else if (resource === 'movement') {
					// *********************************************************************
					//                            movement
					// *********************************************************************

					if (operation === 'create') {
						// ----------------------------------
						//         movement:create
						// ----------------------------------

						const lawsuit_id = this.getNodeParameter('lawsuit_id', i) as string;
						const date = this.getNodeParameter('date', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						// Criar o objeto de dados do movimento com os campos separados
						const movementData = {
							lawsuit_id,
							date,
							description
						};

						// Usar o endpoint correto conforme documentação da API
						const movementOptions: IHttpRequestOptions = {
							method: 'POST',
							url: `${credentials.apiUrl}/lawsuits/movement`,
							body: movementData,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',movementOptions);
					}
					else if (operation === 'getHistory') {
						// ----------------------------------
						//         movement:getHistory
						// ----------------------------------

						const lawsuitId = this.getNodeParameter('lawsuit_id', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							origin?: string;
						};

						const qs: Record<string, any> = {};

						if (additionalFields.origin) {
							qs.origin = additionalFields.origin;
						}

						const historyOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/movements/${lawsuitId}`,
							qs,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi', historyOptions);
					}
				}

				else if (resource === 'transaction') {
					// *********************************************************************
					//                                TRANSACTION
					// *********************************************************************

					if (operation === 'getAll') {
						// ----------------------------------
						//         transaction:getAll
						// ----------------------------------

						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const qs: IDataObject = {};

						// Add filters from additionalFields
						if (additionalFields.process_number) {
							qs.process_number = additionalFields.process_number;
						}
						if (additionalFields.customer_identification) {
							qs.customer_identification = additionalFields.customer_identification;
						}
						if (additionalFields.responsible) {
							qs.responsible = additionalFields.responsible;
						}
						if (additionalFields.debit_bank) {
							qs.debit_bank = additionalFields.debit_bank;
						}
						if (additionalFields.lawsuit_id) {
							qs.lawsuit_id = additionalFields.lawsuit_id;
						}
						if (additionalFields.customer_name) {
							qs.customer_name = additionalFields.customer_name;
						}
						if (additionalFields.category) {
							qs.category = additionalFields.category;
						}
						if (additionalFields.description) {
							qs.description = additionalFields.description;
						}
						if (additionalFields.protocol_number) {
							qs.protocol_number = additionalFields.protocol_number;
						}
						if (additionalFields.cost_center) {
							qs.cost_center = additionalFields.cost_center;
						}
						if (additionalFields.competence_start) {
							qs.competence_start = additionalFields.competence_start;
						}
						if (additionalFields.competence_end) {
							qs.competence_end = additionalFields.competence_end;
						}
						if (additionalFields.created_start) {
							qs.created_start = additionalFields.created_start;
						}
						if (additionalFields.created_end) {
							qs.created_end = additionalFields.created_end;
						}
						if (additionalFields.date_due_start) {
							qs.date_due_start = additionalFields.date_due_start;
						}
						if (additionalFields.date_due_end) {
							qs.date_due_end = additionalFields.date_due_end;
						}
						if (additionalFields.date_payment_start) {
							qs.date_payment_start = additionalFields.date_payment_start;
						}
						if (additionalFields.date_payment_end) {
							qs.date_payment_end = additionalFields.date_payment_end;
						}
						if (additionalFields.limit) {
							qs.limit = additionalFields.limit;
						}
						if (additionalFields.offset) {
							qs.offset = additionalFields.offset;
						}

						const transactionOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/transactions`,
							qs,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',transactionOptions);
					}

					else if (operation === 'create') {
						// ----------------------------------
						//         transaction:create
						// ----------------------------------

						const entry_type = this.getNodeParameter('entry_type', i) as string;
						const users_id = this.getNodeParameter('users_id', i) as number;
						const debit_account = this.getNodeParameter('debit_account', i) as number;
						const categories_id = this.getNodeParameter('categories_id', i) as number;
						const cost_centers_id = this.getNodeParameter('cost_centers_id', i) as number;
						const amount = this.getNodeParameter('amount', i) as number;
						const date_due = this.getNodeParameter('date_due', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							entry_type,
							users_id,
							debit_account,
							categories_id,
							cost_centers_id,
							amount,
							date_due,
						};

						if (additionalFields.customers_id) {
							body.customers_id = additionalFields.customers_id;
						}
						if (additionalFields.lawsuits_id) {
							body.lawsuits_id = additionalFields.lawsuits_id;
						}
						if (additionalFields.sectors_id) {
							body.sectors_id = additionalFields.sectors_id;
						}
						if (additionalFields.description) {
							body.description = additionalFields.description;
						}
						if (additionalFields.date_payment) {
							body.date_payment = additionalFields.date_payment;
						}

						const createOptions: IHttpRequestOptions = {
							method: 'POST',
							url: `${credentials.apiUrl}/transactions`,
							body,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',createOptions);
					}

					else if (operation === 'update') {
						// ----------------------------------
						//         transaction:update
						// ----------------------------------

						const transactionId = this.getNodeParameter('transactionId', i) as number;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.entry_type) {
							body.entry_type = updateFields.entry_type;
						}
						if (updateFields.categories_id) {
							body.categories_id = updateFields.categories_id;
						}
						if (updateFields.amount) {
							body.amount = updateFields.amount;
						}
						if (updateFields.date_due) {
							body.date_due = updateFields.date_due;
						}
						if (updateFields.date_payment !== undefined) {
							body.date_payment = updateFields.date_payment || null;
						}
						if (updateFields.description) {
							body.description = updateFields.description;
						}
						if (updateFields.competence) {
							body.competence = updateFields.competence;
						}

						const updateOptions: IHttpRequestOptions = {
							method: 'PUT',
							url: `${credentials.apiUrl}/transactions/${transactionId}`,
							body,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi',updateOptions);
					}
				}
				else if (resource === 'settings') {
					// *********************************************************************
					//                            settings
					// *********************************************************************

					if (operation === 'get') {
						const settingsOptions: IHttpRequestOptions = {
							method: 'GET',
							url: `${credentials.apiUrl}/settings`,
							headers: {
								'Accept': 'application/json',
								...((credentials.xAgent as string) ? { 'x-agent': credentials.xAgent as string } : {}),
							},
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'advboxApi', settingsOptions);
					}
				}

				// CORREÇÃO PRINCIPAL: Processamento seguro da resposta
				// Garantir que sempre retornamos um array válido
				let processedData: any;

				// Verificar se responseData é válido
				if (responseData === null || responseData === undefined) {
					processedData = { success: true, message: 'Operation completed successfully' };
				} else {
					processedData = responseData;
				}

				// Sempre converter para array se não for um array
				const dataArray = Array.isArray(processedData) ? processedData : [processedData];

				// Converter cada item para o formato esperado pelo n8n
				const formattedData = dataArray.map((item: any) => {
					// Se o item já está no formato correto, manter
					if (item && typeof item === 'object' && item.json) {
						return item;
					}
					// Caso contrário, envolver no formato esperado
					return {
						json: item || {},
					};
				});

				// Construir os dados de execução de forma segura
				const executionData = this.helpers.constructExecutionMetaData(
					formattedData,
					{ itemData: { item: i } }
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					// Em caso de erro, criar um objeto de erro válido
					const currentResource = this.getNodeParameter('resource', i, 'unknown') as string;
					const currentOperation = this.getNodeParameter('operation', i, 'unknown') as string;
					
					const errorData = [{
						json: { 
							error: error instanceof Error ? error.message : 'Erro desconhecido',
							resource: currentResource,
							operation: currentOperation,
							itemIndex: i
						}
					}];

					const executionData = this.helpers.constructExecutionMetaData(
						errorData,
						{ itemData: { item: i } }
					);
					returnData.push(...executionData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error instanceof Error ? error : new Error(String(error)), {
					itemIndex: i,
				});
			}
		}

		// Garantir que sempre retornamos dados válidos
		if (returnData.length === 0) {
			returnData.push({
				json: { success: true, message: 'No data processed' },
				pairedItem: { item: 0 }
			});
		}

		return [returnData];
	}
}
