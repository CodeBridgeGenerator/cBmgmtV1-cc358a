const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sql = require("mssql");
const { MongoClient } = require("mongodb");
const Docker = require("dockerode");

console.log("SQL to MongoDB migration handler module loaded");

const docker = new Docker();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../uploads');
    console.log("Upload directory:", uploadDir);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      console.log("Creating upload directory:", uploadDir);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use original filename
    console.log("Received file:", file.originalname);
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    console.log("File filter checking:", file.originalname, file.mimetype);

    if (file.mimetype === 'application/octet-stream' ||
      file.mimetype === 'application/x-sqlserver-backup' ||
      file.originalname.toLowerCase().endsWith('.bak')) {
      console.log("File accepted:", file.originalname);
      cb(null, true);
    } else {
      console.log("File rejected - not a .bak file:", file.originalname);
      cb(new Error('Only .bak files are allowed'), false);
    }
  }
});

// SQL Server to MongoDB type mapping
const SQL_TYPE_MAPPING = {
  // String types
  'char': 'String',
  'varchar': 'String',
  'text': 'String',
  'nchar': 'String',
  'nvarchar': 'String',
  'ntext': 'String',

  // Numeric types
  'int': 'Number',
  'bigint': 'Number',
  'smallint': 'Number',
  'tinyint': 'Number',
  'decimal': 'Number',
  'numeric': 'Number',
  'float': 'Number',
  'real': 'Number',
  'money': 'Number',
  'smallmoney': 'Number',

  // Date/Time types
  'date': 'Date',
  'datetime': 'Date',
  'datetime2': 'Date',
  'smalldatetime': 'Date',
  'time': 'String', // MongoDB doesn't have Time type, store as String

  // Boolean types
  'bit': 'Boolean',

  // Binary types
  'binary': 'Buffer',
  'varbinary': 'Buffer',
  'image': 'Buffer',

  // Other types
  'uniqueidentifier': 'String', // UUID as string
  'timestamp': 'Buffer', // RowVersion as buffer
  'xml': 'String',
  'json': 'String',
};

// SQL Server to Component mapping (for UI)
const SQL_TO_COMPONENT_MAPPING = {
  // String types
  'char': 'p_inputtext',
  'varchar': 'p_inputtext',
  'text': 'p_textarea',
  'nchar': 'p_inputtext',
  'nvarchar': 'p_inputtext',
  'ntext': 'p_textarea',

  // Numeric types
  'int': 'p_inputnumber',
  'bigint': 'p_inputnumber',
  'smallint': 'p_inputnumber',
  'tinyint': 'p_inputnumber',
  'decimal': 'p_inputnumber',
  'numeric': 'p_inputnumber',
  'float': 'p_inputnumber',
  'real': 'p_inputnumber',
  'money': 'p_inputnumber',
  'smallmoney': 'p_inputnumber',

  // Date/Time types
  'date': 'p_calendar',
  'datetime': 'p_calendar',
  'datetime2': 'p_calendar',
  'smalldatetime': 'p_calendar',
  'time': 'p_inputtext',

  // Boolean types
  'bit': 'p_checkbox',

  // Binary types
  'binary': 'p_fileupload',
  'varbinary': 'p_fileupload',
  'image': 'p_fileupload',

  // Other types
  'uniqueidentifier': 'p_inputtext',
  'timestamp': 'p_fileupload',
  'xml': 'p_textarea',
  'json': 'p_textarea',
};

// Helper function to convert SQL field names to camelCase
function toCamelCase(str) {
  return str
    .replace(/[_\-]/g, ' ') // Replace underscores and hyphens with spaces
    .replace(/\s+(.)/g, (_, chr) => chr.toUpperCase()) // Capitalize words
    .replace(/\s/g, '') // Remove spaces
    .replace(/^(.)/, (chr) => chr.toLowerCase()); // Lowercase first letter
}

// Helper function to convert SQL table names to camelCase for collection names
function tableNameToCamelCase(tableName) {
  return tableName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .trim()
    .replace(/\s+/g, ' ') // Normalize spaces
    .split(' ')
    .map((word, index) =>
      index === 0
        ? word.toLowerCase() // First word lowercase
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize others
    )
    .join('');
}

// Function to convert SQL Server value to proper MongoDB/JavaScript type
function convertSqlValue(value, sqlType, fieldName = '') {
  if (value === null || value === undefined) {
    return null;
  }

  const sqlTypeLower = sqlType.toLowerCase();

  // Handle decimal/numeric types (preserve as Number)
  if (sqlTypeLower === 'decimal' || sqlTypeLower === 'numeric') {
    // For decimal fields, preserve the exact value
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    } else if (value && typeof value === 'object' && value.value !== undefined) {
      // Handle SQL Server decimal objects
      return parseFloat(value.value) || 0;
    }
    return Number(value) || 0;
  }

  // Handle integer types
  if (sqlTypeLower === 'int' || sqlTypeLower === 'bigint' || sqlTypeLower === 'smallint' || sqlTypeLower === 'tinyint') {
    return Number(value);
  }

  // Handle float/real types
  if (sqlTypeLower === 'float' || sqlTypeLower === 'real') {
    return Number(value);
  }

  // Handle money types
  if (sqlTypeLower === 'money' || sqlTypeLower === 'smallmoney') {
    return Number(value);
  }

  // Handle bit type (Boolean)
  if (sqlTypeLower === 'bit') {
    return Boolean(value);
  }

  // Handle date/time types
  if (sqlTypeLower === 'date' || sqlTypeLower === 'datetime' || sqlTypeLower === 'datetime2' || sqlTypeLower === 'smalldatetime') {
    if (value instanceof Date) {
      return value;
    } else if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    } else if (value && typeof value === 'object' && value.value !== undefined) {
      return new Date(value.value);
    }
    return value;
  }

  // Handle time type (store as string)
  if (sqlTypeLower === 'time') {
    return String(value);
  }

  // Handle binary types
  if (sqlTypeLower === 'binary' || sqlTypeLower === 'varbinary' || sqlTypeLower === 'image') {
    if (Buffer.isBuffer(value)) {
      return value.toString('base64');
    }
    return String(value);
  }

  // Handle timestamp (rowversion)
  if (sqlTypeLower === 'timestamp') {
    if (Buffer.isBuffer(value)) {
      return value.toString('base64');
    }
    return String(value);
  }

  // Handle string types
  if (sqlTypeLower === 'char' || sqlTypeLower === 'varchar' || sqlTypeLower === 'text' ||
    sqlTypeLower === 'nchar' || sqlTypeLower === 'nvarchar' || sqlTypeLower === 'ntext' ||
    sqlTypeLower === 'xml' || sqlTypeLower === 'json' || sqlTypeLower === 'uniqueidentifier') {
    if (typeof value === 'string') {
      return value.trim();
    } else if (value && typeof value === 'object' && value.toString) {
      return value.toString().trim();
    }
    return String(value).trim();
  }

  // Default: convert to string
  if (typeof value === 'string') {
    return value.trim();
  } else if (value && typeof value === 'object' && value.toString) {
    return value.toString().trim();
  }

  return value;
}

// Function to analyze SQL Server schema
async function analyzeTableSchema(pool, dbName, tableName) {
  try {
    console.log(`Analyzing schema for table: ${tableName}`);

    // Get column information
    const columnsQuery = `
      SELECT 
        c.COLUMN_NAME,
        c.DATA_TYPE,
        c.CHARACTER_MAXIMUM_LENGTH,
        c.NUMERIC_PRECISION,
        c.NUMERIC_SCALE,
        c.IS_NULLABLE,
        CASE WHEN tc.CONSTRAINT_TYPE = 'PRIMARY KEY' THEN 1 ELSE 0 END AS IS_PRIMARY_KEY,
        CASE WHEN COLUMNPROPERTY(OBJECT_ID(c.TABLE_SCHEMA + '.' + c.TABLE_NAME), c.COLUMN_NAME, 'IsIdentity') = 1 THEN 1 ELSE 0 END AS IS_IDENTITY,
        CASE WHEN ic.CONSTRAINT_NAME IS NOT NULL THEN 1 ELSE 0 END AS IS_UNIQUE,
        CASE WHEN fkc.CONSTRAINT_NAME IS NOT NULL THEN 1 ELSE 0 END AS IS_FOREIGN_KEY,
        cc.CHECK_CLAUSE
      FROM [${dbName}].INFORMATION_SCHEMA.COLUMNS c
      LEFT JOIN [${dbName}].INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
        ON c.TABLE_CATALOG = kcu.TABLE_CATALOG 
        AND c.TABLE_SCHEMA = kcu.TABLE_SCHEMA 
        AND c.TABLE_NAME = kcu.TABLE_NAME 
        AND c.COLUMN_NAME = kcu.COLUMN_NAME
      LEFT JOIN [${dbName}].INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc 
        ON kcu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME 
        AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
      LEFT JOIN [${dbName}].INFORMATION_SCHEMA.TABLE_CONSTRAINTS uc 
        ON kcu.CONSTRAINT_NAME = uc.CONSTRAINT_NAME 
        AND uc.CONSTRAINT_TYPE = 'UNIQUE'
      LEFT JOIN [${dbName}].INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ic 
        ON kcu.CONSTRAINT_NAME = ic.CONSTRAINT_NAME
      LEFT JOIN [${dbName}].INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc 
        ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
      LEFT JOIN [${dbName}].INFORMATION_SCHEMA.KEY_COLUMN_USAGE fkc 
        ON rc.UNIQUE_CONSTRAINT_NAME = fkc.CONSTRAINT_NAME
      LEFT JOIN [${dbName}].INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc 
        ON kcu.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
      WHERE c.TABLE_NAME = '${tableName}'
      ORDER BY c.ORDINAL_POSITION
    `;

    const result = await pool.request().query(columnsQuery);

    const schemaFields = [];

    for (const column of result.recordset) {
      const sqlType = column.DATA_TYPE.toLowerCase();
      const mongoType = SQL_TYPE_MAPPING[sqlType] || 'String';
      const component = SQL_TO_COMPONENT_MAPPING[sqlType] || 'p_inputtext';

      // Determine if field should be displayed
      const isPrimaryKey = column.IS_PRIMARY_KEY === 1;
      const isIdentity = column.IS_IDENTITY === 1;
      const isSystemField = column.COLUMN_NAME.toLowerCase().includes('id') && isPrimaryKey;

      // Convert field name to camelCase
      const originalFieldName = column.COLUMN_NAME;
      const camelCaseFieldName = toCamelCase(originalFieldName);

      // Field configuration
      const fieldConfig = {
        fieldName: camelCaseFieldName, // Use camelCase in config
        originalFieldName: originalFieldName, // Keep original for reference
        originalDataType: sqlType, // Keep original SQL data type
        type: mongoType,
        unique: column.IS_UNIQUE === 1,
        lowercase: false,
        uppercase: false,
        trim: sqlType.includes('char') || sqlType.includes('text'),
        display: !isSystemField, // Don't display ID fields by default
        displayOnEdit: !isSystemField,
        displayOnSingle: !isSystemField,
        displayOnDataTable: !isSystemField,
        creatable: !isSystemField && !isIdentity,
        editable: !isSystemField && !isIdentity,
        sortable: true,
        required: column.IS_NULLABLE === 'NO' && !isIdentity,
        description: sqlType,
        component: component,
        label: column.COLUMN_NAME.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        isMultiple: false,
        enum: [],
        index: column.IS_PRIMARY_KEY === 1 || column.IS_UNIQUE === 1,
        autocomplete: false,
        lazy: false,
        reverse: false,
        morph: false,
        through: false,
        args: [],
        auditing: false,
        warehousing: false,
        searchable: true,
        mode: mongoType === 'Number' ? 'currency' : 'default',
        currency: {
          currency: "MYR",
          locale: "en-US"
        },
        reference: {
          identifierFieldName: []
        }
      };

      // Set min/max based on SQL type
      if (mongoType === 'String' && column.CHARACTER_MAXIMUM_LENGTH) {
        fieldConfig.max = column.CHARACTER_MAXIMUM_LENGTH;
        fieldConfig.min = 1;
      }

      // For numeric types
      if (mongoType === 'Number' && column.NUMERIC_PRECISION) {
        fieldConfig.min = 0;
        fieldConfig.max = Math.pow(10, column.NUMERIC_PRECISION) - 1;
      }

      // Handle special UI components based on field name (not type!)
      if (column.COLUMN_NAME.toLowerCase() === 'email') {
        fieldConfig.component = 'p_inputtext';
        fieldConfig.lowercase = true;
        fieldConfig.unique = true;
      }

      if (column.COLUMN_NAME.toLowerCase().includes('password')) {
        fieldConfig.displayOnEdit = false;
        fieldConfig.displayOnDataTable = false;
        fieldConfig.editable = false;
        fieldConfig.component = 'p_password';
      }

      // Only set calendar component for actual date types
      if (sqlType === 'date' || sqlType === 'datetime' || sqlType === 'datetime2' || sqlType === 'smalldatetime') {
        fieldConfig.component = 'p_calendar';
      }

      // Only set checkbox component for actual bit type
      if (sqlType === 'bit') {
        fieldConfig.component = 'p_checkbox';
      }

      schemaFields.push(fieldConfig);
    }

    return schemaFields;
  } catch (err) {
    console.error(`Error analyzing schema for table ${tableName}:`, err);
    return [];
  }
}

// Function to create Config.json structure
function createConfigJson(tables, projectName = 'cbapp1') {
  const config = {
    projectName: projectName,
    description: "Migrated from SQL Server",
    auth: "jwt",
    database: {
      _id: "6718ba9bc686b63c57a218e6",
      type: "database",
      name: "mongodb",
      label: "MongoDB",
      appName: "mongodb-database",
      pathToLogo: {
        s: "/assets/applications_logos/mongodb-s.png",
        l: "/assets/applications_logos/mongodb.png"
      },
      configFileRelativePath: null,
      disabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    stack: [
      {
        appName: "nodejs-backend",
        environments: [null, null, null, null, null],
        pathToLogo: {
          s: "/assets/applications_logos/nodejs-s.png",
          l: "/assets/applications_logos/nodejs.png"
        },
        type: "backend",
        name: "nodejs",
        label: "Node.js Express Feathers.js",
        versions: []
      },
      {
        appName: "react-frontend",
        environments: [null, null, null, null, null],
        pathToLogo: {
          s: "/assets/applications_logos/react-s.png",
          l: "/assets/applications_logos/react.png"
        },
        type: "frontend",
        name: "react",
        label: "React JavaScript",
        versions: []
      }
    ],
    services: []
  };

  // Add each table as a service
  for (const table of tables) {
    const camelCaseTableName = tableNameToCamelCase(table.tableName);
    const serviceName = camelCaseTableName;
    const displayName = table.tableName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    const service = {
      serviceName: serviceName,
      databaseName: serviceName,
      displayName: displayName,
      icon: "pi pi-cog",
      create: true,
      edit: true,
      delete: true,
      single: true,
      sidebar: [],
      schemaList: table.schemaFields,
      layout: true,
      seeder: [],
      skip: false,
      downloadable: true,
      uploadable: false,
      sharable: false,
      ai: false,
      warehouse: false
    };

    config.services.push(service);
  }

  return config;
}

// Export multer middleware
const uploadMiddleware = upload.single('bakFile');

// Main migration handler function
const migrateBakToMongo = async (req, res) => {
  let bakFilePath = null;
  let pool = null;
  let mongoClient = null;

  try {
    console.log("Migration handler started");

    // Check if file was uploaded
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({
        success: false,
        error: "No .bak file uploaded",
        message: "Please select a .bak file to upload"
      });
    }

    bakFilePath = req.file.path;
    const bakFileName = req.file.originalname;
    const uploadsDir = path.dirname(bakFilePath);
    const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2);

    console.log(`Processing backup file: ${bakFileName} (${fileSizeMB} MB)`);
    console.log(`File saved at: ${bakFilePath}`);
    console.log(`Uploads directory: ${uploadsDir}`);

    // Step 1: Check Docker container
    let container;
    let containerExists = false;
    const containerName = process.env.DOCKER_SQL_CONTAINER || 'sqlserver';

    console.log(`Checking for Docker container: ${containerName}`);

    try {
      container = await docker.getContainer(containerName);
      const info = await container.inspect();
      containerExists = true;
      console.log("Container exists, checking if running...");

      if (!info.State.Running) {
        console.log("Starting existing container...");
        await container.start();
        console.log("Waiting 30 seconds for SQL Server to initialize...");
        await new Promise(r => setTimeout(r, 30000));
      } else {
        console.log("Container is already running");
      }
    } catch (containerErr) {
      if (containerErr.statusCode === 404) {
        console.log("Container doesn't exist, will create a new one");
      } else {
        console.log("Error checking container:", containerErr.message);
      }
      containerExists = false;
    }

    // Step 2: Create container if it doesn't exist
    if (!containerExists) {
      console.log("Creating new SQL Server container...");

      const containerConfig = {
        Image: process.env.DOCKER_SQL_IMAGE || 'mcr.microsoft.com/mssql/server:2022-latest',
        name: containerName,
        Env: [
          "ACCEPT_EULA=Y",
          `SA_PASSWORD=${process.env.SQL_PASSWORD || 'YourStrong!Passw0rd'}`
        ],
        HostConfig: {
          PortBindings: {
            "1433/tcp": [{
              HostPort: process.env.SQL_PORT || "1433"
            }]
          },
          Binds: [
            `${uploadsDir.replace(/\\/g, '/')}:/var/opt/mssql/backup:ro`
          ]
        }
      };

      console.log("Container config created");

      try {
        container = await docker.createContainer(containerConfig);
        await container.start();
        console.log("Container started, waiting 45 seconds for SQL Server to initialize...");
        await new Promise(r => setTimeout(r, 45000));
      } catch (createErr) {
        console.error("Failed to create container:", createErr);
        return res.status(500).json({
          success: false,
          error: "Failed to start SQL Server container",
          details: createErr.message,
          suggestion: "Make sure Docker is running and you have permission to create containers"
        });
      }
    }

    // Step 3: Connect to SQL Server
    console.log("Connecting to SQL Server...");
    try {
      const sqlConfig = {
        server: process.env.SQL_SERVER || 'localhost',
        port: parseInt(process.env.SQL_PORT) || 1433,
        user: process.env.SQL_USER || 'SA',
        password: process.env.SQL_PASSWORD || 'YourStrong!Passw0rd',
        database: 'master',
        options: {
          trustServerCertificate: true,
          encrypt: false,
          enableArithAbort: true
        },
        connectionTimeout: 300000, // 5 minutes
        requestTimeout: 300000,
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000
        }
      };

      console.log("SQL Server configuration:", {
        server: sqlConfig.server,
        port: sqlConfig.port,
        user: sqlConfig.user,
        database: sqlConfig.database
      });

      pool = await sql.connect(sqlConfig);
      console.log("Connected to SQL Server successfully");
    } catch (sqlErr) {
      console.error("Failed to connect to SQL Server:", sqlErr);
      return res.status(500).json({
        success: false,
        error: "Failed to connect to SQL Server",
        details: sqlErr.message,
        suggestion: "Check if SQL Server is running and credentials are correct"
      });
    }

    // Step 4: Kill existing connections and restore database
    try {
      const dbName = process.env.SQL_DB_NAME || 'RestoredDB';
      console.log(`Restoring database '${dbName}' from backup...`);

      // Kill existing connections to the database
      console.log("Killing existing connections to the database...");
      await pool.request().query(`
        IF EXISTS (SELECT name FROM sys.databases WHERE name = '${dbName}')
        BEGIN
          ALTER DATABASE [${dbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
          DROP DATABASE [${dbName}];
        END
      `);

      const restoreQuery = `
        RESTORE DATABASE [${dbName}]
        FROM DISK = '/var/opt/mssql/backup/${bakFileName}'
        WITH 
          MOVE '${dbName}' TO '/var/opt/mssql/data/${dbName}.mdf',
          MOVE '${dbName}_log' TO '/var/opt/mssql/data/${dbName}_log.ldf',
          REPLACE,
          STATS = 5
      `;

      console.log("Executing restore query...");
      await pool.request().query(restoreQuery);
      console.log("Database restored successfully!");
    } catch (restoreErr) {
      console.error("Failed to restore database:", restoreErr);
      return res.status(500).json({
        success: false,
        error: "Failed to restore database",
        details: restoreErr.message,
        query: restoreErr.query || 'N/A'
      });
    }

    // Step 5: Connect to MongoDB
    console.log("Connecting to MongoDB...");
    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
      mongoClient = new MongoClient(mongoUri);
      await mongoClient.connect();
      console.log("Connected to MongoDB successfully");
    } catch (mongoErr) {
      console.error("Failed to connect to MongoDB:", mongoErr);
      return res.status(500).json({
        success: false,
        error: "Failed to connect to MongoDB",
        details: mongoErr.message,
        suggestion: "Check if MongoDB is running at: " + (process.env.MONGO_URI || 'mongodb://localhost:27017')
      });
    }

    // Step 6: Get tables from restored database
    let tables;
    try {
      console.log("Fetching table list...");
      const dbName = process.env.SQL_DB_NAME || 'RestoredDB';
      const tablesResult = await pool.request().query(`
        SELECT TABLE_NAME 
        FROM [${dbName}].INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
      `);

      tables = tablesResult.recordset.map(r => r.TABLE_NAME);
      console.log(`Found ${tables.length} tables:`, tables);

      if (tables.length === 0) {
        console.warn("No tables found in the restored database");
        return res.status(400).json({
          success: false,
          error: "No tables found",
          message: "The backup file was restored but no tables were found in the database"
        });
      }
    } catch (tablesErr) {
      console.error("Failed to fetch tables:", tablesErr);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch tables",
        details: tablesErr.message
      });
    }

    // Step 7: Analyze schema and create Config.json
    console.log("Analyzing table schemas...");
    const tableSchemas = [];

    for (const tableName of tables) {
      const schemaFields = await analyzeTableSchema(pool, process.env.SQL_DB_NAME || 'RestoredDB', tableName);
      tableSchemas.push({
        tableName: tableName,
        schemaFields: schemaFields
      });
      console.log(`Analyzed schema for ${tableName}: ${schemaFields.length} fields`);
    }

    // Create Config.json
    const configJson = createConfigJson(tableSchemas, process.env.PROJECT_NAME || 'cBmgmtV1');

    // Step 8: Migrate each table with proper type conversion
    const migrationResults = [];
    const mongoDbName = process.env.MONGO_DB || 'migrated_data';
    const mongoDb = mongoClient.db(mongoDbName);

    console.log(`Migrating to MongoDB database: ${mongoDbName}`);

    for (const table of tableSchemas) {
      const tableName = table.tableName;
      try {
        console.log(`Migrating table: ${tableName}`);

        // Get data from SQL Server
        const dbName = process.env.SQL_DB_NAME || 'RestoredDB';
        const rowsResult = await pool.request().query(`SELECT * FROM [${dbName}].[dbo].[${tableName}]`);
        const rows = rowsResult.recordset;

        if (rows.length > 0) {
          console.log(`Found ${rows.length} rows in table '${tableName}'`);

          // Create a map of original field names to their SQL data types
          const fieldTypeMap = {};
          table.schemaFields.forEach(field => {
            fieldTypeMap[field.originalFieldName] = field.originalDataType;
          });

          // Prepare data for MongoDB with proper type conversion
          const mongoDocs = rows.map((row, index) => {
            const doc = {};
            Object.keys(row).forEach(originalKey => {
              const value = row[originalKey];

              // Find the field schema to get the camelCase name and SQL data type
              const fieldSchema = table.schemaFields.find(f =>
                f.originalFieldName === originalKey || toCamelCase(f.originalFieldName) === toCamelCase(originalKey)
              );

              // Use camelCase field name from config, fallback to converting original
              const fieldName = fieldSchema ? fieldSchema.fieldName : toCamelCase(originalKey);
              const sqlType = fieldSchema ? fieldSchema.originalDataType : 'varchar'; // Default to varchar if not found

              // Convert value based on SQL data type
              doc[fieldName] = convertSqlValue(value, sqlType, originalKey);
            });

            return doc;
          });

          // Use camelCase for collection name
          const collectionName = tableNameToCamelCase(tableName);
          const collection = mongoDb.collection(collectionName);

          // Clear existing data if any
          const deleteResult = await collection.deleteMany({});
          console.log(`Cleared ${deleteResult.deletedCount} existing documents from '${collectionName}'`);

          // Insert new data
          const insertResult = await collection.insertMany(mongoDocs);

          // Log first document for debugging
          if (mongoDocs.length > 0) {
            console.log(`First document sample for ${tableName}:`, JSON.stringify(mongoDocs[0], null, 2));
          }

          migrationResults.push({
            table: tableName,
            rowsMigrated: rows.length,
            success: true,
            mongoCollection: collectionName,
            fields: table.schemaFields.length
          });

          console.log(`✓ Migrated ${rows.length} rows to MongoDB collection '${collectionName}'`);
        } else {
          migrationResults.push({
            table: tableName,
            rowsMigrated: 0,
            success: true,
            message: "Table was empty",
            fields: table.schemaFields.length
          });
          console.log(`○ Table '${tableName}' is empty, skipping`);
        }
      } catch (tableErr) {
        console.error(`✗ Error migrating table '${tableName}':`, tableErr.message);
        migrationResults.push({
          table: tableName,
          success: false,
          error: tableErr.message
        });
      }
    }

    // Step 9: Prepare Config.json for download
    const configJsonString = JSON.stringify(configJson, null, 2);
    const configFileName = `migration-config-${Date.now()}.json`;

    // Clean up
    if (pool) {
      await pool.close();
      console.log("SQL Server connection closed");
    }

    if (mongoClient) {
      await mongoClient.close();
      console.log("MongoDB connection closed");
    }

    // Clean up uploaded file
    if (bakFilePath && fs.existsSync(bakFilePath)) {
      fs.unlinkSync(bakFilePath);
      console.log("Cleaned up uploaded backup file");
    }

    // Send success response with config data
    const successfulMigrations = migrationResults.filter(r => r.success).length;
    const totalRows = migrationResults.reduce((sum, r) => sum + (r.rowsMigrated || 0), 0);
    const totalFields = migrationResults.reduce((sum, r) => sum + (r.fields || 0), 0);

    const response = {
      success: true,
      message: `Migration completed successfully!`,
      summary: {
        totalTables: tables.length,
        successfulTables: successfulMigrations,
        failedTables: tables.length - successfulMigrations,
        totalRowsMigrated: totalRows,
        totalFieldsAnalyzed: totalFields,
        mongoDatabase: mongoDbName,
        namingConvention: "camelCase" // Indicate naming convention used
      },
      config: {
        fileName: configFileName,
        data: configJsonString, // Send config data directly in response
        services: configJson.services.length,
        downloadReady: true,
        namingConvention: "camelCase"
      },
      details: migrationResults,
      timestamp: new Date().toISOString()
    };

    console.log("Migration completed successfully!");
    return res.json(response);

  } catch (err) {
    console.error("Unexpected error in migration:", err);

    // Cleanup on error
    try {
      if (pool) await pool.close();
      if (mongoClient) await mongoClient.close();
      if (bakFilePath && fs.existsSync(bakFilePath)) {
        fs.unlinkSync(bakFilePath);
      }
    } catch (cleanupErr) {
      console.error("Error during cleanup:", cleanupErr);
    }

    return res.status(500).json({
      success: false,
      error: "Unexpected error during migration",
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// New function to get database schema
async function getDatabaseSchema(pool, dbName) {
  try {
    console.log(`Fetching schema for database: ${dbName}`);

    // Get all tables with row counts
    const tablesQuery = `
      SELECT 
        t.TABLE_NAME,
        t.TABLE_SCHEMA,
        p.rows as ROW_COUNT,
        ep.value as DESCRIPTION
      FROM [${dbName}].INFORMATION_SCHEMA.TABLES t
      LEFT JOIN [${dbName}].sys.tables st ON t.TABLE_NAME = st.name
      LEFT JOIN [${dbName}].sys.partitions p ON st.object_id = p.object_id
        AND p.index_id IN (0, 1)
      LEFT JOIN [${dbName}].sys.extended_properties ep 
        ON st.object_id = ep.major_id AND ep.minor_id = 0
      WHERE t.TABLE_TYPE = 'BASE TABLE'
      ORDER BY t.TABLE_NAME
    `;

    const tablesResult = await pool.request().query(tablesQuery);

    const schema = {
      databaseName: dbName,
      tables: []
    };

    // For each table, get column details
    for (const table of tablesResult.recordset) {
      const tableName = table.TABLE_NAME;
      console.log(`Getting columns for table: ${tableName}`);

      const columnsQuery = `
        SELECT 
          c.COLUMN_NAME,
          c.DATA_TYPE,
          c.CHARACTER_MAXIMUM_LENGTH,
          c.NUMERIC_PRECISION,
          c.NUMERIC_SCALE,
          c.IS_NULLABLE,
          CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 1 ELSE 0 END AS IS_PRIMARY_KEY,
          COLUMNPROPERTY(OBJECT_ID(c.TABLE_SCHEMA + '.' + c.TABLE_NAME), c.COLUMN_NAME, 'IsIdentity') AS IS_IDENTITY,
          ep.value as DESCRIPTION
        FROM [${dbName}].INFORMATION_SCHEMA.COLUMNS c
        LEFT JOIN (
          SELECT ku.TABLE_CATALOG, ku.TABLE_SCHEMA, ku.TABLE_NAME, ku.COLUMN_NAME
          FROM [${dbName}].INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
          INNER JOIN [${dbName}].INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku
            ON tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
          WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
        ) pk ON c.TABLE_CATALOG = pk.TABLE_CATALOG 
          AND c.TABLE_SCHEMA = pk.TABLE_SCHEMA 
          AND c.TABLE_NAME = pk.TABLE_NAME 
          AND c.COLUMN_NAME = pk.COLUMN_NAME
        LEFT JOIN [${dbName}].sys.columns sc ON OBJECT_ID(c.TABLE_SCHEMA + '.' + c.TABLE_NAME) = sc.object_id 
          AND c.COLUMN_NAME = sc.name
        LEFT JOIN [${dbName}].sys.extended_properties ep ON sc.object_id = ep.major_id 
          AND sc.column_id = ep.minor_id AND ep.name = 'MS_Description'
        WHERE c.TABLE_NAME = '${tableName}'
        ORDER BY c.ORDINAL_POSITION
      `;

      const columnsResult = await pool.request().query(columnsQuery);

      schema.tables.push({
        tableName: tableName,
        schema: table.TABLE_SCHEMA,
        rowCount: table.ROW_COUNT || 0,
        description: table.DESCRIPTION || '',
        columns: columnsResult.recordset.map(col => ({
          columnName: col.COLUMN_NAME,
          dataType: col.DATA_TYPE,
          maxLength: col.CHARACTER_MAXIMUM_LENGTH,
          precision: col.NUMERIC_PRECISION,
          scale: col.NUMERIC_SCALE,
          isNullable: col.IS_NULLABLE === 'YES',
          isPrimaryKey: col.IS_PRIMARY_KEY === 1,
          isIdentity: col.IS_IDENTITY === 1,
          description: col.DESCRIPTION || '',
          mongoType: SQL_TYPE_MAPPING[col.DATA_TYPE.toLowerCase()] || 'String'
        }))
      });
    }

    return schema;
  } catch (err) {
    console.error("Error getting database schema:", err);
    throw err;
  }
}

// New function to get table data with pagination
async function getTableData(pool, dbName, tableName, page = 1, pageSize = 50, filters = {}) {
  try {
    console.log(`Getting data for table: ${tableName}, page: ${page}, pageSize: ${pageSize}`);

    // Build WHERE clause from filters
    let whereClause = '';
    const params = [];
    if (Object.keys(filters).length > 0) {
      const conditions = [];
      Object.entries(filters).forEach(([key, value], index) => {
        if (value !== null && value !== '') {
          conditions.push(`[${key}] LIKE '%' + @p${index} + '%'`);
          params.push({ name: `p${index}`, value: `%${value}%` });
        }
      });
      if (conditions.length > 0) {
        whereClause = ' WHERE ' + conditions.join(' AND ');
      }
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM [${dbName}].[dbo].[${tableName}]${whereClause}`;
    const countRequest = pool.request();
    params.forEach(param => countRequest.input(param.name, sql.NVarChar, param.value));
    const countResult = await countRequest.query(countQuery);
    const totalRows = countResult.recordset[0].total;

    // Calculate pagination
    const offset = (page - 1) * pageSize;

    // Get data with pagination
    const dataQuery = `
      SELECT * FROM [${dbName}].[dbo].[${tableName}]${whereClause}
      ORDER BY (SELECT NULL)
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `;

    const dataRequest = pool.request();
    params.forEach(param => dataRequest.input(param.name, sql.NVarChar, param.value));
    const dataResult = await dataRequest.query(dataQuery);

    // Get column information for headers
    const columnsQuery = `
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM [${dbName}].INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = '${tableName}'
      ORDER BY ORDINAL_POSITION
    `;

    const columnsResult = await pool.request().query(columnsQuery);

    return {
      tableName: tableName,
      totalRows: totalRows,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalRows / pageSize),
      columns: columnsResult.recordset.map(col => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        mongoType: SQL_TYPE_MAPPING[col.DATA_TYPE.toLowerCase()] || 'String'
      })),
      data: dataResult.recordset
    };
  } catch (err) {
    console.error(`Error getting data for table ${tableName}:`, err);
    throw err;
  }
}

// New endpoint handler for database schema
const getDatabaseInfo = async (req, res) => {
  let pool = null;

  try {
    console.log("Getting database information");

    // Connect to SQL Server
    const sqlConfig = {
      server: process.env.SQL_SERVER || 'localhost',
      port: parseInt(process.env.SQL_PORT) || 1433,
      user: process.env.SQL_USER || 'SA',
      password: process.env.SQL_PASSWORD || 'YourStrong!Passw0rd',
      database: 'master',
      options: {
        trustServerCertificate: true,
        encrypt: false,
        enableArithAbort: true
      },
      connectionTimeout: 30000,
      requestTimeout: 30000
    };

    pool = await sql.connect(sqlConfig);
    console.log("Connected to SQL Server for schema inspection");

    // Get database name from query or use default
    const dbName = req.query.database || process.env.SQL_DB_NAME || 'RestoredDB';

    // Check if database exists
    const dbCheck = await pool.request().query(`
      SELECT name FROM sys.databases WHERE name = '${dbName}'
    `);

    if (dbCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Database '${dbName}' not found`,
        suggestion: "Make sure the backup has been restored first"
      });
    }

    // Get schema information
    const schema = await getDatabaseSchema(pool, dbName);

    await pool.close();

    return res.json({
      success: true,
      database: schema,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Error getting database info:", err);
    if (pool) await pool.close();

    return res.status(500).json({
      success: false,
      error: "Failed to get database information",
      details: err.message
    });
  }
};

// New endpoint handler for table data
const getTableRecords = async (req, res) => {
  let pool = null;

  try {
    console.log("Getting table records");

    const { table, database, page = 1, pageSize = 50, ...filters } = req.query;

    if (!table) {
      return res.status(400).json({
        success: false,
        error: "Table name is required"
      });
    }

    // Connect to SQL Server
    const sqlConfig = {
      server: process.env.SQL_SERVER || 'localhost',
      port: parseInt(process.env.SQL_PORT) || 1433,
      user: process.env.SQL_USER || 'SA',
      password: process.env.SQL_PASSWORD || 'YourStrong!Passw0rd',
      database: 'master',
      options: {
        trustServerCertificate: true,
        encrypt: false,
        enableArithAbort: true
      },
      connectionTimeout: 30000,
      requestTimeout: 30000
    };

    pool = await sql.connect(sqlConfig);
    console.log(`Getting data for table: ${table}`);

    const dbName = database || process.env.SQL_DB_NAME || 'RestoredDB';

    // Check if table exists
    const tableCheck = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM [${dbName}].INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = '${table}' AND TABLE_TYPE = 'BASE TABLE'
    `);

    if (tableCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Table '${table}' not found in database '${dbName}'`
      });
    }

    // Get table data with pagination and filters
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const tableData = await getTableData(pool, dbName, table, pageNum, pageSizeNum, filters);

    await pool.close();

    return res.json({
      success: true,
      ...tableData,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Error getting table records:", err);
    if (pool) await pool.close();

    return res.status(500).json({
      success: false,
      error: "Failed to get table records",
      details: err.message
    });
  }
};

// Export the middleware and handler
module.exports = {
  uploadMiddleware,
  migrateBakToMongo,
  getDatabaseInfo,    // Add this
  getTableRecords
};