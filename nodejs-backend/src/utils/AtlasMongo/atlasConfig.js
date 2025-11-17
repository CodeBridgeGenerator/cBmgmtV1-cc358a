// config/atlasConfig.js
require("dotenv").config();

const ATLAS_CONFIG = {
  // API Credentials
  credentials: {
    publicKey: process.env.ATLAS_PUBLIC_KEY,
    privateKey: process.env.ATLAS_PRIVATE_KEY,
    projectId: process.env.ATLAS_GROUP_ID,
  },

  // API Endpoints
  endpoints: {
    baseURL:
      process.env.ATLAS_BASE_URL || "https://cloud.mongodb.com/api/atlas/v1.0",
    region: process.env.ATLAS_REGION || "US", // US, EU, ASIA
    environment: process.env.ATLAS_ENV || "CLOUD_MANAGER", // CLOUD_MANAGER, LEGACY, REGIONAL
  },

  // Request Configuration
  request: {
    timeout: parseInt(process.env.ATLAS_TIMEOUT) || 30000,
    retries: parseInt(process.env.ATLAS_RETRIES) || 3,
    retryDelay: parseInt(process.env.ATLAS_RETRY_DELAY) || 1000,
  },

  // Rate Limiting
  rateLimit: {
    requestsPerMinute: parseInt(process.env.ATLAS_RATE_LIMIT) || 100,
    enabled: process.env.ATLAS_RATE_LIMIT_ENABLED !== "false",
  },
};

// Validate required environment variables
function validateConfig() {
  const required = ["ATLAS_PUBLIC_KEY", "ATLAS_PRIVATE_KEY", "ATLAS_GROUP_ID"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Atlas environment variables: ${missing.join(", ")}`,
    );
  }
}

const ATLAS_ENDPOINTS = {
  // Main Cloud Manager API (Current)
  CLOUD_MANAGER: {
    baseURL: "https://cloud.mongodb.com/api/atlas/v2",
    description: "Main Atlas API for cluster management",
  },

  // Legacy URLs (still supported)
  LEGACY: {
    baseURL: "https://cloud.mongodb.com/api/atlas/v1",
    description: "Legacy Atlas API endpoint",
  },

  // Regional endpoints for compliance
  REGIONAL: {
    US: "https://cloud.mongodb.com/api/atlas/v1.0",
    EU: "https://cloud-eu.mongodb.com/api/atlas/v1.0",
    ASIA: "https://cloud-asia.mongodb.com/api/atlas/v1.0",
  },

  // Data API (for document operations)
  DATA_API: {
    baseURL: "https://data.mongodb-api.com/app/{appId}/endpoint/data/v1",
    description: "Atlas Data API for document operations",
  },

  // GraphQL API
  GRAPHQL: {
    baseURL: "https://realm.mongodb.com/api/client/v2.0/app/{appId}/graphql",
    description: "Atlas GraphQL API",
  },

  // App Services (Realm)
  APP_SERVICES: {
    baseURL: "https://services.cloud.mongodb.com",
    description: "Atlas App Services API",
  },

  // Webhook endpoints
  WEBHOOKS: {
    baseURL: "https://webhooks.mongodb-realm.com/api/client/v2.0/app/{appId}",
    description: "Atlas Webhooks endpoint",
  },
};

// Full endpoint templates
const ATLAS_ENDPOINT_TEMPLATES = {
  // Cluster management
  CLUSTERS: "/groups/{groupId}/clusters",
  CLUSTER_BY_NAME: "/groups/{groupId}/clusters/{clusterName}",

  // Database users
  DATABASE_USERS: "/groups/{groupId}/databaseUsers",
  DATABASE_USER: "/groups/{groupId}/databaseUsers/admin/{username}",

  // Network access
  NETWORK_ACCESS: "/groups/{groupId}/accessList",
  NETWORK_ENTRY: "/groups/{groupId}/accessList/{entry}",

  // Backups
  BACKUPS: "/groups/{groupId}/clusters/{clusterName}/backup",
  SNAPSHOTS: "/groups/{groupId}/clusters/{clusterName}/snapshots",
  SNAPSHOT: "/groups/{groupId}/clusters/{clusterName}/snapshots/{snapshotId}",

  // Alerts
  ALERTS: "/groups/{groupId}/alerts",
  ALERT: "/groups/{groupId}/alerts/{alertId}",

  // Events
  EVENTS: "/groups/{groupId}/events",

  // Billing
  BILLING: "/groups/{groupId}/billing",
  INVOICES: "/groups/{groupId}/invoices",
  CURRENT_INVOICE: "/groups/{groupId}/invoices/current",
  USAGE: "/groups/{groupId}/billing/usage",
  COSTS: "/groups/{groupId}/billing/costs",

  // Search indexes (Vector Search)
  SEARCH_INDEXES: "/groups/{groupId}/clusters/{clusterName}/fts/indexes",
  SEARCH_INDEX:
    "/groups/{groupId}/clusters/{clusterName}/fts/indexes/{indexId}",
  SEARCH:
    "/groups/{groupId}/clusters/{clusterName}/fts/indexes/{indexId}/search",

  // Measurements (Metrics)
  MEASUREMENTS: "/groups/{groupId}/clusters/{clusterName}/measurements",

  // Projects
  PROJECTS: "/groups",
  PROJECT: "/groups/{groupId}",
};

module.exports = {
  ATLAS_ENDPOINTS,
  ATLAS_ENDPOINT_TEMPLATES,
  ATLAS_CONFIG,
  validateConfig,
};
