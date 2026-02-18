const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Simple function to parse .env.local
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.error('Error: .env.local file not found.');
      return null;
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[match[1].trim()] = value;
      }
    });
    return env;
  } catch (err) {
    console.error('Error loading .env.local:', err);
    return null;
  }
}

async function testConnection() {
  console.log('--- MongoDB Connection Diagnostic Script ---');
  
  const env = loadEnv();
  const uri = process.env.MONGODB_URI || (env && env.MONGODB_URI);

  if (!uri) {
    console.error('Error: MONGODB_URI not found in process.env or .env.local');
    process.exit(1);
  }

  // Mask URI for display
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  console.log(`Using Connection String: ${maskedUri}`);

  // Extract hostname for DNS lookup if it's a standard format
  const match = uri.match(/@([^/?]+)/);
  if (match) {
    const hostname = match[1];
    console.log(`Extracting hostname for DNS check: ${hostname}`);
    
    // Check SRV record if it looks like an atlas SRV
    if (uri.startsWith('mongodb+srv://')) {
        const srvHostname = `_mongodb._tcp.${hostname}`;
        console.log(`Attempting to resolve SRV record: ${srvHostname}`);
        dns.resolveSrv(hostname, (err, addresses) => { // resolveSrv requires the domain, not the full SRV record prefix for the method, BUT usually we want to resolve the domain. 
          // Actually dns.resolveSrv takes the hostname. Node's dns module might handle the prefix if we use resolve?
          // Let's use lookup which is what usually happens at system level
        });

        // Actually, let's just use dns.lookup first on the hostname
        dns.lookup(hostname, (err, address, family) => {
            if (err) {
                console.error(`DNS Lookup failed for ${hostname}:`, err.code, err.message);
            } else {
                console.log(`DNS Lookup successful for ${hostname}: ${address} (Family: ${family})`);
            }
        });
    } else {
        // Standard connection
         dns.lookup(hostname.split(':')[0], (err, address, family) => {
            if (err) {
                console.error(`DNS Lookup failed for ${hostname.split(':')[0]}:`, err.code, err.message);
            } else {
                console.log(`DNS Lookup successful: ${address}`);
            }
        });
    }
  }

  console.log('Attempting Mongoose connection...');
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log('✅ Connection Successful!');
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (err) {
    console.error('❌ Connection Failed:', err);
    console.error('Details:', JSON.stringify(err, null, 2));
    
    if (err.name === 'MongooseServerSelectionError') {
      console.error('\nPotential Causes:');
      console.error('1. IP Address not whitelisted in MongoDB Atlas.');
      console.error('2. Incorrect username/password.');
      console.error('3. Database cluster is down or paused.');
    }
  }
}

testConnection();
