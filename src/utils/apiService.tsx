export interface Country {
    name: string;
    capital: string;
    flag: string;
}

export async function getCountries(): Promise<Country[]> {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map((country: any) => {
            const name = country?.name?.common ?? 'Unknown';
            const capital = country.capital.length > 0 ? country.capital.join(', ') : 'Not Provided';
            const flag = country?.flags?.png ?? 'https://via.placeholder.com/320x240.png?text=No+Flag';

            return {
                name,
                capital,
                flag
            };
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
}
