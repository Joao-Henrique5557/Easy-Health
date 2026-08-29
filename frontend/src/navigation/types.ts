export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  FirstAidDetail: { id: string };
  Emergency: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  FirstAid: undefined;
  Search: undefined;
  History: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
