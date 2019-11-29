module.exports = {
    byViews: (arr) => {
        // 조회수를 기준으로 sort

        if (arr.length == 0) {
            return [];
        }

        var middle = arr[0];
        var len = arr.length;
        var left = [],
            right = [];

        for (var i = 1; i < len; ++i) {
            if (arr[i].views < middle.views) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }

        return QuickSort(left).concat(middle, QuickSort(right));
    },
    byLikes: (arr) => {
        // 좋아요를 기준으로 sort

        if (arr.length == 0) {
            return [];
        }

        var middle = arr[0];
        var len = arr.length;
        var left = [],
            right = [];

        for (var i = 1; i < len; ++i) {
            if (arr[i].like_count < middle.like_count) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }

        return QuickSort(left).concat(middle, QuickSort(right));
    }
}