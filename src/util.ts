function loadArray(obj: any) {
    if (obj === undefined || obj === null) return [];
    return Array.isArray(obj) ? obj : [obj];
}

export {
    loadArray
};
