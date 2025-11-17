const EventEmitter = require("events");
require("dotenv").config();

class BaseResReqBinding extends EventEmitter {
  constructor() {
    super();
    this.requestHandlers = new Map();
    this.responseProcessors = new Map();

    this.initializeHandlers();
    this.initializeResponseProcessors();
    this.makeRequest();
  }

  // Abstract methods to be implemented by concrete classes
  async initializeHandlers() {
    throw new Error("initializeHandlers must be implemented by subclass");
  }

  async initializeResponseProcessors() {
    throw new Error(
      "initializeResponseProcessors must be implemented by subclass",
    );
  }

  async makeRequest() {
    throw new Error(
      "makeRequest must be implemented by subclass",
    );
  }

  // Core request handler that routes requests based on source
  async handleRequest(source, type, payload, context = {}) {
    try {
      const requestId = this.generateRequestId();

      // Emit request received event
      this.emit("requestReceived", {
        requestId,
        source,
        type,
        payload,
        context,
        timestamp: new Date().toISOString(),
      });

      // Get appropriate handler based on source and type
      const handler = this.getHandler(source, type);
      if (!handler) {
        throw new Error(
          `No handler found for source: ${source}, type: ${type}`,
        );
      }

      // Process request through handler
      const result = await handler(payload, context);

      // Process response based on source
      const processedResponse = await this.processResponse(
        source,
        type,
        result,
        context,
      );

      // Emit response sent event
      this.emit("responseSent", {
        requestId,
        source,
        type,
        response: processedResponse,
        context,
        timestamp: new Date().toISOString(),
      });

      return processedResponse;
    } catch (error) {
      const errorResponse = this.handleError(source, error, type, context);
      this.emit("requestFailed", {
        source,
        type,
        error: error.message,
        context,
        timestamp: new Date().toISOString(),
      });
      return errorResponse;
    }
  }

  // Get handler based on source and type
  getHandler(source, type) {
    const handlerKey = `${source}:${type}`;
    return this.requestHandlers.get(handlerKey);
  }

  // Register handler for specific source and type
  registerHandler(source, type, handler) {
    const handlerKey = `${source}:${type}`;
    this.requestHandlers.set(handlerKey, handler);
  }

  // Register response processor for specific source
  registerResponseProcessor(source, processor) {
    this.responseProcessors.set(source, processor);
  }

  // Process response based on source
  async processResponse(source, type, result, context) {
    const processor = this.responseProcessors.get(source);
    if (processor) {
      return await processor(result, type, context);
    }
    return this.defaultResponseProcessor(result, source, context);
  }

  // Default response processor
  defaultResponseProcessor(result, source, context) {
    const baseResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      source,
    };

    // Add source-specific enhancements
    switch (source) {
    case "api":
      return {
        ...baseResponse,
        status: "success",
        code: 200,
      };
    case "hook":
      return {
        ...baseResponse,
        event: context.event || "default",
        hookId: context.hookId,
      };
    case "service":
      return {
        ...baseResponse,
        queryType: context.queryType,
        executionTime: context.executionTime,
      };
    case "socket":
      return {
        ...baseResponse,
        socketId: context.socketId,
        room: context.room,
      };
    case "cron":
      return {
        ...baseResponse,
        jobId: context.jobId,
        executionCount: context.executionCount,
        nextRun: context.nextRun,
      };
    default:
      return baseResponse;
    }
  }

  // Error handler with source-specific error formatting
  handleError(source, error, type, context) {
    const errorResponse = {
      success: false,
      type,
      error: {
        message: error.message,
        code: error.code || "INTERNAL_ERROR",
        details: error.details || null,
        timestamp: new Date().toISOString(),
      },
      source,
    };

    switch (source) {
    case "api":
      return {
        ...errorResponse,
        status: "error",
        code: this.getHttpStatusCode(error),
      };
    case "hook":
      return {
        ...errorResponse,
        event: context.event,
        hookId: context.hookId,
        retryable: this.isRetryableError(error),
      };
    case "service":
      return {
        ...errorResponse,
        queryType: context.queryType,
        retryCount: context.retryCount || 0,
      };
    case "socket":
      return {
        ...errorResponse,
        socketId: context.socketId,
        room: context.room,
      };
    case "cron":
      return {
        ...errorResponse,
        jobId: context.jobId,
        nextRun: context.nextRun,
      };
    default:
      return errorResponse;
    }
  }

  // Utility methods
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getHttpStatusCode(error) {
    const statusCodes = {
      VALIDATION_ERROR: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      RATE_LIMITED: 429,
      INTERNAL_ERROR: 500,
      SERVICE_UNAVAILABLE: 503,
    };
    return statusCodes[error.code] || 500;
  }

  isRetryableError(error) {
    const retryableCodes = ["SERVICE_UNAVAILABLE", "RATE_LIMITED", "TIMEOUT"];
    return retryableCodes.includes(error.code) || error.retryable === true;
  }

  parseAtlasError(error) {
    if (error.response) {
      const { status, data } = error.response;
      const atlasError = new Error(data.detail || "Atlas API Error");
      atlasError.code = this.mapAtlasErrorCode(status, data);
      atlasError.details = data;
      atlasError.statusCode = status;
      return atlasError;
    }
    return error;
  }

  mapAtlasErrorCode(status) {
    const errorMap = {
      400: "VALIDATION_ERROR",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      429: "RATE_LIMITED",
      500: "INTERNAL_ERROR",
      503: "SERVICE_UNAVAILABLE",
    };
    return errorMap[status] || "INTERNAL_ERROR";
  }
}

module.exports = BaseResReqBinding;
