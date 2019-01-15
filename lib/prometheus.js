const isEmpty = require('lodash.isempty');

const convertValue = (value) => {
    value = Number(value || 0)
    if (isNaN(value)) {
        return 0;
    }
    return value;
}

const generateGauge = ({ value, name, help, labels }) => {
    if (!name) {
        throw new Error('Please set at least the "name"!');
    }
    const strings = [];

    // Convert value
    const convertedValue = convertValue(value);

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
        strings.push(`${name}{${labelValue.join(', ')}} ${convertedValue}`);
    } else {
        strings.push(`${name} ${convertedValue}`);
    }

    return strings;
};

module.exports = {
    generateGauge
}
