import AdmZip from "adm-zip";
import path from "path";

export interface SecurityScanResult {
  isSafe: boolean;
  violations: string[];
  warnings: string[];
  totalFilesScanned: number;
}

// Danh sách các phần mở rộng file bị CẤM TUYỆT ĐỐI (thực thi nhị phân, script hệ điều hành, server script)
const DISALLOWED_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".bash", ".ps1", ".vbs", ".msi", ".dll", ".so", ".dylib",
  ".php", ".phtml", ".jsp", ".asp", ".aspx", ".cgi", ".pl", ".py", ".rb",
  ".htaccess", ".htpasswd", ".env", ".ini",
]);

// Danh sách các pattern mã độc / lệnh nguy hiểm trong code Javascript, HTML
const DANGEROUS_CODE_PATTERNS = [
  {
    regex: /document\.cookie/i,
    label: "Truy cập cookie trái phép (document.cookie)",
    critical: true,
  },
  {
    regex: /localStorage\s*\[\s*["'](firebase|auth|token)/i,
    label: "Cố ý đánh cắp auth token trong localStorage",
    critical: true,
  },
  {
    regex: /(?:window|top|parent)\.location\s*=\s*["'](?:https?:\/\/|\/\/)/i,
    label: "Chuyển hướng trang nguy hiểm ra ngoài hệ thống (Phishing / Open Redirect)",
    critical: true,
  },
  {
    regex: /child_process|require\s*\(\s*["']child_process["']\s*\)/i,
    label: "Thực thi lệnh shell / child_process nguy hiểm",
    critical: true,
  },
  {
    regex: /eval\s*\(\s*atob\s*\(/i,
    label: "Mã hóa obfuscation độc hại (eval base64 payload)",
    critical: true,
  },
  {
    regex: /(?:<script[^>]*src=["']https?:\/\/(?!fonts\.|cdnjs\.|cdn\.|unpkg\.|esm\.sh)[^"']+["'][^>]*>)/i,
    label: "Nhúng script ngoại lai không thuộc danh sách an toàn",
    critical: false,
  },
  {
    regex: /crypto-miner|coinhive|cryptonight|webassembly.*miner/i,
    label: "Mã độc đào coin ẩn (Cryptominer)",
    critical: true,
  },
  {
    regex: /keylogger|addEventListener\s*\(\s*["']keydown["']\s*,\s*(?:async\s*)?\([^)]*\)\s*=>\s*fetch/i,
    label: "Keylogger gửi dữ liệu gõ phím của người dùng",
    critical: true,
  },
];

/**
 * Quét toàn diện file zip game HTML5 để phát hiện mã độc và vi phạm bảo mật
 */
export function scanGameZip(zipBufferOrPath: Buffer | string): SecurityScanResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  let totalFilesScanned = 0;

  try {
    const zip = new AdmZip(zipBufferOrPath);
    const zipEntries = zip.getEntries();

    if (zipEntries.length === 0) {
      return {
        isSafe: false,
        violations: ["File nén .zip hoàn toàn rỗng."],
        warnings: [],
        totalFilesScanned: 0,
      };
    }

    let hasIndexHtml = false;

    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;

      totalFilesScanned += 1;
      const fileName = entry.entryName;
      const ext = path.extname(fileName).toLowerCase();

      // 1. Kiểm tra Zip Slip (Path Traversal Attack)
      if (fileName.includes("..") || path.isAbsolute(fileName)) {
        violations.push(`Phát hiện lỗ hổng Zip Slip (Path Traversal): "${fileName}"`);
        continue;
      }

      // 2. Kiểm tra phần mở rộng file độc hại
      if (DISALLOWED_EXTENSIONS.has(ext)) {
        violations.push(`File chứa định dạng thực thi nguy hiểm bị cấm (${ext}): "${fileName}"`);
      }

      if (fileName.toLowerCase().endsWith("index.html")) {
        hasIndexHtml = true;
      }

      // 3. Quét sâu nội dung file văn bản (HTML, JS, SVG, JSON, CSS) để tìm mã độc
      if ([".html", ".htm", ".js", ".mjs", ".svg", ".json", ".txt"].includes(ext)) {
        try {
          const content = entry.getData().toString("utf8");

          // Kiểm tra dung lượng file đơn lẻ bất thường (> 15MB)
          if (entry.header.size > 15 * 1024 * 1024) {
            violations.push(`File "${fileName}" có kích thước vượt quá giới hạn 15MB cho một mã nguồn.`);
          }

          for (const pattern of DANGEROUS_CODE_PATTERNS) {
            if (pattern.regex.test(content)) {
              if (pattern.critical) {
                violations.push(`[Mã độc] Phát hiện trong "${fileName}": ${pattern.label}`);
              } else {
                warnings.push(`[Cảnh báo] Trong "${fileName}": ${pattern.label}`);
              }
            }
          }
        } catch {
          // Bỏ qua lỗi giải mã file nhị phân
        }
      }
    }

    if (!hasIndexHtml) {
      violations.push("Gói trò chơi không chứa file khởi chạy bắt buộc 'index.html'.");
    }

    return {
      isSafe: violations.length === 0,
      violations,
      warnings,
      totalFilesScanned,
    };
  } catch (err: any) {
    return {
      isSafe: false,
      violations: [`Không thể giải mã hoặc đọc file .zip: ${err?.message || "File nén bị hỏng."}`],
      warnings: [],
      totalFilesScanned,
    };
  }
}
