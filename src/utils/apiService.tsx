export interface Country {
    name: string;
    capital: string;
    flag: string;
}

export async function getCountries(): Promise<Country[]> {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        console.log(response, "<><><")
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map((country: any) => ({
            name: country.name.common,
            capital: country.capital ? country.capital[0] : 'N/A',
            flag: country.flags.png
        }));
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
}
