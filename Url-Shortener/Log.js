
const axios = import("axios");

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

/**
 * Logs an event to the test server.
 * 
 * @param {string} stack   - "backend" | "frontend"
 * @param {string} level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg     - package name (db, handler, route, service, etc.)
 * @param {string} message - descriptive log message
 */
async function Log(stack, level, pkg, message) {
  try {
    const body = {
      stack,
      level,
      package: pkg,
      message,
    };

    const response = await axios.post(LOG_API_URL, body);

    if (response.status === 200) {
      console.log("Log created successfully:", response.data);
    } else {
      console.error("Failed to log:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending log:", error.message || error);
  }
}

export default { Log };
