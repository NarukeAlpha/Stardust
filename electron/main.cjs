const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

// Use in-memory storage for now
// Later we can integrate sql.js for persistent storage without Python dependencies
const store = {
  sessions: [],
  messages: [],
  agents: [],
  mcpConnections: [],
  archivedSessions: [],
  archivedMessages: [],
  settings: {
    openRouterApiKey: ''
  }
};

// Load state from file if it exists
function loadStoredData() {
  const dataPath = path.join(app.getPath('userData'), 'stardust-data.json');
  try {
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Handle backward compatibility - migrate old chats to sessions
      if (data.chats && data.chats.length > 0 && (!data.sessions || data.sessions.length === 0)) {
        console.log('Migrating old chats to sessions format');
        store.sessions = data.chats.map(chat => ({
          id: chat.id,
          sessionId: chat.id.toString(),
          name: chat.name,
          modelId: 'gpt-4o',
          flowId: 'default',
          messageCount: 0,
          createdAt: chat.createdAt,
          updatedAt: chat.createdAt,
          isDeleted: false
        }));
        
        // Update message format too
        if (data.messages && data.messages.length > 0) {
          store.messages = data.messages.map(msg => ({
            id: msg.id,
            sessionId: msg.chatId.toString(),
            content: msg.content,
            isUser: msg.isUser,
            agentId: '',
            flowId: 'default',
            timestamp: msg.timestamp
          }));
        }
      } else {
        store.sessions = data.sessions || [];
        store.messages = data.messages || [];
      }
      
      store.agents = data.agents || [];
      store.mcpConnections = data.mcpConnections || [];
      store.archivedSessions = data.archivedSessions || [];
      store.archivedMessages = data.archivedMessages || [];
      store.settings = data.settings || { openRouterApiKey: '' };
      console.log('Loaded stored data');
    }
  } catch (error) {
    console.error('Failed to load stored data:', error);
  }
}

// Save state to file
function saveStoredData() {
  const dataPath = path.join(app.getPath('userData'), 'stardust-data.json');
  try {
    fs.writeFileSync(dataPath, JSON.stringify(store), 'utf8');
    console.log('Saved data to', dataPath);
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        }
    });
    
    if (isDev) {
        // Load from dev server
        mainWindow.loadURL('http://localhost:5173');
        // Open DevTools in development mode
        mainWindow.webContents.openDevTools();
    } else {
        // Load production build
        mainWindow.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
    }
}

// Set up IPC handlers for database operations
function setupIpcHandlers() {
  // Session handlers
  ipcMain.handle('db:getSessions', () => {
    return store.sessions;
  });
  
  ipcMain.handle('db:createSession', (_, session) => {
    // Generate a UUID for the session ID if not provided
    if (!session.sessionId) {
      session.sessionId = require('crypto').randomUUID();
    }
    
    // Set current timestamps
    const now = new Date().toISOString();
    session.createdAt = now;
    session.updatedAt = now;
    session.messageCount = 0;
    session.isDeleted = false;
    
    // Generate a unique ID
    session.id = Date.now();
    
    store.sessions.push(session);
    saveStoredData();
    return session;
  });
  
  ipcMain.handle('db:deleteSessions', (_, sessionIds) => {
    // Soft delete - mark as deleted
    for (const sessionId of sessionIds) {
      const session = store.sessions.find(s => s.sessionId === sessionId);
      if (session) {
        session.isDeleted = true;
        session.updatedAt = new Date().toISOString();
      }
    }
    saveStoredData();
    return true;
  });
  
  ipcMain.handle('db:archiveSessions', () => {
    // Move deleted sessions to archive
    const deletedSessions = store.sessions.filter(s => s.isDeleted);
    const remainingSessions = store.sessions.filter(s => !s.isDeleted);
    
    // Add to archive with timestamp
    const now = new Date().toISOString();
    for (const session of deletedSessions) {
      store.archivedSessions.push({
        ...session,
        archivedAt: now
      });
      
      // Archive related messages
      const sessionMessages = store.messages.filter(m => m.sessionId === session.sessionId);
      store.archivedMessages.push(...sessionMessages);
    }
    
    // Remove archived messages from main storage
    const sessionIdsToArchive = deletedSessions.map(s => s.sessionId);
    store.messages = store.messages.filter(m => !sessionIdsToArchive.includes(m.sessionId));
    
    // Update sessions
    store.sessions = remainingSessions;
    
    saveStoredData();
    return true;
  });
  
  // Message handlers
  ipcMain.handle('db:getSessionMessages', (_, sessionId) => {
    return store.messages.filter(msg => msg.sessionId === sessionId);
  });
  
  ipcMain.handle('db:sendMessage', (_, sessionId, message, modelId, flowId) => {
    // First save the user message
    const userMessage = {
      id: Date.now(),
      sessionId,
      content: message.content,
      isUser: true,
      agentId: message.agentId || '',
      flowId: flowId || 'default',
      timestamp: new Date().toISOString()
    };
    
    store.messages.push(userMessage);
    
    // Then create and save a mock AI response
    const aiResponse = {
      id: Date.now() + 1,
      sessionId,
      content: `This is a simulated response from Electron for: "${message.content}" using model: ${modelId}, flow: ${flowId}`,
      isUser: false,
      agentId: message.agentId || '',
      flowId: flowId || 'default',
      timestamp: new Date().toISOString()
    };
    
    store.messages.push(aiResponse);
    
    // Update message count in session
    const session = store.sessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.messageCount += 2;
      session.updatedAt = new Date().toISOString();
    }
    
    saveStoredData();
    return aiResponse;
  });
  
  // Agent handlers
  ipcMain.handle('db:getAgents', () => {
    return store.agents;
  });
  
  ipcMain.handle('db:saveAgent', (_, agent) => {
    const existingIndex = store.agents.findIndex(a => a.id === agent.id);
    if (existingIndex >= 0) {
      store.agents[existingIndex] = agent;
    } else {
      store.agents.push(agent);
    }
    saveStoredData();
    return agent;
  });
  
  ipcMain.handle('db:deleteAgent', (_, id) => {
    store.agents = store.agents.filter(agent => agent.id !== id);
    saveStoredData();
    return true;
  });
  
  // MCP Connection handlers
  ipcMain.handle('db:getMCPConnections', () => {
    return store.mcpConnections;
  });
  
  ipcMain.handle('db:saveMCPConnection', (_, connection) => {
    const existingIndex = store.mcpConnections.findIndex(c => c.id === connection.id);
    if (existingIndex >= 0) {
      store.mcpConnections[existingIndex] = connection;
    } else {
      store.mcpConnections.push(connection);
    }
    saveStoredData();
    return connection;
  });
  
  ipcMain.handle('db:deleteMCPConnection', (_, id) => {
    store.mcpConnections = store.mcpConnections.filter(conn => conn.id !== id);
    saveStoredData();
    return true;
  });
  
  // Settings handlers
  ipcMain.handle('db:getOpenRouterApiKey', () => {
    return store.settings.openRouterApiKey;
  });
  
  ipcMain.handle('db:saveOpenRouterApiKey', (_, key) => {
    store.settings.openRouterApiKey = key;
    saveStoredData();
    return true;
  });
  
  // API handlers
  ipcMain.handle('api:callExternalApi', (_, messages, modelId) => {
    // Mock implementation for now
    const lastMessage = messages[messages.length - 1];
    return `This is a simulated API response for: "${lastMessage.content}" using model: ${modelId || 'default'}`;
  });
}

app.whenReady().then(() => {
    loadStoredData();
    setupIpcHandlers();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Save data when app is about to quit
app.on('before-quit', () => {
    saveStoredData();
});
