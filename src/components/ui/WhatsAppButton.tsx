type Props = {
    message: string;
    phone?: string;
};

export default function WhatsAppButton({
    message,
    phone = "5491112345678", // después esto va a config
}: Props) {
    const encodedMessage = encodeURIComponent(message);
    const href = `https://wa.me/${phone}?text=${encodedMessage}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "inline-block",
                marginTop: 12,
                padding: "10px 16px",
                backgroundColor: "#25D366",
                color: "white",
                borderRadius: 6,
                textDecoration: "none",
                fontWeight: 600,
            }}
        >
            Consultar por WhatsApp
        </a>
    );
}
