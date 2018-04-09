export const imagesPath = '/assets/censored/';

export const apiUrl = 'http://192.168.1.105:8080';

export function buildApiUrl(path: string) {
    return apiUrl + path;
}