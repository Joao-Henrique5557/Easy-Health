*** Begin Patch
*** Update File: frontend/src/screens/RegisterScreen.tsx
@@
-export function RegisterScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
+export function RegisterScreen({ onAuthenticated }: { onAuthenticated?: () => void }) {
   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
@@
     try {
       await authService.register({
         nome,
         email,
         telefone,
         senha,
         dataNascimento: dataNascimentoISO,
       });
-      onAuthenticated();
+      if (onAuthenticated) {
+        onAuthenticated();
+      } else {
+        // fallback: navega para MainTabs/Home se não houver callback
+        try {
+          navigation.reset({ index: 0, routes: [{ name: "MainTabs" as any }] });
+        } catch {
+          // se reset falhar por algum motivo, tenta ir para Home
+          navigation.navigate("MainTabs", { screen: "Home" } as any);
+        }
+      }
     } catch (error) {
       Alert.alert("Não foi possível cadastrar", getApiErrorMessage(error, "Verifique os dados e tente novamente."));
     } finally {
       setLoading(false);
     }
*** End Patch