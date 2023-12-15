if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function() {
        // Clone this array.
        var result = this.concat();
		var arr = this;
        // Swap each element with another randomly selected one.
		var i;
        for (i = 0; i < result.length; i++) {
            var j = i;
            while (j === i) {
                j = Math.floor(Math.random() * result.length);
            }
            var contents = result[i];
            result[i]    = arr[j];
            result[j]    = contents;
        }

        return result;
    };
}