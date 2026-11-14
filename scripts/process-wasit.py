import cv2
import numpy as np
from PIL import Image

def apply_fighterx_red_lighting():
    clean_path = "public/assets/fighterx/wasit-referee-clean.png"
    img = Image.open(clean_path).convert("RGBA")
    arr = np.array(img).astype(np.float32)
    h, w, _ = arr.shape
    
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    
    # Binary mask of the referee
    bin_mask = (alpha > 40).astype(np.uint8)
    
    # Distance transform from edge inward
    dist_in = cv2.distanceTransform(bin_mask, cv2.DIST_L2, 5)
    
    # Edge rim mask: strongest at distance 1 to 5px, decaying to 0 at 16px
    rim_depth = 15.0
    norm_dist = np.clip(dist_in / rim_depth, 0.0, 1.0)
    rim_weight = np.where(dist_in > 0, 1.0 - norm_dist, 0.0)
    # Smooth step
    rim_weight = rim_weight * rim_weight * (3.0 - 2.0 * rim_weight)
    
    # Calculate directional edge normals using Sobel
    gx = cv2.Sobel(dist_in, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(dist_in, cv2.CV_32F, 0, 1, ksize=3)
    grad_mag = np.sqrt(gx**2 + gy**2)
    grad_mag = np.clip(grad_mag / (grad_mag.max() + 1e-5), 0.0, 1.0)
    
    # Combine distance falloff and edge gradient
    # Edges with higher curvature / sharpness get slightly stronger highlights
    rim_intensity = rim_weight * (0.6 + 0.5 * grad_mag)
    rim_intensity = np.clip(rim_intensity, 0.0, 1.0)
    
    # FighterX brand red: RGB (255, 26, 42)
    rim_r, rim_g, rim_b = 255.0, 26.0, 42.0
    
    # Screen blend for inner rim lighting
    # Formula: Screen(A, B) = 1 - (1 - A) * (1 - B)
    base_norm = rgb / 255.0
    rim_color_norm = np.array([rim_r, rim_g, rim_b], dtype=np.float32) / 255.0
    screen_blend = 1.0 - (1.0 - base_norm) * (1.0 - rim_color_norm)
    
    # Strength of inner rim light (e.g. 0.85 max factor)
    strength = rim_intensity[:, :, np.newaxis] * 0.85
    lit_rgb = (base_norm * (1.0 - strength) + screen_blend * strength) * 255.0
    
    # Add a thin, vibrant specular red line on the very perimeter (dist 1 to 3px)
    specular_fringe = np.clip((3.5 - dist_in) / 3.0, 0.0, 1.0) * (dist_in > 0)
    specular_fringe = specular_fringe[:, :, np.newaxis]
    lit_rgb[:, :, 0] = np.clip(lit_rgb[:, :, 0] + specular_fringe[:, :, 0] * 50.0, 0.0, 255.0)
    lit_rgb[:, :, 1] = np.clip(lit_rgb[:, :, 1] - specular_fringe[:, :, 0] * 15.0, 0.0, 255.0)
    lit_rgb[:, :, 2] = np.clip(lit_rgb[:, :, 2] - specular_fringe[:, :, 0] * 15.0, 0.0, 255.0)
    
    # Color the translucent edge fringe pixels (alpha between 5 and 230)
    # matching spotlight-referee-standard.png
    edge_pixels = (alpha > 5) & (alpha < 235)
    lit_rgb[edge_pixels, 0] = np.clip(lit_rgb[edge_pixels, 0] * 0.3 + 220.0 * 0.7, 0.0, 255.0)
    lit_rgb[edge_pixels, 1] = np.clip(lit_rgb[edge_pixels, 1] * 0.3 + 30.0 * 0.7, 0.0, 255.0)
    lit_rgb[edge_pixels, 2] = np.clip(lit_rgb[edge_pixels, 2] * 0.3 + 38.0 * 0.7, 0.0, 255.0)
    
    # Assemble full lit image
    out_arr = np.zeros((h, w, 4), dtype=np.uint8)
    out_arr[:, :, :3] = np.clip(lit_rgb, 0.0, 255.0).astype(np.uint8)
    out_arr[:, :, 3] = alpha.astype(np.uint8)
    
    final_lit = Image.fromarray(out_arr)
    
    # Save main lit asset
    out_path = "public/assets/fighterx/wasit-referee-lit.png"
    final_lit.save(out_path)
    print(f"Saved {out_path} ({final_lit.size})")
    
    # Create standardized spotlight asset (800x900)
    ys, xs = np.where(out_arr[:, :, 3] > 20)
    min_x, max_x = xs.min(), xs.max()
    min_y, max_y = ys.min(), ys.max()
    
    pad = 12
    crop_x1 = max(0, min_x - pad)
    crop_y1 = max(0, min_y - pad)
    crop_x2 = min(w, max_x + pad)
    crop_y2 = min(h, max_y + pad)
    cropped = final_lit.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    
    target_w, target_h = 800, 900
    spotlight_canvas = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    scale = 860.0 / cropped.height
    new_w = int(cropped.width * scale)
    new_h = int(cropped.height * scale)
    scaled_ref = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    pos_x = (target_w - new_w) // 2
    pos_y = target_h - new_h - 10
    spotlight_canvas.paste(scaled_ref, (pos_x, pos_y), scaled_ref)
    
    spotlight_path = "public/assets/fighterx/spotlight-wasit-standard.png"
    spotlight_canvas.save(spotlight_path)
    print(f"Saved {spotlight_path}")
    
    # Create waist-up card asset (800x750)
    waist_y = min_y + int((max_y - min_y) * 0.58)
    waist_crop = final_lit.crop((crop_x1, crop_y1, crop_x2, waist_y))
    waist_target_w, waist_target_h = 800, 750
    waist_canvas = Image.new("RGBA", (waist_target_w, waist_target_h), (0, 0, 0, 0))
    w_scale = 720.0 / waist_crop.height
    w_new_w = int(waist_crop.width * w_scale)
    w_new_h = int(waist_crop.height * w_scale)
    scaled_waist = waist_crop.resize((w_new_w, w_new_h), Image.Resampling.LANCZOS)
    w_pos_x = (waist_target_w - w_new_w) // 2
    w_pos_y = waist_target_h - w_new_h
    waist_canvas.paste(scaled_waist, (w_pos_x, w_pos_y), scaled_waist)
    
    waist_path = "public/assets/fighterx/wasit-waist-up-lit.png"
    waist_canvas.save(waist_path)
    print(f"Saved {waist_path}")

if __name__ == "__main__":
    apply_fighterx_red_lighting()
