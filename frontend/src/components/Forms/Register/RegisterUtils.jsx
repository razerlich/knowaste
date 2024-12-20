
export const fetchCities = async (setCities) => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/royts/israel-cities/master/israel-cities.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const cityNames = data.map(city => city.english_name)
            .filter(name => name && name.trim() !== "")
            .map(name => name
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            )
            .sort();

        setCities(cityNames);

    } catch (err) {
        console.error('Error fetching cities:', err);
        setCities(['Error fetching cities']); // הוספת אופציה להציג הודעת שגיאה ברשימה
    }
};

