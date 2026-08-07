const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== BRANDING =====
const BRANDING = {
  developed_by: "HJ-HACKER",
  whatsapp_channel: "https://whatsapp.com/channel/0029VbAaNJ6C1FuB0mIAx93M",
  main_site: "https://hamza-jutt-7d6.pages.dev/",
  note: "🔥 Follow HJ-HACKER for more tools, apps & tech updates!",
  version: "1.0.0"
};

// ============================================================
// ===== HOME PAGE (No Data) =====
// ============================================================
app.get('/', (req, res) => {
  res.json({
    name: "HJ-HACKER SIM Database API",
    version: "1.0.0",
    status: "🟢 Online",
    developer: "HJ-HACKER",
    website: "https://hamza-jutt-7d6.pages.dev/",
    whatsapp: "https://whatsapp.com/channel/0029VbAaNJ6C1FuB0mIAx93M",
    endpoints: {
      sim_database: "/api/sim?q=PHONE_NUMBER_OR_CNIC"
    },
    examples: {
      by_phone: "/api/sim?q=03001234567",
      by_phone_no_zero: "/api/sim?q=3001234567",
      by_cnic: "/api/sim?q=12345-1234567-1",
      by_cnic_no_dashes: "/api/sim?q=1234512345671"
    },
    message: "Add ?q=NUMBER to search SIM database"
  });
});

// ============================================================
// ===== SIM DATABASE API (Only Shows Data When Query Given) =====
// ============================================================
app.get('/api/sim', async (req, res) => {
  const { q, number, cnic } = req.query;

  // Check if any search parameter is provided
  const searchQuery = q || number || cnic;

  if (!searchQuery) {
    return res.status(400).json({
      success: false,
      error: 'Search parameter is required',
      message: 'Please provide a phone number or CNIC to search',
      usage: {
        by_phone: '/api/sim?q=03001234567',
        by_phone_no_zero: '/api/sim?q=3001234567',
        by_cnic: '/api/sim?q=12345-1234567-1',
        by_cnic_no_dashes: '/api/sim?q=1234512345671'
      },
      credits: BRANDING,
      example: '/api/sim?q=3035481601'
    });
  }

  try {
    const cleanQuery = searchQuery.toString().trim();
    console.log('📱 SIM Search Query:', cleanQuery);

    // ===== CALL THE EXTERNAL SIM DATABASE API =====
    const apiUrl = `https://fam-official.serv00.net/api/database.php?q=${encodeURIComponent(cleanQuery)}`;
    console.log('🔄 Calling SIM Database API:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    const data = response.data;
    console.log('✅ SIM API Response received');

    // ===== CHECK IF RECORDS FOUND =====
    if (!data.success || !data.data || data.data.records_count === 0) {
      return res.status(404).json({
        success: false,
        error: 'No records found for the provided query',
        credits: BRANDING,
        query: cleanQuery
      });
    }

    // ===== FORMAT RESPONSE - ONLY WHEN DATA FOUND =====
    const records = data.data.records || [];
    const firstRecord = records[0] || {};

    res.json({
      credits: BRANDING,
      status: true,
      results: {
        status: true,
        data: {
          search_type: data.data.search_type || 'unknown',
          records_count: data.data.records_count || 0,
          queried_number: data.data.queried_number || cleanQuery,
          records: records.map(record => ({
            full_name: record.full_name || 'N/A',
            phone: record.phone || 'N/A',
            cnic: record.cnic || 'N/A',
            address: record.address || 'N/A'
          })),
          summary: {
            name: firstRecord.full_name || 'N/A',
            phone: firstRecord.phone || 'N/A',
            cnic: firstRecord.cnic || 'N/A',
            address: firstRecord.address || 'N/A'
          }
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ SIM Database Error:', error.message);
    
    let errorMessage = 'Failed to fetch SIM database records. Please try again later.';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. The SIM database server is taking too long to respond.';
    } else if (error.response?.status === 404) {
      errorMessage = 'SIM database endpoint not found. Please check the API URL.';
    } else if (error.response?.status === 500) {
      errorMessage = 'SIM database server error. Please try again later.';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      credits: BRANDING,
      debug: {
        query: cleanQuery,
        error_details: error.message
      }
    });
  }
});

// ============================================================
// ===== 404 HANDLER =====
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found. Available endpoints: /, /api/sim',
    credits: BRANDING,
    available_endpoints: {
      home: "/",
      sim: "/api/sim?q=PHONE_NUMBER_OR_CNIC"
    },
    examples: {
      phone: "/api/sim?q=03001234567",
      cnic: "/api/sim?q=12345-1234567-1"
    }
  });
});

// ============================================================
// ===== START SERVER =====
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 HJ-HACKER SIM Database API running on port ${PORT}`);
  console.log(`🌐 Website: https://hamza-jutt-7d6.pages.dev/`);
  console.log(`📱 WhatsApp Channel: ${BRANDING.whatsapp_channel}`);
  console.log(`\n📌 Endpoint:`);
  console.log(`  → SIM DB:  /api/sim?q=03001234567`);
});
