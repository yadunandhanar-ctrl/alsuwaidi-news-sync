const axios = require("axios");

async function main() {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  // Get OAuth token
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

  console.log("✅ Access token acquired");

  // Get SharePoint Site
  const site = await axios.get(
    "https://graph.microsoft.com/v1.0/sites/alsuwaidicompany.sharepoint.com:/sites/Intranet",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("\nSITE:");
  console.log(site.data);

  // Get default Documents drive
  const drive = await axios.get(
    `https://graph.microsoft.com/v1.0/sites/${site.data.id}/drive`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("\nDRIVE:");
  console.log(drive.data);
}

main().catch((err) => {
  console.error(err.response?.data || err);
  process.exit(1);
});
