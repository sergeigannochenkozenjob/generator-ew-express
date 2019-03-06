export default class Settings {
    get(name, defaultValue = null) {
        return process.env[name] || defaultValue;
    }

    set(name, value) {
    }
}
