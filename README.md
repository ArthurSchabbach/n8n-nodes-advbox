# n8n-nodes-advbox

This is an n8n community node for [ADVBOX](https://www.advbox.com.br/) API integration. It lets you manage customers, lawsuits, tasks, movements, transactions and settings directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation) |
[Credentials](#credentials) |
[Operations](#operations) |
[Development](#development) |
[License](#license)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Via n8n UI

1. Go to **Settings > Community Nodes**
2. Click on **Install**
3. Enter `n8n-nodes-advbox` in the **npm Package Name** field
4. Click on **Install**

### Via npm

```bash
npm install n8n-nodes-advbox
```

## Credentials

To use the ADVBOX node, create credentials with:

| Field | Required | Description |
|-------|----------|-------------|
| **API Token** | Yes | Your ADVBOX API token |
| **API URL** | Yes | The ADVBOX API URL (default: `https://app.advbox.com.br/api/v1`) |
| **Agent Identifier** | No | Optional identifier sent as `x-agent` header |

## Operations

### Customer

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new customer |
| **Get by ID** | Get a customer by ID |
| **Get Many** | List customers with filters (name, phone, identification, document, email, city, state, occupation, date range) |
| **Get Birthdays** | Get customers with birthdays in the current month |

### Lawsuit

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new lawsuit |
| **Get by ID** | Get a lawsuit by ID |
| **Get Many** | List lawsuits with filters (name, process number, protocol number, customer, group, type, responsible, stage) |
| **Get Task History** | Get the task history for a lawsuit |
| **Update** | Update an existing lawsuit |

### Task

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new task with optional comments, scheduling, urgency and importance flags |
| **Get Tasks** | List tasks with filters (date range, user, lawsuit, deadline, completion status) |

### Movement

| Operation | Description |
|-----------|-------------|
| **Create** | Create a manual movement for a lawsuit |
| **Get History** | Get movement history for a lawsuit |

### Transaction

| Operation | Description |
|-----------|-------------|
| **Get All** | List transactions with filters (process number, customer, responsible, category, cost center, date ranges) |
| **Create** | Create a new financial transaction |
| **Update** | Update an existing transaction |

### Settings

| Operation | Description |
|-----------|-------------|
| **Get** | Retrieve account settings (users, origins, task types, stages, lawsuit types) |

## Development

```bash
# Clone the repository
git clone https://github.com/ArthurSchabbach/n8n-nodes-advbox.git
cd n8n-nodes-advbox

# Install dependencies
npm install

# Lint
npm run lint

# Build
npm run build

# Link to your local n8n installation
npm link
# In your n8n installation directory:
npm link n8n-nodes-advbox
```

## License

[MIT](LICENSE)
