import moment from "moment";

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(date) {
    if (!date) return ''

    return moment(date).format('DD/MM/YYYY');
}