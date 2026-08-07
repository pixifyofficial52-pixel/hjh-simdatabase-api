const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { q, number, cnic } = req.query;
  const searchQuery = q || number || cnic;

  if (!searchQuery) {
    return res.status(400).json({
      success: false,
      error: 'Search parameter is required',
      usage: {
        by_phone: '/api/sim?q=03001234567',
        by_cnic: '/api/sim?q=12345-1234567-1'
      }
    });
  }

  try {
    const cleanQuery = searchQuery.toString().trim();
    const apiUrl = `https://fam-official.serv00.net/api/database.php?q=${encodeURIComponent(cleanQuery)}`;

    const response = await axios.get(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000
    });

    const data = response.data;

    if (!data.success || !data.data || data.data.records_count === 0) {
      return res.status(404).json({
        success: false,
        error: 'No records found',
        query: cleanQuery
      });
    }

    const records = data.data.records || [];
    const firstRecord = records[0] || {};

    res.json({
      credits: {
        developed_by: "HJ-HACKER",
        whatsapp_channel: "https://whatsapp.com/channel/0029VbAaNJ6C1FuB0mIAx93M",
        main_site: "https://hamza-jutt-7d6.pages.dev/"
      },
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
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SIM database records',
      details: error.message
    });
  }
};
