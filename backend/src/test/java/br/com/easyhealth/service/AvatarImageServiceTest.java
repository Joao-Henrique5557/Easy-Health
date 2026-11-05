package br.com.easyhealth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;

import javax.imageio.ImageIO;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class AvatarImageServiceTest {
    private final AvatarImageService avatars = new AvatarImageService();

    @Test
    void normalizesPngToSmallJpegDataUrl() throws Exception {
        BufferedImage image = new BufferedImage(64, 64, BufferedImage.TYPE_INT_ARGB);
        image.setRGB(16, 16, 0xff059669);
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        ImageIO.write(image, "png", bytes);

        String normalized = avatars.normalize("data:image/png;base64,"
                + Base64.getEncoder().encodeToString(bytes.toByteArray()));

        assertTrue(normalized.startsWith("data:image/jpeg;base64,"));
        byte[] decoded = Base64.getDecoder().decode(normalized.substring("data:image/jpeg;base64,".length()));
        assertTrue(decoded.length <= 44_000);
        assertEquals(64, ImageIO.read(new java.io.ByteArrayInputStream(decoded)).getWidth());
    }

    @Test
    void rejectsUnsupportedOrMalformedImages() {
        assertThrows(ResponseStatusException.class, () -> avatars.normalize("https://example.com/avatar.jpg"));
        assertThrows(ResponseStatusException.class, () -> avatars.normalize("data:image/jpeg;base64,not-base64"));
    }
}
