// Dog CEO API — https://dog.ceo/dog-api/
// Usada para mostrar razas de perros disponibles en la clínica

export interface BreedsResult {
  breeds: string[];
  error: string | null;
}

export async function fetchDogBreeds(): Promise<BreedsResult> {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json() as { message: Record<string, string[]>; status: string };
    const breeds = Object.keys(data.message).map(
      (b) => b.charAt(0).toUpperCase() + b.slice(1)
    );
    return { breeds, error: null };
  } catch (e: any) {
    return { breeds: [], error: e.message ?? 'Error desconocido' };
  }
}
