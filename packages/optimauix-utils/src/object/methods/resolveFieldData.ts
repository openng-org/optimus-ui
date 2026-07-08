import isFunction from './isFunction';
import isNotEmpty from './isNotEmpty';

export default function resolveFieldData(data: any, field: any): any {
    if (!data || !field) {
        // short circuit if there is nothing to resolve
        return null;
    }

    try {
        const value = data[field];

        if (isNotEmpty(value)) return value;
    } catch {
        // Performance optimization: https://github.com/primefaces/primereact/issues/4797
        // do nothing and continue to other methods to resolve field data
    }

    if (Object.keys(data).length) {
        if (isFunction(field)) {
            return field(data);
        } else if (field.indexOf('.') === -1) {
            return data[field];
        } else {
            const fields = field.split('.');
            let value = data;

            for (let i = 0, len = fields.length; i < len; ++i) {
                if (value == null) {
                    return null;
                }

                value = value[fields[i]];
            }

            return value;
        }
    }

    return null;
}
