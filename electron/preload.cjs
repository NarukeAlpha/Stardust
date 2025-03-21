const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Database operations
  db: {
    // Session methods
    getSessions: () => ipcRenderer.invoke('db:getSessions'),
    createSession: (session) => ipcRenderer.invoke('db:createSession', session),
    deleteSessions: (sessionIds) => ipcRenderer.invoke('db:deleteSessions', sessionIds),
    archiveSessions: () => ipcRenderer.invoke('db:archiveSessions'),
    
    // Message methods
    getSessionMessages: (sessionId) => ipcRenderer.invoke('db:getSessionMessages', sessionId),
    sendMessage: (sessionId, message, modelId, flowId) => 
      ipcRenderer.invoke('db:sendMessage', sessionId, message, modelId, flowId),
    
    // Agent methods
    getAgents: () => ipcRenderer.invoke('db:getAgents'),
    saveAgent: (agent) => ipcRenderer.invoke('db:saveAgent', agent),
    deleteAgent: (id) => ipcRenderer.invoke('db:deleteAgent', id),
    
    // MCP Connection methods
    getMCPConnections: () => ipcRenderer.invoke('db:getMCPConnections'),
    saveMCPConnection: (connection) => ipcRenderer.invoke('db:saveMCPConnection', connection),
    deleteMCPConnection: (id) => ipcRenderer.invoke('db:deleteMCPConnection', id),
    
    // Settings methods
    getOpenRouterApiKey: () => ipcRenderer.invoke('db:getOpenRouterApiKey'),
    saveOpenRouterApiKey: (key) => ipcRenderer.invoke('db:saveOpenRouterApiKey', key)
  },
  
  // API methods
  api: {
    callExternalApi: (messages, modelId) => 
      ipcRenderer.invoke('api:callExternalApi', messages, modelId)
  }
});