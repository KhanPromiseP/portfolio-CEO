document.getElementById("contact-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Stops page reload & URL appending

    const formData = new FormData(e.target);

    try {
        const response = await fetch('../../api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });

        if (response.ok) {
            alert("Message sent successfully!");
            e.target.reset(); // Clear the form
        } else {
            alert("Failed to send. Please try again.");
        }
    } catch (error) {
        alert("Network error. Check console.");
        console.error(error);
    }
});