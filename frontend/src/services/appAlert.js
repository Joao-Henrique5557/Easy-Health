import { Alert as NativeAlert, Platform } from "react-native";

const listeners = new Set();
let nextAlertId = 0;

export function subscribeToAppAlerts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function publish(event) {
  listeners.forEach(listener => listener(event));
}

function dismissAlert(id) {
  publish({
    type: "dismiss",
    id
  });
}

function getAlertKind(title) {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes("sucesso") || normalizedTitle.includes("atualizado") || normalizedTitle.includes("recebida")) {
    return "success";
  }
  if (normalizedTitle.includes("breve") || normalizedTitle.includes("solicitação")) {
    return "info";
  }
  return "error";
}

export const AppAlert = {
  alert(title, message, buttons, options) {
    const id = ++nextAlertId;
    const wrappedButtons = buttons?.map(button => ({
      ...button,
      onPress: () => {
        dismissAlert(id);
        button.onPress?.();
      }
    }));

    publish({
      type: "show",
      alert: {
        id,
        title,
        message,
        kind: getAlertKind(title),
        buttons: wrappedButtons
      }
    });

    if (Platform.OS !== "web") {
      NativeAlert.alert(title, message, wrappedButtons ?? [{
        text: "OK",
        onPress: () => dismissAlert(id)
      }], options);
    }
  }
};
