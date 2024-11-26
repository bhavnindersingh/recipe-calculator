## MongoDB Setup Instructions

1. Download MongoDB Community Server:
   - Go to: https://www.mongodb.com/try/download/community
   - Select "Windows" as the platform
   - Click "Download" for the latest version

2. Run the installer:
   - Double-click the downloaded .msi file
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Keep the default installation path
   - Complete the installation

3. Create data directory:
   ```cmd
   mkdir C:\data\db
   ```

4. Verify installation:
   - Open Command Prompt and run:
   ```cmd
   mongod --version
   ```

5. MongoDB should now be running as a Windows service
   - You can verify in Windows Services (services.msc)
   - Look for "MongoDB Server"

After installation, the MongoDB server will automatically start whenever Windows starts.
