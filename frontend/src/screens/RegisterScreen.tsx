*** Begin Patch
*** Update File: frontend/src/screens/RegisterScreen.tsx
@@
-      if (onAuthenticated) {
-        onAuthenticated();
-      } else {
-        // fallback: navega para MainTabs/Home se não houver callback
-        try {
-          navigation.reset({ index: 0, routes: [{ name: "MainTabs" as any }] });
-        } catch {
-          // se reset falhar por algum motivo, tenta ir para Home
-          navigation.navigate("MainTabs", { screen: "Home" } as any);
-        }
-      }
+      if (onAuthenticated) {
+        onAuthenticated();
+      } else {
+        // fallback: navega para MainTabs/Home se não houver callback
+        try {
+          // Quando o RootNavigator usa MainTabs, navegamos para a aba Home.
+          navigation.reset({ index: 0, routes: [{ name: "MainTabs" as any }] });
+        } catch {
+          // se reset falhar por algum motivo (tipos ou runtime), tenta ir para Home
+          try {
+            navigation.navigate("MainTabs", { screen: "Home" } as any);
+          } catch {}
+        }
+      }
*** End Patch