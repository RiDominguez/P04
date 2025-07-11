const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validaciones
  if (name.length < 3 || name.length > 16) {
    return setError('Your display name must be between 3 and 16 characters.');
  }
  if (email !== confirmEmail) {
    return setError('Emails do not match.');
  }
  if (password.length < 8) {
    return setError('Password must be 8 characters or more.');
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: name,
        email,
        password
      })
    });

    if (!res.ok) {
      const data = await res.json();
      return setError(data.message || "Registration failed");
    }

    // Registro exitoso → redirigir al login
    navigate("/login");

  } catch (err) {
    setError("An error occurred. Please try again later.");
  }
};

