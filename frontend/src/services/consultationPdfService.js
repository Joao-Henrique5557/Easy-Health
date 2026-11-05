import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function formatDate(value) {
  if (!value) return "Não informada";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "Não informada" : date.toLocaleDateString("pt-BR");
}

function consultationHtml(consultation) {
  const status = consultation.status === "concluido" || consultation.status === "realizada"
    ? "Realizada"
    : consultation.status === "cancelado" ? "Cancelada" : "Agendada";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Resumo de consulta</title>
<style>
body{font-family:Arial,sans-serif;color:#111827;margin:40px;line-height:1.5}
h1{color:#047857;font-size:22px}.notice{border:1px solid #d1d5db;padding:12px;margin:20px 0}
dt{font-weight:bold;margin-top:12px}dd{margin-left:0}
</style></head>
<body>
<h1>Resumo de consulta</h1>
<p>Documento informativo gerado pelo Easy Health.</p>
<dl>
<dt>Data</dt><dd>${escapeHtml(formatDate(consultation.data))}</dd>
<dt>Horário</dt><dd>${escapeHtml(consultation.horario || "Não informado")}</dd>
<dt>Especialidade</dt><dd>${escapeHtml(consultation.especialidade || "Não informada")}</dd>
<dt>Local</dt><dd>${escapeHtml(consultation.local || consultation.establishmentNome || "Não informado")}</dd>
<dt>Status</dt><dd>${escapeHtml(status)}</dd>
</dl>
<div class="notice"><strong>Este documento é apenas um resumo de agendamento/consulta. Não é receita, atestado, laudo ou orientação médica.</strong></div>
</body></html>`;
}

export const consultationPdfService = {
  async shareSummary(consultation) {
    const html = consultationHtml(consultation);
    if (Platform.OS === "web") {
      await Print.printAsync({ html });
      return;
    }
    const { uri } = await Print.printToFileAsync({ html });
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      throw new Error("O compartilhamento de PDF não está disponível neste dispositivo.");
    }
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Compartilhar resumo da consulta",
      UTI: "com.adobe.pdf"
    });
  }
};
