package br.com.easyhealth.service;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Iterator;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.ImageOutputStream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AvatarImageService {
    private static final int MAX_INPUT_BYTES = 2_000_000;
    private static final int MAX_IMAGE_DIMENSION = 4096;
    private static final int OUTPUT_DIMENSION = 256;
    private static final int MAX_DATABASE_BYTES = 44_000;

    public String normalize(String dataUrl) {
        if (dataUrl == null || dataUrl.isBlank()) {
            return null;
        }
        String prefix;
        String encoded;
        if (dataUrl.startsWith("data:image/jpeg;base64,")) {
            prefix = "data:image/jpeg;base64,";
            encoded = dataUrl.substring(prefix.length());
        } else if (dataUrl.startsWith("data:image/png;base64,")) {
            prefix = "data:image/png;base64,";
            encoded = dataUrl.substring(prefix.length());
        } else {
            throw invalidImage();
        }

        try {
            byte[] input = Base64.getDecoder().decode(encoded);
            if (input.length == 0 || input.length > MAX_INPUT_BYTES) {
                throw invalidImage();
            }
            BufferedImage image = readImage(input);
            BufferedImage normalized = resize(image);
            byte[] jpeg = encodeJpeg(normalized);
            if (jpeg.length > MAX_DATABASE_BYTES) {
                throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,
                        "A imagem ficou muito grande após a compressão. Escolha outra foto.");
            }
            return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(jpeg);
        } catch (IllegalArgumentException exception) {
            throw invalidImage();
        } catch (IOException exception) {
            throw invalidImage();
        }
    }

    private static BufferedImage readImage(byte[] bytes) throws IOException {
        try (ImageInputStream input = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
            if (input == null) {
                throw invalidImage();
            }
            Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
            if (!readers.hasNext()) {
                throw invalidImage();
            }
            ImageReader reader = readers.next();
            try {
                reader.setInput(input, true, true);
                int width = reader.getWidth(0);
                int height = reader.getHeight(0);
                if (width <= 0 || height <= 0 || width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION
                        || (long) width * height > 16_777_216L) {
                    throw invalidImage();
                }
                BufferedImage image = reader.read(0);
                if (image == null) {
                    throw invalidImage();
                }
                return image;
            } finally {
                reader.dispose();
            }
        }
    }

    private static BufferedImage resize(BufferedImage source) {
        double scale = Math.min(1d, (double) OUTPUT_DIMENSION / Math.max(source.getWidth(), source.getHeight()));
        int width = Math.max(1, (int) Math.round(source.getWidth() * scale));
        int height = Math.max(1, (int) Math.round(source.getHeight() * scale));
        BufferedImage resized = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resized.createGraphics();
        try {
            graphics.setColor(java.awt.Color.WHITE);
            graphics.fillRect(0, 0, width, height);
            graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
            graphics.drawImage(source, 0, 0, width, height, null);
        } finally {
            graphics.dispose();
        }
        return resized;
    }

    private static byte[] encodeJpeg(BufferedImage image) throws IOException {
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
        if (!writers.hasNext()) {
            throw invalidImage();
        }
        ImageWriter writer = writers.next();
        try {
            for (float quality : new float[] { 0.7f, 0.55f, 0.4f, 0.25f }) {
                ByteArrayOutputStream output = new ByteArrayOutputStream();
                try (ImageOutputStream imageOutput = ImageIO.createImageOutputStream(output)) {
                    writer.setOutput(imageOutput);
                    ImageWriteParam parameters = writer.getDefaultWriteParam();
                    parameters.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                    parameters.setCompressionQuality(quality);
                    writer.write(null, new IIOImage(image, null, null), parameters);
                }
                if (output.size() <= MAX_DATABASE_BYTES) {
                    return output.toByteArray();
                }
            }
            return new byte[MAX_DATABASE_BYTES + 1];
        } finally {
            writer.dispose();
        }
    }

    private static ResponseStatusException invalidImage() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Escolha uma imagem JPEG ou PNG válida de até 2 MB.");
    }
}
