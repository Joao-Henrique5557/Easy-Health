*** Begin Patch
*** Update File: frontend/src/screens/LoginScreen.tsx
@@
-export function LoginScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
+export function LoginScreen({ onAuthenticated }: { onAuthenticated?: () => void }) {
@@
       try {
         await authService.login({ email, senha });
-      onAuthenticated();
+      if (onAuthenticated) onAuthenticated();
       } catch (error) {
         Alert.alert("Não foi possível entrar", getApiErrorMessage(error, "Verifique seu e-mail e senha e tente novamente."));
       } finally {
         setLoading(false);
       }
*** End Patch