export const isInIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
};

export const uniqId = (domain) => {
    return domain + '_' + Math.random().toString(36).substr(2, 9);
}

export const get = (obj, value, defaultValue) => {
    try {
        return obj[value];
    } catch(e){
        return defaultValue;
    }
}
