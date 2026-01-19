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

    // Step 7: Migrate each table
    const migrationResults = [];
    const mongoDbName = process.env.MONGO_DB || 'migrated_data';
    const mongoDb = mongoClient.db(mongoDbName);
    
    console.log(`Migrating to MongoDB database: ${mongoDbName}`);
    
    for (const table of tables) {
      try {
        console.log(`Migrating table: ${table}`);
        
        // Get data from SQL Server
        const dbName = process.env.SQL_DB_NAME || 'RestoredDB';
        const rowsResult = await pool.request().query(`SELECT * FROM [${dbName}].[dbo].[${table}]`);
        const rows = rowsResult.recordset;
        
        if (rows.length > 0) {
          console.log(`Found ${rows.length} rows in table '${table}'`);
          
          // Prepare data for MongoDB - handle special types
          const mongoDocs = rows.map((row, index) => {
            const doc = { _id: index + 1 }; // Add an _id for MongoDB
            Object.keys(row).forEach(key => {
              const value = row[key];
              
              // Handle different data types
              if (value === null || value === undefined) {
                doc[key.toLowerCase()] = null;
              } else if (value instanceof Date) {
                doc[key.toLowerCase()] = value;
              } else if (typeof value === 'object' && value instanceof sql.TYPES.NVarChar) {
                doc[key.toLowerCase()] = value.toString();
              } else if (Buffer.isBuffer(value)) {
                // Convert binary data to base64
                doc[key.toLowerCase()] = value.toString('base64');
              } else {
                doc[key.toLowerCase()] = value;
              }
            });
            return doc;
          });
          
          // Insert into MongoDB
          const collectionName = table.toLowerCase();
          const collection = mongoDb.collection(collectionName);
          
          // Clear existing data if any
          const deleteResult = await collection.deleteMany({});
          console.log(`Cleared ${deleteResult.deletedCount} existing documents from '${collectionName}'`);
          
          // Insert new data
          const insertResult = await collection.insertMany(mongoDocs);
          
          migrationResults.push({
            table: table,
            rowsMigrated: rows.length,
            success: true,
            mongoCollection: collectionName
          });
          
          console.log(`✓ Migrated ${rows.length} rows to MongoDB collection '${collectionName}'`);
        } else {
          migrationResults.push({
            table: table,
            rowsMigrated: 0,
            success: true,
            message: "Table was empty"
          });
          console.log(`○ Table '${table}' is empty, skipping`);
        }
      } catch (tableErr) {
        console.error(`✗ Error migrating table '${table}':`, tableErr.message);
        migrationResults.push({
          table: table,
          success: false,
          error: tableErr.message
        });
      }
    }

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
    
    // Send success response
    const successfulMigrations = migrationResults.filter(r => r.success).length;
    const totalRows = migrationResults.reduce((sum, r) => sum + (r.rowsMigrated || 0), 0);
    
    const response = {
      success: true, 
      message: `Migration completed successfully!`,
      summary: {
        totalTables: tables.length,
        successfulTables: successfulMigrations,
        failedTables: tables.length - successfulMigrations,
        totalRowsMigrated: totalRows,
        mongoDatabase: mongoDbName
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

// Export the middleware and handler
module.exports = {
  uploadMiddleware,
  migrateBakToMongo
};