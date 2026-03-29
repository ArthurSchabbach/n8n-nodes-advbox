# ADVBOX - Make.com Custom App

Integration with the ADVBOX legal case management API for Make.com (formerly Integromat).

## Structure

```
nodes-make/
├── base/                        # Base URL, headers, auth
├── connections/advbox-api/      # Connection (API Token + x-agent)
├── modules/
│   ├── create-customer/         # POST /customers
│   ├── get-customer/            # GET /customers/{id}
│   ├── get-customers/           # GET /customers
│   ├── create-lawsuit/          # POST /lawsuits
│   ├── get-lawsuit/             # GET /lawsuits/{id}
│   ├── get-lawsuits/            # GET /lawsuits
│   ├── update-lawsuit/          # PUT /lawsuits/{id}
│   ├── create-task/             # POST /posts
│   ├── get-tasks/               # GET /posts
│   ├── create-movement/         # POST /lawsuits/movement
│   ├── get-movement-history/    # GET /movements/{id}
│   ├── get-settings/            # GET /settings
│   ├── create-transaction/      # POST /transactions
│   ├── get-transactions/        # GET /transactions
│   └── update-transaction/      # PUT /transactions/{id}
├── rpcs/
│   ├── load-users/              # Dynamic dropdown: users
│   ├── load-customer-origins/   # Dynamic dropdown: customer origins
│   ├── load-task-types/         # Dynamic dropdown: task types
│   ├── load-stages/             # Dynamic dropdown: stages
│   ├── load-lawsuit-groups/     # Dynamic dropdown: lawsuit groups
│   └── load-lawsuit-types/      # Dynamic dropdown: lawsuit types
└── webhooks/                    # (future: instant triggers)
```

## Setup

### Option 1: Make.com Browser Editor
1. Go to Make.com → My Apps → Create a new app
2. Name: "ADVBOX"
3. Copy the JSON configurations from each directory into the corresponding sections

### Option 2: VS Code Extension
1. Install the `Integromat.apps-sdk` extension in VS Code
2. Connect to your Make.com account
3. Create the app on Make.com first
4. Use the extension to sync local files to Make

## Authentication
- **API Token**: Bearer token (required)
- **x-agent**: Optional agent identifier header

## API Base URL
`https://app.advbox.com.br/api/v1`
