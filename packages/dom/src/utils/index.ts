export function createDomRules(data) {
    const tagName = data.tagName.toLowerCase();
    if (tagName === 'body') {
        return null;
    }
    let {
        innerText,
        classList = [],
        dataset,
        id,
        clientHeight,
        clientLeft,
        clientTop,
        clientWidth,
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth
    } = data;
    let classNames = classList.value;
    classNames = classNames !== '' ? ` class="${classNames}"` : '';
    const idStr = id ? ` id="${id}"` : '';
    return {
        tagName,
        innerText,
        classList,
        dataset,
        clientHeight,
        clientLeft,
        clientTop,
        clientWidth,
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth,
        elementAsString: `<${tagName}${idStr}${classNames !== '' ? classNames : ''}>${innerText}</${tagName}>`
    };
}
