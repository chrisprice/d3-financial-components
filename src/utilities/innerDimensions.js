export default function(element) {
    var style = getComputedStyle(element);
    return {
        width: parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
        height: parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
    };
}
