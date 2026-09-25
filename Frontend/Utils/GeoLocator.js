  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: "Geolocation unsupported" }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setLocation({
            address: data.display_name || `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`,
            loading: false,
            error: null,
          });
        } catch {
          setLocation({
            address: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
            loading: false,
            error: null,
          });
        }
      },
      () => setLocation((prev) => ({ ...prev, loading: false, error: "Location permission denied" }))
    );
  };
