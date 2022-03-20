// checks session connection status
export default function checkStatus(connectionStatus: string | null) {
  return connectionStatus === "new" || connectionStatus === "connected"
    ? true
    : false;
}
