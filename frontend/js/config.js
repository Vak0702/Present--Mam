(function () {
    const localOrigins = [
        "http://localhost",
        "http://127.0.0.1",
        "file://",
    ];

    const isLocal = localOrigins.some((origin) =>
        window.location.origin.startsWith(origin)
    );

    window.PRESENT_MAM_API_BASE_URL =
        window.PRESENT_MAM_API_BASE_URL ||
        (isLocal
            ? "http://localhost:5000"
            : "https://your-backend-url.example.com");
})();
