const PROVIDERS = [
    'kanaries.net',
    // 'localhost'
]
export function hasAccess () {
    return PROVIDERS.includes(location.hostname.split('.').slice(-2).join('.'))
}