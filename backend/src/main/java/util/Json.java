package util;

import com.google.gson.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/** Leitura e escrita JSON compartilhada pelos servlets. */
public final class Json {
    private Json() {}

    public static JsonObject body(HttpServletRequest request) throws IOException {
        String text = request.getReader().lines().reduce("", (a, b) -> a + b).trim();
        if (text.isEmpty()) return new JsonObject();
        JsonElement element = JsonParser.parseString(text);
        return element.isJsonObject() ? element.getAsJsonObject() : new JsonObject();
    }

    public static void send(HttpServletResponse response, int status, Object value) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().print(new Gson().toJson(value));
    }

    public static JsonObject error(String message) {
        JsonObject result = new JsonObject();
        result.addProperty("message", message);
        return result;
    }
}
