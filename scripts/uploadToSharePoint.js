const axios = require("axios");
const fs = require("fs");

async function main() {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;
  const driveId = process.env.SHAREPOINT_DRIVE_ID;

  // Get access token
  const tokenResponse = await axios.post(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const token = tokenResponse.data.access_token;

  // Read news.json
  const file = fs.readFileSync("data/news.json");

  // Upload to SharePoint
  await axios.put(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/root:/news/news.json:/content`,
    file,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("✅ Uploaded news.json to SharePoint successfully!");
}

main().catch(err => {
  console.error(err.response?.data || err);
  process.exit(1);
});
