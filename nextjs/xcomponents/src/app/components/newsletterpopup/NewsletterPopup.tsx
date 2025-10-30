"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState("");

  // Mostrar el popup después de 2 segundos al cargar la página
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!acceptedTerms) {
      setMessage("Debes aceptar los términos y condiciones para suscribirte...");
      return;
    }

    try {
      // -> Enviar como FormData para que PHP lea $_POST['email']
      const formData = new FormData();
      formData.append("email", email);

      const response = await fetch("/php/guardar_email.php", {
        method: "POST",
        body: formData, 
        cache: "no-store",
      });

      // El PHP devuelve JSON { success: bool, message?: string, error?: string }
      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message || "¡Bienvenido(a)!");
        setEmail("");
        setTimeout(handleClose, 3000);
      } else {
        setMessage(data.error || "Algo salió mal. Por favor, intenta de nuevo.");
      }
    } catch {
      setMessage("Error al suscribirte. Por favor, intenta de nuevo.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
      "
    >
      {/* Tarjeta glassmorphism */}
      <div
        className="
          relative w-full max-w-md
          rounded-2xl border shadow-xl
          p-6 md:p-7
          text-[color:var(--text)] glass
        "
        style={{
          WebkitBackdropFilter: "blur(18px)",
          backdropFilter: "blur(18px)",
          borderColor: "var(--border)",
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="
            absolute top-3.5 right-3.5
            inline-flex h-9 w-9 items-center justify-center
            rounded-full border
            transition
            hover:opacity-80
            focus:outline-none focus:ring-2 focus:ring-offset-2
          "
          style={{
            borderColor: "var(--border)",
            color: "var(--text)",
            background: "color-mix(in srgb, var(--bg) 30%, transparent)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          }}
          aria-label="Cerrar"
        >
          {/* X simple */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2
          className="mb-4 text-2xl font-semibold"
          style={{ fontFamily: "EB Garamond" }}
        >
          Suscríbete a nuestro boletín
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Ingresa tu email"
              className="
                newsletter w-full rounded-xl
                px-3 py-2.5
                outline-none transition
                border bg-transparent
                focus:ring-2
              "
              style={{
                fontFamily: "EB Garamond",
                color: "var(--text)",
                borderColor: "var(--border)",
                caretColor: "var(--accent)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Checkbox términos */}
          <label className="flex items-start gap-2 text-sm leading-6">
            <input
              type="checkbox"
              className="mt-1.5 h-4 w-4 rounded-sm"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
              style={{ accentColor: "var(--accent)" }}
            />
            <span>
              Acepto los{" "}
              <Link
                href="/terminos-y-condiciones"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--accent)" }}
              >
                términos y condiciones
              </Link>
              .
            </span>
          </label>

          {/* Botón enviar tematizado */}
          <button
            type="submit"
            className="
              w-full rounded-xl px-4 py-2.5
              border font-medium transition
              focus:outline-none focus:ring-2 focus:ring-offset-2
            "
            style={{
              color: "var(--text)",
              background: "var(--bg)",
              borderColor: "color-mix(in srgb, var(--bg) 60%, transparent)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.95";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
          >
            Suscribirse
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm" style={{ color: "var(--accent)" }}>
            {message}
          </p>
        )}

        {/* Placeholder and theme helpers*/}
        <style jsx>{`
          .newsletter::placeholder {
            color: color-mix(in srgb, var(--text) 60%, transparent);
          }
          @supports not (color: color-mix(in srgb, black, white)) {
            .newsletter::placeholder {
              opacity: 0.6;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default NewsletterPopup;
