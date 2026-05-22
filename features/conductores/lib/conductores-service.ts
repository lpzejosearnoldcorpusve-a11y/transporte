import type { Conductor, CreateConductorData, UpdateConductorData } from "@/types/conductor"

const API_PATH = "/api/conductores"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload?.error || `Error en la petición (${response.status})`
    throw new Error(message)
  }
  return response.json()
}

export const conductoresService = {
  async fetchAll(): Promise<Conductor[]> {
    const response = await fetch(API_PATH)
    return handleResponse<Conductor[]>(response)
  },

  async create(data: CreateConductorData): Promise<Conductor> {
    const response = await fetch(API_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse<Conductor>(response)
  },

  async update(id: string, data: UpdateConductorData): Promise<Conductor> {
    const response = await fetch(API_PATH, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    })
    return handleResponse<Conductor>(response)
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_PATH}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
    return handleResponse<{ message: string }>(response)
  },
}
