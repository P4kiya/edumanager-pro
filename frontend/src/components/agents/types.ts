export interface Agent {
  id: number;
  name: string;
  email: string;
  phone?: string;
  /** Hashed/stored on backend — only present when creating/updating. */
  password?: string;
  status: "active" | "inactive";
  /** List of module permission IDs the agent can access. */
  permissions: string[];
  createdAt: string;
}
