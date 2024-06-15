import { TCreateProduct } from '../../types';

export const toFormData = (data: TCreateProduct) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value) {
            formData.append(key, value.file as File);
        } else if (key === 'priceConfiguration' || key === 'attributes') {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, value as string);
        }
    });
    return formData;
};
