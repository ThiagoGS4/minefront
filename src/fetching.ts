const API = import.meta.env.VITE_API_URL ||
  (window.location.hostname.endsWith('.azurestaticapps.net')
    ? 'https://garcia-mine-server.azurewebsites.net'
    : 'http://localhost:3000');

export default class callAPI {
  /* chamadas da VM */
  async checkStateVM() {
    const resp = await fetch(`${API}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
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
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
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
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
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
        "x-api-key": import.meta.env.VITE_API_KEY,
        //Authorization: `Bearer ${token}`,
      },
    });
    if (data.ok) {
      return await data.json();
    } else {
      throw new Error(data.toString());
    }
  }

  async startServer() {
    const data = await fetch(`${API}/startServer`, {
      method: "POST",
      headers: { "x-api-key": import.meta.env.VITE_API_KEY },
    });
    if (data.ok) {
      return await data.json();
    } else {
      throw new Error(data.toString());
    }
  }

  async stopServer() {
    const data = await fetch(`${API}/stopServer`, {
      method: "POST",
      headers: { "x-api-key": import.meta.env.VITE_API_KEY },
    });
    if (data.ok) {
      return await data.json();
    } else {
      throw new Error(data.toString());
    }
  }

  /* lida com mods */
  async listMods() {
    const data = await fetch(`${API}/mods`, {
      method: "GET",
      headers: { "x-api-key": import.meta.env.VITE_API_KEY },
    });
    if (data.ok) {
      return data.json();
    } else {
      throw new Error(data.toString());
    }
  }

  async addMods(files: File[]) {
    const formData = new FormData();
    for (const file of files) {
      formData.append("mods", file);
    }

    const resp = await fetch(`${API}/mods`, {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
      body: formData,
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    return await resp.json();
  }

  async removeMods(names: string[]) {
    console.log("names: -->", names);

    const resp = await fetch(`${API}/mods`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify({ names }),
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    return await resp.json();
  }

  async getWorldsList() {
    const data = await fetch(`${API}/worlds`, {
      method: "GET",
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
    });

    if (data.ok) {
      return data.json();
    } else {
      throw new Error(data.toString());
    }
  }

  async moveWorld() {
    const resp = await fetch(`${API}/moveWorld`, {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    return await resp.json();
  }

  async restoreWorld(world: string) {
    const resp = await fetch(`${API}/restoreWorld`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify({ world }),
    });

    const payload = await resp.json();

    if (!resp.ok) {
      throw new Error(payload?.error ?? `HTTP ${resp.status}`);
    }

    return payload;
  }
}
