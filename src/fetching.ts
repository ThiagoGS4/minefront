const API = "http://localhost:3000";

export default class callAPI {
    /* chamadas da VM */
  async checkStateVM() {
    const resp = await fetch(`${API}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'x-api-key': import.meta.env.VITE_API_KEY,
        //Authorization: `Bearer ${token}`,
      },
      //body: JSON.stringify(user),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  }
  async startVM() {
    const resp = await fetch(`${API}/start`, {
      method: "POST",
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY,
      }
      /* headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }, */
      //body: JSON.stringify(user),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  }
  async stopVM() {
    const resp = await fetch(`${API}/stop`, {
      method: "POST",
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY,
      }
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  }

  /* chamadas do server de mine */

 async checkServerStatus() {
    const data = await fetch(`${API}/mc/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'x-api-key': import.meta.env.VITE_API_KEY,
        //Authorization: `Bearer ${token}`,
      },
    });
    if (data.ok) {
      return await data.json()
    } else {
      throw new Error(data.toString());
    }
  }

  async startServer() {
    const data = await fetch(`${API}/startServer`, {
      method: 'POST',
      headers: {'x-api-key': import.meta.env.VITE_API_KEY,}
    });
    if (data.ok) {
      return await data.json()
    } else {
      throw new Error(data.toString());
    }
  }

  async stopServer() {
    const data = await fetch(`${API}/stopServer`, {
      method: 'POST',
      headers: {'x-api-key': import.meta.env.VITE_API_KEY,}
    });
   if (data.ok) {
      return await data.json()
    } else {
      throw new Error(data.toString());
    }
  }

  /* lida com mods */
  async listMods() {
    const data = await fetch(`${API}/mods`, {
      method: "GET",
    });
    if (data.ok) {
      return data.json()
    } else {
      throw new Error(data.toString());
    }
  }

  async addMods(files: File[]) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('mods', file);
  }

  const resp = await fetch(`${API}/mods`, {
    method: 'POST',
    headers: {
      'x-api-key': import.meta.env.VITE_API_KEY,
    },
    body: formData,
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }
  return await resp.json();
}

async removeMods(names: string[]) {
  const resp = await fetch(`${API}/mods`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_API_KEY,
    },
    body: JSON.stringify({ names }),
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }
  return await resp.json();
}

}
