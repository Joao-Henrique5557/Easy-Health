*** Begin Patch
*** Update File: frontend/src/services/tokenStorage.ts
@@
-const isWeb = Platform.OS === "web";
+const isWeb = Platform.OS === "web";
@@
 async function getItem(key: string): Promise<string | null> {
-  return isWeb ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key);
+  if (isWeb) return AsyncStorage.getItem(key);
+  try {
+    return await SecureStore.getItemAsync(key);
+  } catch (err) {
+    // Fallback para AsyncStorage se SecureStore falhar em runtime (evita crashes na web/native)
+    try {
+      return AsyncStorage.getItem(key);
+    } catch {
+      return null;
+    }
+  }
 }
@@
 async function setItem(key: string, value: string): Promise<void> {
-  await (isWeb ? AsyncStorage.setItem(key, value) : SecureStore.setItemAsync(key, value));
+  if (isWeb) return AsyncStorage.setItem(key, value);
+  try {
+    return await SecureStore.setItemAsync(key, value);
+  } catch {
+    try {
+      return AsyncStorage.setItem(key, value);
+    } catch {
+      // swallow - storage best-effort
+    }
+  }
 }
@@
 async function deleteItem(key: string): Promise<void> {
-  await (isWeb ? AsyncStorage.removeItem(key) : SecureStore.deleteItemAsync(key));
+  if (isWeb) return AsyncStorage.removeItem(key);
+  try {
+    return await SecureStore.deleteItemAsync(key);
+  } catch {
+    try {
+      return AsyncStorage.removeItem(key);
+    } catch {
+      // swallow
+    }
+  }
 }
*** End Patch