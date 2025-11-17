/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
const BaseResReqBinding = require("../BaseResReqBinding");
const urllib = require("urllib");

class AtlasService extends BaseResReqBinding {
  constructor() {
    super();
    this.baseURL = process.env.ATLAS_BASE_URL;
    this.publicKey = process.env.ATLAS_PUBLIC_KEY;
    this.privateKey = process.env.ATLAS_PRIVATE_KEY;
    this.groupId = process.env.ATLAS_GROUP_ID;
    this.clusterProviderName = process.env.CLUSTER_PROVIDER_NAME;
    this.clusterRegion = process.env.CLUSTER_REGION;
    this.clusterTier = process.env.CLUSTER_TIER;
    // this.services = ["api", "service", "hook", "socket"];
    this.services = ["api"];
  }

  async initializeHandlers() {
    // Register handlers for API calls
    this.registerHandler(
      "api",
      "createCluster",
      this.handleCreateCluster.bind(this),
    );
    this.registerHandler(
      "api",
      "deleteCluster",
      this.handleDeleteCluster.bind(this),
    );
    this.registerHandler("api", "createUser", this.handleCreateUser.bind(this));
    this.registerHandler("api", "deleteUser", this.handleDeleteUser.bind(this));
    this.registerHandler("api", "getBilling", this.handleGetBilling.bind(this));
    this.registerHandler(
      "api",
      "createVectorIndex",
      this.handleCreateVectorIndex.bind(this),
    );

    // Register handlers for Hooks
    this.registerHandler(
      "hook",
      "clusterStatusChange",
      this.handleClusterStatusHook.bind(this),
    );
    this.registerHandler(
      "hook",
      "billingAlert",
      this.handleBillingAlertHook.bind(this),
    );
    this.registerHandler(
      "hook",
      "backupComplete",
      this.handleBackupCompleteHook.bind(this),
    );

    this.registerHandler(
      "api",
      "getProjects",
      this.handleGetProjects.bind(this),
    );

    // Register handlers for Service queries
    // this.services.forEach((service) => {
    //   this.registerHandler(
    //     service,
    //     "findClusters",
    //     this.handleFindClusters.bind(this),
    //   );
    //   this.registerHandler(
    //     service,
    //     "aggregateMetrics",
    //     this.handleAggregateMetrics.bind(this),
    //   );
    //   this.registerHandler(
    //     service,
    //     "updateClusterConfig",
    //     this.handleUpdateClusterConfig.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "createSearchIndex",
    //     this.handleCreateSearchIndex.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "deleteSearchIndex",
    //     this.handleDeleteSearchIndex.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "vectorSearch",
    //     this.handleVectorSearch.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "getNetworkAccess",
    //     this.handleGetNetworkAccess.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "addNetworkAccess",
    //     this.handleAddNetworkAccess.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "getAlerts",
    //     this.handleGetAlerts.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "getAlertId",
    //     this.handleGetAlert.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "getProjects",
    //     this.handleGetProjects.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "getProject",
    //     this.handleGetProject.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "getSnapshots",
    //     this.handleGetSnapshots.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "getSnapshot",
    //     this.handleGetSnapshot.bind(this),
    //   );

    //   this.registerHandler(
    //     service,
    //     "createSnapshot",
    //     this.handleCreateSnapshot.bind(this),
    //   );
    // });

    // Register handlers for Socket connections
    this.registerHandler(
      "socket",
      "monitorCluster",
      this.handleMonitorCluster.bind(this),
    );
    this.registerHandler(
      "socket",
      "realTimeMetrics",
      this.handleRealTimeMetrics.bind(this),
    );
    this.registerHandler(
      "socket",
      "clusterEvents",
      this.handleClusterEvents.bind(this),
    );

    // Register handlers for Cron jobs
    this.registerHandler(
      "cron",
      "cleanupOldBackups",
      this.handleCleanupBackups.bind(this),
    );
    this.registerHandler(
      "cron",
      "updateBillingData",
      this.handleUpdateBillingData.bind(this),
    );
    this.registerHandler(
      "cron",
      "healthCheckClusters",
      this.handleHealthCheckClusters.bind(this),
    );
  }

  async initializeResponseProcessors() {
    // API response processor
    this.registerResponseProcessor("api", this.processApiResponse.bind(this));

    // Hook response processor
    this.registerResponseProcessor("hook", this.processHookResponse.bind(this));

    // Service response processor
    this.registerResponseProcessor(
      "service",
      this.processServiceResponse.bind(this),
    );

    // Socket response processor
    this.registerResponseProcessor(
      "socket",
      this.processSocketResponse.bind(this),
    );

    // Cron response processor
    this.registerResponseProcessor("cron", this.processCronResponse.bind(this));
  }

  async makeDirectRequert(method, endpoint, data = "", options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;

      const config = {
        method,
        digestAuth: `${this.publicKey}:${this.privateKey}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.atlas.2024-08-05+json",
          ...options.headers,
        },
        timeout: options.timeout || 30000,
      };

      if (data) {
        config.data = data;
      }

      const response = await urllib.request(url, config);
      return JSON.parse(response.data);
    } catch (error) {
      const atlasError = this.parseAtlasError(error);
      throw atlasError;
    }
  }

  // Make Atlas API request (common for all sources)
  async makeRequest(method, endpoint, data = null, options = {}) {
    
    try {
      const url = `${this.baseURL}/groups/${this.groupId}${endpoint}`;
      const config = {
        method,
        digestAuth: `${this.publicKey}:${this.privateKey}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.atlas.2024-08-05+json",
          ...options.headers,
        },
        timeout: options.timeout || 30000,
      };

      if (data) {
        config.data = data;
      }
      if(!endpoint) return null;
      
      const response = await urllib.request(url, config);
      return JSON.parse(response.data);
    } catch (error) {
      const atlasError = this.parseAtlasError(error);
      throw atlasError;
    }
  }

  // ========== API HANDLERS ==========
  async handleCreateCluster(payload, context) {
    const { clusterName, tier, region, provider } = payload;

    const clusterData = {
      name: clusterName,
      providerSettings: {
        providerName: this.clusterProviderName || "AWS",
        regionName: this.clusterRegion || "US_EAST_1",
        instanceSizeName: this.clusterTier || "M0",
      },
      clusterType: "REPLICASET",
    };

    return await this.makeRequest("post", "/clusters", clusterData);
  }

  async handleDeleteCluster(payload, context) {
    const { clusterName } = payload;
    return await this.makeRequest("delete", `/clusters/${clusterName}`);
  }

  async handleCreateUser(payload, context) {
    const { username, password, databaseName, roles } = payload;

    const userData = {
      databaseName: databaseName || "admin",
      roles: roles || [
        { roleName: "readWrite", databaseName: databaseName || "admin" },
      ],
      username,
      password,
    };

    return await this.makeRequest("post", "/databaseUsers", userData);
  }

  async handleDeleteUser(payload, context) {
    const { username } = payload;
    return await this.makeRequest("delete", `/databaseUsers/admin/${username}`);
  }

  async handleGetBilling(payload, context) {
    const { startDate, endDate } = payload;
    let endpoint = "/billing";

    if (startDate && endDate) {
      endpoint += `/usage?startDate=${startDate}&endDate=${endDate}`;
    }

    return await this.makeRequest("get", endpoint);
  }

  // Get Current Invoice
  async getCurrentInvoice(payload, context) {
    return await this.makeRequest("get", "/invoices/current");
  }

  // Get Invoice by ID
  async getInvoiceById(payload, context) {
    const { invoiceId } = payload;
    return await this.makeRequest("get", `/invoices/${invoiceId}`);
  }

  // Get All Invoices
  async getAllInvoices(payload, context) {
    return await this.makeRequest("get", "/invoices");
  }

  async getProjectCosts(payload, context) {
    const { startDate, endDate } = payload;
    let endpoint = "/billing/costs/projects";
    if (startDate && endDate) {
      endpoint += `/billing/costs/projects?startDate=${startDate}&endDate=${endDate}`;
    }

    return await this.makeRequest("get", endpoint);
  }

  // Get Detailed Usage for Specific Period
  async getDetailedUsage(payload, context) {
    const { startDate, endDate } = payload;
    const endpoint = `/billing/usage?startDate=${startDate}&endDate=${endDate}`;
    return await this.makeRequest("get", endpoint);
  }

  // Get Cost Breakdown by Service Type
  async getCostBreakdown(payload, context) {
    const { startDate, endDate } = payload;
    const endpoint = `/billing/costs?startDate=${startDate}&endDate=${endDate}`;
    return await this.makeRequest("get", endpoint);
  }

  // Get Storage Usage Metrics
  async getStorageUsage(payload, context) {
    const { clusterName, startDate, endDate, granularity = "DAILY" } = payload;
    const endpoint = `/clusters/${clusterName}/measurements?granularity=${granularity}&period=PT1M&start=${startDate}&end=${endDate}&m=MAX_DISK_USAGE,MAX_DISK_PARTITION_SPACE_USED`;
    return await this.makeRequest("get", endpoint);
  }

  // Get Network Traffic Metrics
  async getNetworkTraffic(payload, context) {
    const { clusterName, startDate, endDate, granularity = "DAILY" } = payload;
    const endpoint = `/clusters/${clusterName}/measurements?granularity=${granularity}&period=PT1M&start=${startDate}&end=${endDate}&m=NETWORK_BYTES_IN,NETWORK_BYTES_OUT`;
    return await this.makeRequest("get", endpoint);
  }

  // Get Compute Usage Metrics
  async getComputeUsage(payload, context) {
    const { clusterName, startDate, endDate, granularity = "DAILY" } = payload;
    const endpoint = `/clusters/${clusterName}/measurements?granularity=${granularity}&period=PT1M&start=${startDate}&end=${endDate}&m=CPU_USER,CPU_KERNEL,MEMORY_RESIDENT`;
    return await this.makeRequest("get", endpoint);
  }

  async handleCreateVectorIndex(payload, context) {
    const { clusterName, databaseName, collectionName, config } = payload;

    return await this.makeRequest(
      "post",
      `/clusters/${clusterName}/fts/indexes`,
      {
        collectionName,
        database: databaseName,
        ...config,
      },
    );
  }

  // ========== HOOK HANDLERS ==========
  async handleClusterStatusHook(payload, context) {
    const { clusterName, previousState, currentState } = payload;

    // Process cluster state change
    this.emit("clusterStateChanged", {
      clusterName,
      previousState,
      currentState,
      timestamp: new Date().toISOString(),
    });

    return {
      processed: true,
      action: this.determineClusterAction(previousState, currentState),
      notification: `Cluster ${clusterName} changed from ${previousState} to ${currentState}`,
    };
  }

  async handleBillingAlertHook(payload, context) {
    const { amount, threshold, period } = payload;

    // Process billing alert
    this.emit("billingThresholdExceeded", {
      amount,
      threshold,
      period,
      timestamp: new Date().toISOString(),
    });

    return {
      alert: "BILLING_THRESHOLD_EXCEEDED",
      amount,
      threshold,
      recommendedActions: [
        "Review usage",
        "Optimize clusters",
        "Set up budgets",
      ],
    };
  }

  async handleBackupCompleteHook(payload, context) {
    const { clusterName, snapshotId, status } = payload;

    return {
      backupCompleted: true,
      clusterName,
      snapshotId,
      status,
      timestamp: new Date().toISOString(),
    };
  }

  // ========== SERVICE QUERY HANDLERS ==========
  async handleFindClusters(payload, context) {
    const { filter = {}, projection = {}, options = {} } = payload;

    // This would typically query a database, but for now use Atlas API
    const clusters = await this.makeRequest("get", "/clusters");

    // Apply filtering logic
    let results = clusters.results || [];
    if (filter.tier) {
      results = results.filter(
        (cluster) => cluster.providerSettings.instanceSizeName === filter.tier,
      );
    }

    if (filter.status) {
      results = results.filter(
        (cluster) => cluster.stateName === filter.status,
      );
    }

    return {
      clusters: results,
      total: results.length,
      query: { filter, projection, options },
    };
  }

  async handleAggregateMetrics(payload, context) {
    const { metricType, timeRange, clusters } = payload;

    // Aggregate metrics from multiple clusters
    const metrics = await Promise.all(
      clusters.map(async (clusterName) => {
        const clusterMetrics = await this.makeRequest(
          "get",
          `/clusters/${clusterName}/measurements?period=PT1H&hours=24`,
        );
        return {
          clusterName,
          metrics: this.processClusterMetrics(clusterMetrics),
        };
      }),
    );

    return {
      metricType,
      timeRange,
      aggregatedMetrics: this.aggregateAcrossClusters(metrics),
      clusters: metrics,
    };
  }

  async handleUpdateClusterConfig(payload, context) {
    const { clusterName, updates, validationRules } = payload;

    // Validate updates against rules
    const validationResult = this.validateClusterUpdates(
      updates,
      validationRules,
    );
    if (!validationResult.valid) {
      throw new Error(
        `Validation failed: ${validationResult.errors.join(", ")}`,
      );
    }

    // Apply updates
    return await this.makeRequest("patch", `/clusters/${clusterName}`, updates);
  }

  // Search index operations
  async handleCreateSearchIndex(payload, context) {
    const { clusterName, indexConfig } = payload;

    return await this.makeRequest(
      "post",
      `/clusters/${clusterName}`,
      indexConfig,
    );
  }

  async handleGetSearchIndexes(payload, context) {
    const { clusterName } = payload;
    return await this.makeRequest("get", `/clusters/${clusterName}`);
  }

  async handleDeleteSearchIndex(payload, context) {
    const { clusterName, indexId } = payload;
    return await this.makeRequest(
      "delete",
      `/clusters/${clusterName}`,
      indexId,
    );
  }

  // Vector search query
  async handleVectorSearch(payload, context) {
    const { clusterName, indexId, searchQuery } = payload;
    return await this.makeRequest(
      "post",
      `/clusters/${clusterName}/${indexId}`,
      searchQuery,
    );
  }

  // Network access operations
  async handleGetNetworkAccess(payload, context) {
    return await this.makeRequest("get", "/accessList");
  }

  async handleAddNetworkAccess(payload, context) {
    const { ipAddress, comment = "" } = payload;
    const entryData = {
      ipAddress,
      comment,
      deleteAfterDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 7 days
    };
    return await this.makeRequest("post", "/accessList", entryData);
  }

  // Alert operations
  async handleGetAlerts(payload, context) {
    return await this.makeRequest("get", "/alerts");
  }

  async handleGetAlert(payload, context) {
    const { alertId } = payload;
    return await this.makeRequest("get", `/alerts/${alertId}`);
  }

  // Project operations
  async handleGetProjects(payload, context) {
    return await this.makeDirectRequert("get", "/groups");
  }

  async handleGetProject(payload, context) {
    const { projectId } = payload;
    const id = projectId || this.groupId;
    return await this.makeDirectRequert("get", `/groups/${id}`);
  }

  // Backup operations
  async handleGetSnapshots(payload, context) {
    const { clusterName } = payload;
    return await this.makeRequest("get", `/clusters/${clusterName}/snapshots`);
  }

  async handleGetSnapshot(payload, context) {
    const { clusterName, snapshotId } = payload;
    return await this.makeRequest(
      "get",
      `/clusters/${clusterName}/snapshots/${snapshotId}`,
    );
  }

  async handleCreateSnapshot(payload, context) {
    const { clusterName, description = "" } = payload;
    const snapshotData = {
      description: description || `Snapshot ${new Date().toISOString()}`,
    };
    return await this.makeRequest(
      "post",
      `/clusters/${clusterName}/snapshots`,
      snapshotData,
    );
  }

  // ========== SOCKET HANDLERS ==========
  async handleMonitorCluster(payload, context) {
    const { clusterName, metrics, interval } = payload;

    // Set up real-time monitoring
    const monitorData = await this.getRealTimeClusterMetrics(
      clusterName,
      metrics,
    );

    return {
      type: "MONITOR_DATA",
      clusterName,
      metrics: monitorData,
      interval,
      timestamp: new Date().toISOString(),
    };
  }

  async handleRealTimeMetrics(payload, context) {
    const { clusterNames, metricTypes } = payload;

    const realTimeData = await Promise.all(
      clusterNames.map(async (clusterName) => ({
        clusterName,
        metrics: await this.fetchRealTimeMetrics(clusterName, metricTypes),
      })),
    );

    return {
      type: "REAL_TIME_METRICS",
      data: realTimeData,
      timestamp: new Date().toISOString(),
    };
  }

  async handleClusterEvents(payload, context) {
    const { clusterName, eventTypes, since } = payload;

    const events = await this.makeRequest(
      "get",
      `/clusters/${clusterName}/events?since=${since}`,
    );

    const filteredEvents = events.results.filter((event) =>
      eventTypes.includes(event.eventTypeName),
    );

    return {
      type: "CLUSTER_EVENTS",
      clusterName,
      events: filteredEvents,
      count: filteredEvents.length,
    };
  }

  // ========== CRON JOB HANDLERS ==========
  async handleCleanupBackups(payload, context) {
    const { retentionDays = 30 } = payload;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const clusters = await this.makeRequest("get", "/clusters");
    const cleanupResults = [];

    for (const cluster of clusters.results) {
      const snapshots = await this.makeRequest(
        "get",
        `/clusters/${cluster.name}/snapshots`,
      );

      const oldSnapshots = snapshots.results.filter(
        (snapshot) => new Date(snapshot.createdAt) < cutoffDate,
      );

      for (const snapshot of oldSnapshots) {
        await this.makeRequest(
          "delete",
          `/clusters/${cluster.name}/snapshots/${snapshot.id}`,
        );
        cleanupResults.push({
          cluster: cluster.name,
          snapshot: snapshot.id,
          createdAt: snapshot.createdAt,
          deleted: true,
        });
      }
    }

    return {
      job: "BACKUP_CLEANUP",
      retentionDays,
      cleanedUp: cleanupResults.length,
      results: cleanupResults,
    };
  }

  async handleUpdateBillingData(payload, context) {
    const { forceRefresh = false } = payload;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const billingData = await this.makeRequest("get", "/billing");
    const usageData = await this.makeRequest("get", `/billing/usage`);

    // Store or process billing data
    const processedBilling = this.processBillingData(billingData, usageData);

    return {
      job: "BILLING_UPDATE",
      month: currentMonth,
      billing: processedBilling,
      updated: true,
      timestamp: new Date().toISOString(),
    };
  }

  async handleHealthCheckClusters(payload, context) {
    const clusters = await this.makeRequest("get", "/clusters");
    const healthResults = [];

    for (const cluster of clusters.results) {
      const health = await this.checkClusterHealth(cluster.name);
      healthResults.push({
        clusterName: cluster.name,
        status: cluster.stateName,
        health: health.status,
        issues: health.issues,
        lastChecked: new Date().toISOString(),
      });
    }

    return {
      job: "HEALTH_CHECK",
      totalClusters: clusters.results.length,
      healthy: healthResults.filter((h) => h.health === "HEALTHY").length,
      results: healthResults,
    };
  }

  // ========== RESPONSE PROCESSORS ==========
  async processApiResponse(result, type, context) {
    return {
      success: true,
      data: result,
      type: type.toUpperCase(),
      timestamp: new Date().toISOString(),
      ...(context.requestId && { requestId: context.requestId }),
    };
  }

  async processHookResponse(result, type, context) {
    return {
      processed: true,
      hookType: type,
      result,
      context: {
        event: context.event,
        hookId: context.hookId,
        source: context.source,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // ========== RESPONSE SERVICES ==========
  async processServiceResponse(result, type, context) {
    return {
      queryResult: true,
      queryType: type,
      data: result,
      executionTime: context.executionTime,
      timestamp: new Date().toISOString(),
    };
  }

  // ========== RESPONSE SOCKETS ==========
  async processSocketResponse(result, type, context) {
    return {
      event: type,
      data: result,
      socketId: context.socketId,
      room: context.room,
      timestamp: new Date().toISOString(),
    };
  }

  // ========== RESPONSE CRON ==========
  async processCronResponse(result, type, context) {
    return {
      jobCompleted: true,
      jobType: type,
      result,
      jobId: context.jobId,
      nextRun: context.nextRun,
      executionCount: context.executionCount,
      timestamp: new Date().toISOString(),
    };
  }

  // ========== UTILITY METHODS ==========
  determineClusterAction(previousState, currentState) {
    const actions = {
      "IDLE->CREATING": "MONITOR_CREATION",
      "CREATING->IDLE": "SETUP_COMPLETE",
      "IDLE->UPDATING": "MONITOR_UPDATE",
      "UPDATING->IDLE": "UPDATE_COMPLETE",
      "IDLE->DELETING": "FINAL_BACKUP",
      "DELETING->IDLE": "CLEANUP_RESOURCES",
    };

    const key = `${previousState}->${currentState}`;
    return actions[key] || "NO_ACTION";
  }

  processClusterMetrics(metrics) {
    // Process and normalize cluster metrics
    return metrics.measurements.reduce((acc, measurement) => {
      acc[measurement.name] = {
        unit: measurement.units,
        dataPoints: measurement.dataPoints,
      };
      return acc;
    }, {});
  }

  aggregateAcrossClusters(clusterMetrics) {
    // Aggregate metrics across multiple clusters
    return clusterMetrics.reduce((acc, cluster) => {
      Object.keys(cluster.metrics).forEach((metric) => {
        if (!acc[metric]) acc[metric] = [];
        acc[metric].push(...cluster.metrics[metric].dataPoints);
      });
      return acc;
    }, {});
  }

  validateClusterUpdates(updates, rules) {
    const errors = [];

    if (rules.preventDowngrade && updates.providerSettings) {
      const currentTier = rules.currentTier;
      const newTier = updates.providerSettings.instanceSizeName;
      if (this.isTierDowngrade(currentTier, newTier)) {
        errors.push("Cluster tier downgrade not allowed");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  isTierDowngrade(current, proposed) {
    const tierOrder = ["M0", "M2", "M5", "M10", "M20", "M30", "M40", "M50"];
    return tierOrder.indexOf(proposed) < tierOrder.indexOf(current);
  }

  async getRealTimeClusterMetrics(clusterName, metrics) {
    const endpoint = `/clusters/${clusterName}/measurements?period=PT1M&hours=1`;
    const data = await this.makeRequest("get", endpoint);

    return metrics.reduce((acc, metric) => {
      const measurement = data.measurements.find((m) => m.name === metric);
      if (measurement) {
        acc[metric] = measurement.dataPoints.slice(-1)[0]?.value || 0;
      }
      return acc;
    }, {});
  }

  async fetchRealTimeMetrics(clusterName, metricTypes) {
    // Fetch latest metrics for the cluster
    const measurements = await Promise.all(
      metricTypes.map(async (metric) => {
        const data = await this.makeRequest(
          "get",
          `/clusters/${clusterName}/measurements?period=PT1M&m=${metric}`,
        );
        return {
          metric,
          value: data.measurements[0]?.dataPoints.slice(-1)[0]?.value || null,
        };
      }),
    );

    return measurements.reduce((acc, { metric, value }) => {
      acc[metric] = value;
      return acc;
    }, {});
  }

  async checkClusterHealth(clusterName) {
    try {
      const status = await this.makeRequest("get", `/clusters/${clusterName}`);
      const metrics = await this.makeRequest(
        "get",
        `/clusters/${clusterName}/measurements?period=PT5M`,
      );

      const issues = [];

      if (status.stateName !== "IDLE") {
        issues.push(`Cluster is in ${status.stateName} state`);
      }

      // Check for high CPU usage
      const cpuMetrics = metrics.measurements.find(
        (m) => m.name === "CPU_USER",
      );
      if (cpuMetrics) {
        const latestCPU = cpuMetrics.dataPoints.slice(-1)[0]?.value;
        if (latestCPU > 80) {
          issues.push(`High CPU usage: ${latestCPU}%`);
        }
      }

      return {
        status: issues.length === 0 ? "HEALTHY" : "ISSUES",
        issues,
      };
    } catch (error) {
      return {
        status: "UNKNOWN",
        issues: [`Health check failed: ${error.message}`],
      };
    }
  }

  processBillingData(billing, usage) {
    return {
      currentBalance: billing.currentBalance,
      pendingCharges: billing.pendingCharges,
      currency: billing.currency,
      usage: usage.results || [],
      processedAt: new Date().toISOString(),
    };
  }
}

module.exports = AtlasService;
