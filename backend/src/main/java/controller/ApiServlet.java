package controller;

import com.google.gson.*;
import dao.TokenDAO;
import dao.UserDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import model.User;
import util.Database;
import util.Json;
import util.Password;

import java.io.IOException;
import java.sql.SQLException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Controller único e didático do MVP. Em um sistema maior, cada recurso pode
 * virar um servlet separado; aqui a tabela de rotas fica visível para estudantes.
 */
@WebServlet({"/health", "/api/*"})
public class ApiServlet extends HttpServlet {
    private final UserDAO users = new UserDAO();
    private final TokenDAO tokens = new TokenDAO();
    private final Map<String, List<JsonObject>> bookings = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> favorites = new ConcurrentHashMap<>();
    private final Map<String, List<JsonObject>> notifications = new ConcurrentHashMap<>();

    @Override protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setHeader("Access-Control-Allow-Origin", Database.env("CORS_ORIGIN", "*"));
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        if ("OPTIONS".equals(req.getMethod())) { res.setStatus(204); return; }
        try { route(req, res); }
        catch (Exception e) { e.printStackTrace(); Json.send(res, 500, Json.error("Erro interno do servidor")); }
    }

    private void route(HttpServletRequest req, HttpServletResponse res) throws Exception {
        String path = req.getRequestURI().substring(req.getContextPath().length());
        JsonObject body = Json.body(req);
        if ("/health".equals(path)) { health(res); return; }
        if (path.startsWith("/api/auth/")) { auth(req, res, path, body); return; }
        String userId = authenticatedUser(req);
        if (path.startsWith("/api/users")) { user(res, req, path, body, userId); return; }
        if (path.startsWith("/api/primeiros-socorros")) { firstAid(res, path, req); return; }
        if (path.startsWith("/api/estabelecimentos") || "/api/especialidades".equals(path)) { establishments(res, path, req); return; }
        if (path.startsWith("/api/emergencia")) { emergency(res, path); return; }
        if (path.startsWith("/api/favoritos")) { require(userId, res); if (userId != null) favorite(req, res, path, body, userId); return; }
        if (path.startsWith("/api/notificacoes")) { require(userId, res); if (userId != null) notification(req, res, path, userId); return; }
        if (path.startsWith("/api/agendamentos") || path.startsWith("/api/historico")) { require(userId, res); if (userId != null) schedule(req, res, path, body, userId); return; }
        if (path.startsWith("/api/localizacao")) { location(res, path, req); return; }
        if (path.startsWith("/api/assistant")) { assistant(res, body); return; }
        Json.send(res, 404, Json.error("Rota não encontrada"));
    }

    private void health(HttpServletResponse res) throws IOException { JsonObject out = new JsonObject(); out.addProperty("status", "ok"); out.addProperty("database", Database.available()); Json.send(res, 200, out); }

    private void auth(HttpServletRequest req, HttpServletResponse res, String path, JsonObject b) throws Exception {
        if (path.equals("/api/auth/register") && "POST".equals(req.getMethod())) {
            try { User user = users.create(value(b,"nome"), value(b,"email"), Password.hash(value(b,"senha")), value(b,"telefone")); Json.send(res, 201, authResponse(user)); }
            catch (SQLException e) { if ("23505".equals(e.getSQLState())) Json.send(res, 409, Json.error("E-mail já cadastrado")); else throw e; }
        } else if (path.equals("/api/auth/login")) {
            User user = users.byEmail(value(b,"email"));
            if (user == null || !Password.matches(value(b,"senha"), user.senhaHash)) { Json.send(res, 401, Json.error("Credenciais inválidas")); return; }
            Json.send(res, 200, authResponse(user));
        } else if (path.equals("/api/auth/refresh-token")) {
            String id = tokens.user(value(b,"refreshToken")); if (id == null) { Json.send(res, 401, Json.error("Refresh token inválido")); return; } Json.send(res, 200, authResponse(users.find(id)));
        } else if (path.equals("/api/auth/logout")) { String id = authenticatedUser(req); if (id != null) tokens.revoke(id); Json.send(res, 200, message("Sessão encerrada")); }
        else if (path.matches("/api/auth/(forgot-password|reset-password|verify-email)")) Json.send(res, 200, message("Operação registrada; código seria enviado por e-mail."));
        else Json.send(res, 404, Json.error("Rota de autenticação não encontrada"));
    }

    private void user(HttpServletResponse res, HttpServletRequest req, String path, JsonObject b, String id) throws Exception {
        require(id, res); if (id == null) return;
        User user = users.find(id);
        if (path.equals("/api/users/me") && "PUT".equals(req.getMethod())) { copyProfile(b, user); users.update(user); }
        else if (path.endsWith("/avatar")) user.avatarUrl = value(b,"avatarUrl", user.avatarUrl);
        if (path.equals("/api/users/me") && "GET".equals(req.getMethod()) || path.endsWith("/avatar")) Json.send(res, 200, user);
        else Json.send(res, 200, message("Atualizado"));
    }

    private void firstAid(HttpServletResponse res, String path, HttpServletRequest req) throws IOException {
        JsonArray all = new JsonArray(); all.add(guide("engasgo", "Engasgo", "Orientações para desobstrução das vias aéreas", "alert", "Incentive a tossir", "Ligue 192 se não melhorar")); all.add(guide("queimadura", "Queimaduras", "Primeiros cuidados em queimaduras", "fire", "Resfrie com água corrente", "Não estoure bolhas"));
        if (path.matches(".*/(engasgo|queimadura)")) { Json.send(res, 200, all.get(0)); return; }
        if (path.endsWith("/categorias")) { JsonArray categories = new JsonArray(); for (JsonElement e: all) { JsonObject x=e.getAsJsonObject(); JsonObject c=new JsonObject(); c.add("id",x.get("id")); c.add("titulo",x.get("titulo")); c.add("icon",x.get("icon")); categories.add(c); } Json.send(res,200,categories); return; }
        String q=req.getParameter("query"); if (q != null) { JsonArray filtered=new JsonArray(); for(JsonElement e:all) if(e.toString().toLowerCase().contains(q.toLowerCase())) filtered.add(e); Json.send(res,200,filtered); } else Json.send(res,200,all);
    }

    private void establishments(HttpServletResponse res, String path, HttpServletRequest req) throws IOException {
        JsonObject h=establishment(); if(path.endsWith("/especialidades")){JsonArray a=new JsonArray();a.add("Cardiologia");a.add("Clínica médica");Json.send(res,200,a);return;} if(path.endsWith("/precos")){JsonArray a=new JsonArray();JsonObject x=new JsonObject();x.addProperty("servico","Consulta");x.addProperty("valor","R$ 280");a.add(x);Json.send(res,200,a);return;} if(path.endsWith("/horarios-disponiveis")){JsonArray a=new JsonArray();for(String x:new String[]{"08:00","09:30","10:00","11:30","14:00"})a.add(x);Json.send(res,200,a);return;} if(path.matches(".*/hosp-sao-lucas")){Json.send(res,200,h);return;} JsonArray a=new JsonArray(); if(!"laboratorio".equals(req.getParameter("tipo")))a.add(h);Json.send(res,200,a);
    }

    private void emergency(HttpServletResponse res, String path) throws IOException { if(path.endsWith("/contatos")){JsonArray a=new JsonArray();a.add(contact("SAMU","192","Emergências de saúde"));a.add(contact("Bombeiros","193","Resgates"));a.add(contact("Polícia","190","Segurança pública"));Json.send(res,200,a);return;} JsonArray a=new JsonArray(); JsonObject h=establishment();h.addProperty("distanciaKm",0.0);h.addProperty("aberto24h",true);a.add(h);Json.send(res,200,a); }

    private void favorite(HttpServletRequest req,HttpServletResponse res,String path,JsonObject b,String uid)throws IOException {Set<String> set=favorites.computeIfAbsent(uid,k->ConcurrentHashMap.newKeySet());String eid=path.equals("/api/favoritos")?value(b,"estabelecimentoId"):path.substring(path.lastIndexOf('/')+1);if("POST".equals(req.getMethod()))set.add(eid);if("DELETE".equals(req.getMethod()))set.remove(eid);JsonArray out=new JsonArray();for(String id:set){JsonObject x=establishment();x.addProperty("id",id);x.addProperty("favorito",true);out.add(x);}Json.send(res,200,out);}

    private void notification(HttpServletRequest req, HttpServletResponse res, String path, String uid) throws IOException {
        List<JsonObject> list = notifications.computeIfAbsent(uid, k -> new ArrayList<>(List.of(note("Bem-vindo ao Easy Health", "Seu perfil está pronto."))));
        if (path.endsWith("marcar-todas-lidas")) list.forEach(x -> x.addProperty("lida", true));
        else if (path.endsWith("/lida")) { String[] parts = path.split("/"); String id = parts.length > 3 ? parts[3] : ""; list.stream().filter(x -> id.equals(value(x, "id"))).forEach(x -> x.addProperty("lida", true)); }
        else if ("DELETE".equals(req.getMethod()) && path.matches(".*/notificacoes/[^/]+")) list.removeIf(x -> path.endsWith(value(x, "id")));
        Json.send(res, 200, list);
    }

    private void schedule(HttpServletRequest req,HttpServletResponse res,String path,JsonObject b,String uid)throws IOException {if(path.equals("/api/agendamentos")&&"POST".equals(req.getMethod())){JsonObject x=b.deepCopy();x.addProperty("id",UUID.randomUUID().toString());x.addProperty("establishmentNome","Hospital São Lucas");x.addProperty("medico","Dr. Carlos Mendes");x.addProperty("medicoCrm","CRM 12345");x.addProperty("valor","R$ 280");bookings.computeIfAbsent(uid,k->new ArrayList<>()).add(x);Json.send(res,201,x);return;}if(path.startsWith("/api/historico/exames")||path.startsWith("/api/historico/vacinas")||path.startsWith("/api/historico/medicamentos")||path.startsWith("/api/historico/documentos")){Json.send(res,200,new JsonArray());return;}Json.send(res,200,bookings.getOrDefault(uid,new ArrayList<>()));}
    private void location(HttpServletResponse res,String path,HttpServletRequest req)throws IOException {JsonObject x=new JsonObject();x.addProperty("latitude",Double.parseDouble(Optional.ofNullable(req.getParameter("latitude")).orElse("0")));x.addProperty("longitude",Double.parseDouble(Optional.ofNullable(req.getParameter("longitude")).orElse("0")));x.addProperty("endereco",req.getParameter("endereco"));Json.send(res,200,x);}
    private void assistant(HttpServletResponse res,JsonObject b)throws IOException {JsonObject x=new JsonObject();x.addProperty("reply","Posso ajudar você a encontrar recursos do Easy Health. Não faço diagnósticos nem prescrevo tratamentos. Em uma emergência, ligue para o 192.");x.add("screen",JsonNull.INSTANCE);Json.send(res,200,x);}

    private String authenticatedUser(HttpServletRequest req)throws Exception {String h=req.getHeader("Authorization");if(h==null||h.isBlank())h=req.getHeader("X-Access-Token");if(h==null||h.isBlank())h=req.getParameter("accessToken");if(h==null||h.isBlank())return null;String token=h.startsWith("Bearer ")?h.substring(7).trim():h.trim();return tokens.user(token);}
    private void require(String id,HttpServletResponse res)throws IOException {if(id==null)Json.send(res,401,Json.error("Autenticação necessária. Use Authorization: Bearer <token>"));}
    private JsonObject authResponse(User u)throws Exception {JsonObject x=new JsonObject();JsonElement usuario=new Gson().toJsonTree(u);x.add("usuario",usuario);x.add("user",usuario);x.addProperty("accessToken",tokens.issue(u.id));x.addProperty("refreshToken",tokens.issue(u.id));return x;}
    private static String value(JsonObject o,String k){return value(o,k,"");} private static String value(JsonObject o,String k,String fallback){return o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsString():fallback;}
    private static void copyProfile(JsonObject b,User u){u.nome=value(b,"nome",u.nome);u.telefone=value(b,"telefone",u.telefone);u.avatarUrl=value(b,"avatarUrl",u.avatarUrl);u.tipoSanguineo=value(b,"tipoSanguineo",u.tipoSanguineo);u.alergias=value(b,"alergias",u.alergias);u.medicamentosEmUso=value(b,"medicamentosEmUso",u.medicamentosEmUso);u.planoDeSaude=value(b,"planoDeSaude",u.planoDeSaude);u.contatoEmergenciaNome=value(b,"contatoEmergenciaNome",u.contatoEmergenciaNome);u.contatoEmergenciaTelefone=value(b,"contatoEmergenciaTelefone",u.contatoEmergenciaTelefone);u.contatoEmergenciaParentesco=value(b,"contatoEmergenciaParentesco",u.contatoEmergenciaParentesco);}
    private static JsonObject message(String m){JsonObject x=new JsonObject();x.addProperty("message",m);return x;} private static JsonObject guide(String id,String title,String summary,String icon,String... steps){JsonObject x=new JsonObject();x.addProperty("id",id);x.addProperty("titulo",title);x.addProperty("resumo",summary);x.addProperty("icon",icon);JsonArray a=new JsonArray();for(String s:steps)a.add(s);x.add("passos",a);return x;} private static JsonObject establishment(){JsonObject x=new JsonObject();x.addProperty("id","hosp-sao-lucas");x.addProperty("nome","Hospital São Lucas");x.addProperty("tipo","hospital");x.addProperty("redeAtendimento","privado");x.addProperty("endereco","Av. Paulista, 1000 - São Paulo");x.addProperty("avaliacao",4.8);x.addProperty("avaliacoesCount",320);x.addProperty("status","aberto");x.addProperty("statusLabel","Aberto agora");x.addProperty("horario","24h");x.addProperty("latitude",-23.5505);x.addProperty("longitude",-46.6333);return x;} private static JsonObject contact(String l,String n,String d){JsonObject x=new JsonObject();x.addProperty("label",l);x.addProperty("numero",n);x.addProperty("descricao",d);return x;}private static JsonObject note(String t,String d){JsonObject x=new JsonObject();x.addProperty("id",UUID.randomUUID().toString());x.addProperty("titulo",t);x.addProperty("descricao",d);x.addProperty("lida",false);x.addProperty("createdAt",Instant.now().toString());return x;}
}
