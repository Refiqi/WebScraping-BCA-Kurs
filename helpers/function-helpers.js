module.exports = {

    // Function for Separating Data to array
    chunk: function chunk(array, size) {
        const chunked = [];
        let index = 0;

        while (index < array.length) {
            chunked.push(array.slice(index, index + size));
            index += size;
        }

        return chunked;
    },

    // Filtering raw data to be organized
    filterArray: function (str) {
        return str.split(" ")
            .map(item => item.replace(/\n/g, ""))
            .filter(Boolean);
    }
}