import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
  FirstAid: undefined;
  FirstAidDetail: { id: string };
  Emergency: undefined;
  EstablishmentDetail: { id: string };
  Booking: { establishmentId: string };
  BookingConfirmation: { bookingId: string };
  ConsultationDetail: { id: string };
  Notifications: undefined;
  Favorites: undefined;
  EditProfile: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Search: { query?: string } | undefined;
  History: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
