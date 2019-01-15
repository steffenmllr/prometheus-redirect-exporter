const isEmpty = require('lodash.isempty');

const generateGauge = ({ value, name, help, labels }) => {
    if (!name || !value) {
        throw new Error('Please set at least the "name" and "valaue"!');
    }
    const strings = [];

    // Help
    if (help) {
        strings.push(`# HELP ${name} ${help}`)
    }

    // Type
    strings.push(`# TYPE ${name} gauge`);

    // Labels
    if (!isEmpty(labels)) {
        const labelValue = [];
        Object.keys(labels).forEach(key => {
            labelValue.push(`${key}="${labels[key]}"`);
        });
        strings.push(`${name}{${labelValue.join(', ')}} ${value}`);
    } else {
        strings.push(`${name} ${value}`);
    }

    return strings;
};

module.exports = {
    generateGauge
}
