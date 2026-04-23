module.exports = {
  apps: [
    {
      name: 'meeting-room-system', // PM2 process name
      script: 'src/index.js', // Entry point of your backend
      instances: 'max', // Run one instance per CPU core (cluster mode)
      autorestart: true, // Restart automatically if the app crashes
      watch: false, // Don’t restart on file changes (production safe)
      max_memory_restart: '500M', // Restart if memory usage exceeds 500 MB
      env: {
        NODE_ENV: 'development', // Environment variables for dev mode
      },
      env_production: {
        NODE_ENV: 'production', // Environment variables for production mode
      },
    },
  ],
};
