// src/stores/audit.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';
import { safeStorage } from '@/utils/errorHandler';

export const useAuditStore = defineStore('audit', () => {
  const logs = ref([]);

  const loadLogsFromStorage = () => {
    const storedLogs = safeStorage.getItem('audit-logs', []);
    if (Array.isArray(storedLogs)) {
      logs.value = storedLogs;
    }
  };

  const saveLogsToStorage = () => {
    safeStorage.setItem('audit-logs', logs.value);
  };

  const addLog = (activity, details = {}, user = null) => {
    const authStore = useAuthStore();
    const logUser = user ? { id: user.id, name: user.userName } : (authStore.currentUser ? { id: authStore.currentUser.id, name: authStore.currentUser.userName } : { id: 'system', name: 'System' });
    const logEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      user: logUser,
      activity,
      details,
    };
    logs.value.unshift(logEntry);
    saveLogsToStorage();
  };

  const deleteLog = (logId) => {
    const logIndex = logs.value.findIndex((log) => log.id === logId);
    if (logIndex > -1) {
      logs.value.splice(logIndex, 1);
      saveLogsToStorage();
    }
  };

  // Initialize store
  loadLogsFromStorage();

  return {
    logs,
    addLog,
    deleteLog,
    loadLogsFromStorage,
  };
});
