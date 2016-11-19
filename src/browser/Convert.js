"use strict";

export class Convert {
    static b64 (s, k) {
        var enc = "";
        var str = "";
        str = s.toString();
        for (var i = 0; i < s.length; i++) {
            var a = s.charCodeAt(i);
            var b = a ^ k;
            enc = enc + String.fromCharCode(b);
        }
        return enc;
    }
};
