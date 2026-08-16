/**
 * Tiện ích định dạng ngày giờ an toàn cho giao diện React.
 * Xử lý hoàn hảo các kiểu dữ liệu: chuỗi ISO, số timestamp, và đối tượng Firestore Timestamp ({ seconds, nanoseconds }).
 * Ngăn chặn tuyệt đối lỗi runtime: "Objects are not valid as a React child (found: object with keys {seconds, nanoseconds})".
 */

export function formatDisplayDate(val: any, fallback: string = "2026-08-10"): string {
  if (!val) return fallback;

  if (typeof val === "string") {
    // Nếu là chuỗi ISO hợp lệ
    if (val.includes("T") || val.includes("-")) {
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("vi-VN");
      }
    }
    return val;
  }

  if (typeof val === "number") {
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("vi-VN");
    }
    return fallback;
  }

  if (typeof val === "object") {
    // Firestore Timestamp có phương thức toDate()
    if (typeof val.toDate === "function") {
      try {
        return val.toDate().toLocaleDateString("vi-VN");
      } catch {}
    }
    // Firestore Timestamp có dạng { seconds: number, nanoseconds: number }
    if (typeof val.seconds === "number") {
      return new Date(val.seconds * 1000).toLocaleDateString("vi-VN");
    }
    // Firestore Admin SDK có dạng { _seconds: number, _nanoseconds: number }
    if (typeof val._seconds === "number") {
      return new Date(val._seconds * 1000).toLocaleDateString("vi-VN");
    }
  }

  return fallback;
}
