import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DoctorPatientHistorySection } from "@/components/DoctorPatientHistorySection";
import { Ionicons } from "@expo/vector-icons";
import { AppAlert as Alert } from "@/services/appAlert";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Pill } from "@/components/Pill";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { teamService } from "@/services/teamService";
import { profileService } from "@/services/profileService";
import { getApiErrorMessage } from "@/utils/apiError";

const EMPTY_CLINIC = {
  nome: "",
  tipo: "clinica",
  redeAtendimento: "privado",
  cnpj: "",
  logradouro: "",
  bairro: "",
  cidade: "",
  uf: "AL",
  latitude: "-9.781",
  longitude: "-36.356",
};

const STAFF_ROLES = [
  { value: "funcionario", label: "Funcionário" },
  { value: "medico", label: "Médico" },
];

export function TeamPanelScreen() {
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(null);
  const [painel, setPainel] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [clinicas, setClinicas] = useState([]);

  // Modal de nova clínica
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_CLINIC);

  // Modal de gestão de preços e equipe da clínica selecionada
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [manageTab, setManageTab] = useState("precos");
  const [manageLoading, setManageLoading] = useState(false);
  const [prices, setPrices] = useState([]);
  const [servico, setServico] = useState("");
  const [valor, setValor] = useState("");
  const [savingPrice, setSavingPrice] = useState(false);

  const [members, setMembers] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberCargo, setMemberCargo] = useState("funcionario");
  const [savingMember, setSavingMember] = useState(false);

  const fetchAll = useCallback(async () => {
    const [painelRes, clinicasRes, me] = await Promise.all([
      teamService.getPainel(),
      teamService.listMinhasClinicas().catch(() => []),
      profileService.getMe().catch(() => null),
    ]);

    const cargo = painelRes?.cargo || me?.cargo;
    const adminData =
      cargo === "dono"
        ? await teamService.getAdministracao().catch(() => null)
        : null;
    return { painelRes, clinicasRes, adminData };
  }, []);

  const applyAllData = useCallback(({ painelRes, clinicasRes, adminData }) => {
    setPainel(painelRes);
    setClinicas(clinicasRes);
    setAdminData(adminData);
  }, []);

  const setLoadError = useCallback((error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      setAccessDenied(
        error?.response?.data?.message ||
          "Você não tem permissão para acessar o painel da equipe."
      );
    } else {
      setAccessDenied(
        getApiErrorMessage(error, "Não foi possível carregar o painel.")
      );
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setAccessDenied(null);
    try {
      applyAllData(await fetchAll());
    } catch (error) {
      setLoadError(error);
    } finally {
      setLoading(false);
    }
  }, [applyAllData, fetchAll, setLoadError]);

  useEffect(() => {
    let active = true;
    fetchAll()
      .then((data) => {
        if (active) applyAllData(data);
      })
      .catch((error) => {
        if (active) setLoadError(error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [applyAllData, fetchAll, setLoadError]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreateClinic() {
    const cleanCnpj = form.cnpj.replace(/\D/g, "");
    if (!form.nome.trim() || cleanCnpj.length !== 14) {
      Alert.alert(
        "Dados incompletos",
        "Informe o nome da clínica e um CNPJ válido com 14 dígitos."
      );
      return;
    }

    if (!form.logradouro.trim() || !form.cidade.trim() || !form.uf.trim()) {
      Alert.alert(
        "Endereço obrigatório",
        "Preencha logradouro, cidade e UF."
      );
      return;
    }

    setSaving(true);
    try {
      await teamService.createClinic({
        nome: form.nome.trim(),
        tipo: form.tipo.trim() || "clinica",
        redeAtendimento: form.redeAtendimento.trim() || "privado",
        logradouro: form.logradouro.trim(),
        bairro: form.bairro.trim() || "Centro",
        cidade: form.cidade.trim(),
        uf: form.uf.trim().toUpperCase(),
        latitude: Number(form.latitude) || -9.781,
        longitude: Number(form.longitude) || -36.356,
        cnpj: cleanCnpj,
      });

      setModalVisible(false);
      setForm(EMPTY_CLINIC);
      await loadAll();
      Alert.alert("Sucesso", "Clínica cadastrada com sucesso!");
    } catch (error) {
      Alert.alert(
        "Erro no cadastro",
        getApiErrorMessage(
          error,
          "Não foi possível cadastrar a clínica. Verifique se o CNPJ já existe."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function openManageModal(clinica) {
    setSelectedClinic(clinica);
    setManageTab("precos");
    setServico("");
    setValor("");
    setMemberEmail("");
    setMemberCargo("funcionario");
    setManageLoading(true);

    try {
      const [priceList, teamList] = await Promise.all([
        teamService.listClinicPrices(clinica.id).catch(() => []),
        painel?.cargo === "dono"
          ? teamService.listClinicTeam(clinica.id).catch(() => [])
          : Promise.resolve([]),
      ]);
      setPrices(priceList);
      setMembers(teamList);
    } finally {
      setManageLoading(false);
    }
  }

  async function handleSavePrice() {
    if (!selectedClinic || !servico.trim() || !valor.trim()) {
      Alert.alert("Campos obrigatórios", "Informe o serviço e o valor.");
      return;
    }

    setSavingPrice(true);
    try {
      const updated = await teamService.updateClinicPrice(selectedClinic.id, {
        servico,
        valor,
      });
      setPrices(updated);
      setServico("");
      setValor("");
      Alert.alert("Sucesso", "Tabela de preços atualizada.");
    } catch (error) {
      Alert.alert(
        "Erro",
        getApiErrorMessage(error, "Não foi possível salvar o preço.")
      );
    } finally {
      setSavingPrice(false);
    }
  }

  async function handleAddMember() {
    if (!selectedClinic || !memberEmail.trim()) {
      Alert.alert("Campo obrigatório", "Informe o e-mail do membro.");
      return;
    }

    setSavingMember(true);
    try {
      await teamService.addClinicTeamMember(selectedClinic.id, {
        email: memberEmail,
        cargo: memberCargo,
      });
      setMemberEmail("");
      const updatedList = await teamService.listClinicTeam(selectedClinic.id);
      setMembers(updatedList);
      Alert.alert("Sucesso", "Membro adicionado à equipe da clínica.");
    } catch (error) {
      Alert.alert(
        "Erro",
        getApiErrorMessage(
          error,
          "Não foi possível adicionar o membro. Verifique se o e-mail existe."
        )
      );
    } finally {
      setSavingMember(false);
    }
  }

  async function handleRemoveMember(userId) {
    if (!selectedClinic) return;
    try {
      await teamService.removeClinicTeamMember(selectedClinic.id, userId);
      const updatedList = await teamService.listClinicTeam(selectedClinic.id);
      setMembers(updatedList);
    } catch (error) {
      Alert.alert(
        "Erro",
        getApiErrorMessage(error, "Não foi possível remover o membro.")
      );
    }
  }

  const isOwner = painel?.cargo === "dono";
  const canEditPrices =
    painel?.cargo === "dono" || painel?.cargo === "funcionario";

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: 80,
        }}
      >
        <ScreenHeader
          title="Painel da Equipe"
          onBack={() => navigation.goBack()}
        />

        {loading ? (
          <ActivityIndicator
            color={colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : accessDenied ? (
          <View style={styles.deniedCard}>
            <Ionicons
              name="lock-closed-outline"
              size={34}
              color={colors.alertDark}
            />
            <Text style={styles.deniedTitle}>Acesso Restrito</Text>
            <Text style={styles.deniedText}>{accessDenied}</Text>
            <Text style={styles.deniedHint}>
              Disponível para contas com cargo de funcionário, médico ou dono
              (ex.: roberto.dono@email.com).
            </Text>
          </View>
        ) : (
          <>
            {/* Cartão do Usuário da Equipe */}
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.welcomeLabel}>
                    {painel?.mensagem || "Painel da equipe"}
                  </Text>
                  <Text style={styles.userName}>{painel?.nome}</Text>
                </View>
                <Pill>{(painel?.cargo || "").toUpperCase()}</Pill>
              </View>
            </View>

            {/* Seção Exclusiva do Cargo Dono */}
            {isOwner && (
              <View style={styles.adminCard}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.adminTitle}>
                      {adminData?.mensagem || "Área de Administração"}
                    </Text>
                    <Text style={styles.adminSubtitle}>
                      Permissão total para cadastrar clínicas e gerenciar equipes.
                    </Text>
                  </View>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <Pressable
                  onPress={() => setModalVisible(true)}
                  style={styles.primaryBtn}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={18}
                    color={colors.white}
                  />
                  <Text style={styles.primaryBtnText}>Cadastrar Clínica</Text>
                </Pressable>
              </View>
            )}

            {painel?.cargo === "medico" && <DoctorPatientHistorySection />}

            {/* Lista Minhas Clínicas */}
            <Text style={styles.sectionTitle}>Minhas Clínicas</Text>
            {clinicas.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhuma clínica vinculada a esta conta no momento.
              </Text>
            ) : (
              clinicas.map((clinica, idx) => (
                <View key={clinica.id || idx} style={styles.clinicCard}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.clinicName}>{clinica.nome}</Text>
                    <Pill>{clinica.redeAtendimento || "privado"}</Pill>
                  </View>
                  {clinica.cnpj && (
                    <Text style={styles.clinicMeta}>CNPJ: {clinica.cnpj}</Text>
                  )}
                  <Text style={styles.clinicMeta}>
                    {[clinica.logradouro, clinica.bairro, clinica.cidade, clinica.uf]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>

                  {(isOwner || canEditPrices) && clinica.id && (
                    <Pressable
                      onPress={() => openManageModal(clinica)}
                      style={styles.manageBtn}
                    >
                      <Ionicons
                        name="settings-outline"
                        size={15}
                        color={colors.primaryDark}
                      />
                      <Text style={styles.manageBtnText}>
                        {isOwner
                          ? "Gerenciar Preços e Equipe"
                          : "Atualizar Preços"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Modal de Cadastro de Clínica */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.overlay}
        >
          <View style={styles.sheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Clínica</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.inkSoft} />
              </Pressable>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Nome da Clínica *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Clínica Bem Viver"
                placeholderTextColor={colors.inkFaint}
                value={form.nome}
                onChangeText={(v) => updateField("nome", v)}
              />

              <Text style={styles.label}>CNPJ (14 dígitos) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: 12345678000199"
                placeholderTextColor={colors.inkFaint}
                keyboardType="numeric"
                maxLength={18}
                value={form.cnpj}
                onChangeText={(v) => updateField("cnpj", v)}
              />

              <View style={styles.twoCols}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Tipo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="clinica"
                    placeholderTextColor={colors.inkFaint}
                    value={form.tipo}
                    onChangeText={(v) => updateField("tipo", v)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Rede</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="privado ou sus"
                    placeholderTextColor={colors.inkFaint}
                    value={form.redeAtendimento}
                    onChangeText={(v) => updateField("redeAtendimento", v)}
                  />
                </View>
              </View>

              <Text style={styles.label}>Logradouro *</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua / Avenida"
                placeholderTextColor={colors.inkFaint}
                value={form.logradouro}
                onChangeText={(v) => updateField("logradouro", v)}
              />

              <Text style={styles.label}>Bairro</Text>
              <TextInput
                style={styles.input}
                placeholder="Centro"
                placeholderTextColor={colors.inkFaint}
                value={form.bairro}
                onChangeText={(v) => updateField("bairro", v)}
              />

              <View style={styles.twoCols}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.label}>Cidade *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Campo Alegre"
                    placeholderTextColor={colors.inkFaint}
                    value={form.cidade}
                    onChangeText={(v) => updateField("cidade", v)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>UF *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="AL"
                    placeholderTextColor={colors.inkFaint}
                    maxLength={2}
                    autoCapitalize="characters"
                    value={form.uf}
                    onChangeText={(v) => updateField("uf", v)}
                  />
                </View>
              </View>

              <View style={styles.twoCols}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Latitude</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numbers-and-punctuation"
                    value={form.latitude}
                    onChangeText={(v) => updateField("latitude", v)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Longitude</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numbers-and-punctuation"
                    value={form.longitude}
                    onChangeText={(v) => updateField("longitude", v)}
                  />
                </View>
              </View>

              <Pressable
                onPress={handleCreateClinic}
                disabled={saving}
                style={[styles.primaryBtn, saving && { opacity: 0.6 }]}
              >
                <Text style={styles.primaryBtnText}>
                  {saving ? "Salvando..." : "Salvar Clínica"}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de Gestão da Clínica (Preços e Equipe) */}
      <Modal
        visible={Boolean(selectedClinic)}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedClinic(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.overlay}
        >
          <View style={styles.sheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedClinic?.nome}
              </Text>
              <Pressable onPress={() => setSelectedClinic(null)}>
                <Ionicons name="close" size={24} color={colors.inkSoft} />
              </Pressable>
            </View>

            {/* Abas internas */}
            <View style={styles.tabRow}>
              <Pressable
                onPress={() => setManageTab("precos")}
                style={[
                  styles.tabBtn,
                  manageTab === "precos" && styles.tabBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    manageTab === "precos" && styles.tabBtnTextActive,
                  ]}
                >
                  Preços
                </Text>
              </Pressable>

              {isOwner && (
                <Pressable
                  onPress={() => setManageTab("equipe")}
                  style={[
                    styles.tabBtn,
                    manageTab === "equipe" && styles.tabBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      manageTab === "equipe" && styles.tabBtnTextActive,
                    ]}
                  >
                    Equipe
                  </Text>
                </Pressable>
              )}
            </View>

            {manageLoading ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginVertical: 24 }}
              />
            ) : manageTab === "precos" ? (
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Serviço / Consulta *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: Consulta Cardiologia"
                  placeholderTextColor={colors.inkFaint}
                  value={servico}
                  onChangeText={setServico}
                />

                <Text style={styles.label}>Valor *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: R$ 250,00"
                  placeholderTextColor={colors.inkFaint}
                  value={valor}
                  onChangeText={setValor}
                />

                <Pressable
                  onPress={handleSavePrice}
                  disabled={savingPrice}
                  style={[
                    styles.primaryBtn,
                    { marginTop: 2, marginBottom: 18 },
                    savingPrice && { opacity: 0.6 },
                  ]}
                >
                  <Text style={styles.primaryBtnText}>
                    {savingPrice ? "Salvando..." : "Salvar Preço"}
                  </Text>
                </Pressable>

                <Text style={styles.sectionTitle}>Preços Cadastrados</Text>
                {prices.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Nenhum preço cadastrado ainda.
                  </Text>
                ) : (
                  prices.map((p, idx) => (
                    <View key={p.id || idx} style={styles.itemRow}>
                      <Text style={styles.itemTitle}>{p.servico}</Text>
                      <Text style={styles.priceValue}>{p.valor}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>E-mail do Usuário *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: ana.medica@email.com"
                  placeholderTextColor={colors.inkFaint}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={memberEmail}
                  onChangeText={setMemberEmail}
                />

                <Text style={styles.label}>Cargo na Clínica *</Text>
                <View style={styles.roleRow}>
                  {STAFF_ROLES.map((role) => {
                    const active = memberCargo === role.value;
                    return (
                      <Pressable
                        key={role.value}
                        onPress={() => setMemberCargo(role.value)}
                        style={[
                          styles.roleChip,
                          active && styles.roleChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleChipText,
                            active && styles.roleChipTextActive,
                          ]}
                        >
                          {role.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  onPress={handleAddMember}
                  disabled={savingMember}
                  style={[
                    styles.primaryBtn,
                    { marginTop: 4, marginBottom: 18 },
                    savingMember && { opacity: 0.6 },
                  ]}
                >
                  <Text style={styles.primaryBtnText}>
                    {savingMember ? "Adicionando..." : "Adicionar à Equipe"}
                  </Text>
                </Pressable>

                <Text style={styles.sectionTitle}>Membros Vinculados</Text>
                {members.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Nenhum membro vinculado a esta clínica.
                  </Text>
                ) : (
                  members.map((m, idx) => {
                    const uid = m.userId || m.id;
                    return (
                      <View key={uid || idx} style={styles.itemRow}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                          <Text style={styles.itemTitle}>
                            {m.nome || m.email}
                          </Text>
                          <Text style={styles.clinicMeta}>
                            {m.email ? `${m.email} • ` : ""}
                            {(m.cargo || "").toUpperCase()}
                          </Text>
                        </View>
                        {uid && (
                          <Pressable
                            onPress={() => handleRemoveMember(uid)}
                            style={styles.removeBtn}
                          >
                            <Text style={styles.removeBtnText}>Remover</Text>
                          </Pressable>
                        )}
                      </View>
                    );
                  })
                )}
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 14,
  },
  adminCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.inkSoft,
  },
  userName: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
    marginTop: 2,
  },
  adminTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primaryDark,
  },
  adminSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 4,
  },
  primaryBtn: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.white,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15.5,
    color: colors.ink,
    marginBottom: 10,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.inkSoft,
    paddingVertical: 12,
  },
  clinicCard: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  clinicName: {
    fontFamily: fonts.bold,
    fontSize: 14.5,
    color: colors.ink,
    flex: 1,
    marginRight: 8,
  },
  clinicMeta: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 4,
  },
  manageBtn: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingVertical: 9,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  manageBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 12.5,
    color: colors.primaryDark,
  },
  deniedCard: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    padding: 20,
    alignItems: "center",
    marginTop: 12,
  },
  deniedTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
    marginTop: 10,
  },
  deniedText: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    color: colors.alertDark,
    textAlign: "center",
    marginTop: 6,
  },
  deniedHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "88%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.ink,
    flex: 1,
    marginRight: 10,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.md,
    backgroundColor: colors.panel,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  tabBtnActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  tabBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.inkSoft,
  },
  tabBtnTextActive: {
    color: colors.primaryDark,
  },
  roleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
  },
  roleChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  roleChipText: {
    fontFamily: fonts.semiBold,
    fontSize: 12.5,
    color: colors.inkSoft,
  },
  roleChipTextActive: {
    color: colors.primaryDark,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 8,
  },
  itemTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 13.5,
    color: colors.ink,
  },
  priceValue: {
    fontFamily: fonts.bold,
    fontSize: 13.5,
    color: colors.primary,
  },
  removeBtn: {
    backgroundColor: colors.alertSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeBtnText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.alertDark,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.inkSoft,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 13.5,
    color: colors.ink,
    marginBottom: 12,
  },
  twoCols: {
    flexDirection: "row",
    gap: 10,
  },
});