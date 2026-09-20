import { useNavigation } from "@react-navigation/native";

// Correção de bug: a versão anterior usava uma INTERSEÇÃO de tipos
// (`BottomTabNavigationProp<A> & NativeStackNavigationProp<B>`), que
// funciona por coincidência mas não é o padrão do React Navigation.
// `CompositeNavigationProp` é o tipo oficial para telas que precisam
// navegar tanto dentro das abas quanto na stack raiz (ex: da Home para
// "Emergency", que vive na stack, não nas abas).

export function useAppNavigation() {
  return useNavigation();
}
