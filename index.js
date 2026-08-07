const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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
      by_cnic: "/api/sim?q=12345-1234567-1"
    },
    message: "Add ?q=NUMBER to search SIM database"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 HJ-HACKER SIM Database API running on port ${PORT}`);
});
