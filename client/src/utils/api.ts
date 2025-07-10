
export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(import.meta.env.VITE_API_URL + url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    // Token expirado o inválido
    localStorage.removeItem("token");
    window.location.href = "/login"; // o usa navigate("/login") si estás en React Router
    return;
  }

  return res;
}
