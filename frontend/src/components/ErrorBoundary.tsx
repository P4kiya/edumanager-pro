import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#0a0f1c",
            color: "#e2e8f0",
            fontFamily: "Inter, system-ui, sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
            Une erreur est survenue
          </h1>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", maxWidth: 480 }}>
            {this.state.error?.message || "Erreur de rendu inattendue."}
          </p>
          <button
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "#fff",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
            onClick={() => {
              this.setState({ hasError: false, error: null });
            }}
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
