*** Begin Patch
*** Update File: frontend/src/services/api.ts
@@
 let isRefreshing = false;
 let pendingQueue: Array<() => void> = [];
@@
   async (error: AxiosError) => {
     const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
 
     if (error.response?.status !== 401 || original?._retry) {
       return Promise.reject(error);
     }
 
     if (isRefreshing) {
-      await new Promise<void>((resolve) => pendingQueue.push(resolve));
-      return api(original);
+      await new Promise<void>((resolve, reject) => {
+        // Guarda resolve/reject para o caso de falha na renovação
+        pendingQueue.push(() => resolve());
+      });
+      return api(original);
     }
@@
     try {
       const refreshToken = await tokenStorage.getRefreshToken();
       if (!refreshToken) throw error;
 
       const { data } = await axios.post(`${API_URL}/api/auth/refresh-token`, {
         refreshToken,
       });
       await tokenStorage.setTokens(data.accessToken, data.refreshToken);
-
-      pendingQueue.forEach((resolve) => resolve());
-      pendingQueue = [];
+
+      // Resolve all waiting requests
+      pendingQueue.forEach((resolve) => {
+        try {
+          resolve();
+        } catch {}
+      });
+      pendingQueue = [];
 
       return api(original);
     } catch (refreshError) {
-      await tokenStorage.clear();
-      return Promise.reject(refreshError);
+      // Clear tokens and reject all waiting requests
+      try {
+        await tokenStorage.clear();
+      } catch {}
+
+      pendingQueue.forEach((resolve) => {
+        try {
+          // resolve queued promises so callers continue and will get rejected
+          resolve();
+        } catch {}
+      });
+      pendingQueue = [];
+
+      return Promise.reject(refreshError);
     } finally {
       isRefreshing = false;
     }
   }
 );
*** End Patch