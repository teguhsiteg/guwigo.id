/**
 * Input validation helper functions
 */

export const validation = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (
    password: string,
  ): { valid: boolean; messages: string[] } => {
    const messages: string[] = [];

    if (password.length < 8) {
      messages.push("Minimal 8 karakter");
    }
    if (!/[A-Z]/.test(password)) {
      messages.push("Harus ada huruf besar (A-Z)");
    }
    if (!/[a-z]/.test(password)) {
      messages.push("Harus ada huruf kecil (a-z)");
    }
    if (!/[0-9]/.test(password)) {
      messages.push("Harus ada angka (0-9)");
    }

    // Check for weak passwords
    const weakPasswords = [
      "password",
      "12345678",
      "qwerty12",
      "admin123",
      "123123123",
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
      messages.push("Password terlalu umum");
    }

    return {
      valid: messages.length === 0,
      messages,
    };
  },

  isValidName: (name: string): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 100;
  },

  getPasswordStrength: (
    password: string,
  ): "weak" | "fair" | "good" | "strong" => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength < 2) return "weak";
    if (strength < 3) return "fair";
    if (strength < 5) return "good";
    return "strong";
  },

  getPasswordStrengthColor: (strength: string): string => {
    switch (strength) {
      case "weak":
        return "bg-red-500";
      case "fair":
        return "bg-yellow-500";
      case "good":
        return "bg-blue-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-slate-300";
    }
  },

  getPasswordStrengthText: (strength: string): string => {
    switch (strength) {
      case "weak":
        return "Lemah";
      case "fair":
        return "Cukup";
      case "good":
        return "Baik";
      case "strong":
        return "Sangat Kuat";
      default:
        return "";
    }
  },
};
